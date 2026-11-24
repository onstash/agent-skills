#!/usr/bin/env node
// Checks every skill under skills/:
//   1. SKILL.md has frontmatter with name (equal to the directory) and a description that says when to use the skill.
//   2. Every relative Markdown link in SKILL.md points to a file that exists.
//   3. evals/*.json holds valid eval cases with unique ids.
//
// Exit code 0: all checks pass. Exit code 1: one or more checks failed.

import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve("skills");
const errors = [];
const seenEvalIds = new Set();
let evalCount = 0;

const skills = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const skill of skills) {
  const dir = join(root, skill);

  let source;
  try {
    source = await readFile(join(dir, "SKILL.md"), "utf8");
  } catch {
    errors.push(`${skill}: SKILL.md is missing`);
    continue;
  }

  checkFrontmatter(skill, source);
  await checkLinks(skill, dir, source);
  await checkEvals(skill, dir);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  process.exitCode = 1;
} else {
  console.log(`Verified ${skills.length} skills and ${evalCount} eval cases.`);
}

function checkFrontmatter(skill, source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/u);

  if (!match) {
    errors.push(`${skill}: SKILL.md has no frontmatter`);
    return;
  }

  const name = match[1].match(/^name:\s*(.+)$/mu)?.[1]?.trim();
  const description = match[1].match(/^description:\s*(.+)$/mu)?.[1]?.trim();

  if (name !== skill) {
    errors.push(`${skill}: frontmatter name must equal the directory name, got "${name}"`);
  }

  if (!description) {
    errors.push(`${skill}: frontmatter description is required`);
  } else if (!/\bUse (when|for|before|after)\b/u.test(description)) {
    errors.push(`${skill}: description must say when to use the skill ("Use when ...")`);
  }
}

async function checkLinks(skill, dir, source) {
  for (const [, target] of source.matchAll(/\]\((?!https?:|#)([^)\s]+)\)/gu)) {
    try {
      await stat(resolve(dir, target));
    } catch {
      errors.push(`${skill}: link "${target}" points to a file that does not exist`);
    }
  }
}

async function checkEvals(skill, dir) {
  const evalDir = join(dir, "evals");

  let files = [];
  try {
    files = (await readdir(evalDir)).filter((file) => file.endsWith(".json")).sort();
  } catch {
    // Handled below: a missing directory has no eval files.
  }

  if (files.length === 0) {
    errors.push(`${skill}: no eval cases in evals/`);
    return;
  }

  for (const file of files) {
    const path = join(evalDir, file);
    let value;

    try {
      value = JSON.parse(await readFile(path, "utf8"));
    } catch {
      errors.push(`${path}: not valid JSON`);
      continue;
    }

    if (value.skill !== skill) {
      errors.push(`${path}: skill must be "${skill}"`);
    }

    if (!/^[a-z0-9][a-z0-9-]*$/u.test(value.id ?? "")) {
      errors.push(`${path}: id must be kebab-case`);
    } else if (seenEvalIds.has(value.id)) {
      errors.push(`${path}: duplicate eval id "${value.id}"`);
    } else {
      seenEvalIds.add(value.id);
    }

    if (!value.scenario?.trim()) {
      errors.push(`${path}: scenario is required`);
    }

    const criteria = value.acceptanceCriteria;
    if (
      !Array.isArray(criteria) ||
      criteria.length === 0 ||
      criteria.some((item) => !item?.trim?.())
    ) {
      errors.push(`${path}: acceptanceCriteria must be a non-empty list of text`);
    }

    evalCount += 1;
  }
}
