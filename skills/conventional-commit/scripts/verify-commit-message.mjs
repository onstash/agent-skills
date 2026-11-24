#!/usr/bin/env node
// Validates a Conventional Commit message.
//
//   node verify-commit-message.mjs --file <message-file>   check a draft or a commit-msg hook file
//   node verify-commit-message.mjs --commit <ref>          check an existing commit (default HEAD)
//
// Exit code 0: valid. Exit code 1: one or more rules failed.

import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const TYPES = [
  "build",
  "chore",
  "ci",
  "docs",
  "feat",
  "fix",
  "perf",
  "refactor",
  "revert",
  "style",
  "test",
];

const SUBJECT = new RegExp(`^(${TYPES.join("|")})(\\([^)\\s]+\\))?!?: .{1,72}$`, "u");

export function validateCommitMessage(message) {
  const errors = [];
  const lines = message.split(/\r?\n/u);
  const subject = lines[0];

  if (!SUBJECT.test(subject)) {
    errors.push(
      `subject must be "type(scope): description" with a type from [${TYPES.join(", ")}] and a description of 1 to 72 characters: "${subject}"`,
    );
  }

  if (lines.length > 1 && lines[1].trim() !== "") {
    errors.push("the second line must be empty, so the body is separated from the subject");
  }

  if (/\\[nr]/u.test(message)) {
    errors.push("the message contains a literal \\n or \\r; use real line breaks");
  }

  return errors;
}

function argumentValue(args, flag) {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
}

async function readMessage(args) {
  const file = argumentValue(args, "--file");

  if (file !== undefined) {
    return { source: file, message: await readFile(file, "utf8") };
  }

  const commit = argumentValue(args, "--commit") ?? "HEAD";
  const message = execFileSync("git", ["show", "-s", "--format=%B", commit], {
    encoding: "utf8",
  });

  return { source: commit, message };
}

async function main() {
  const { source, message } = await readMessage(process.argv.slice(2));
  const errors = validateCommitMessage(message);

  if (errors.length === 0) {
    console.log(`${source}: valid`);
    return;
  }

  for (const error of errors) {
    console.error(`${source}: ${error}`);
  }

  process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
