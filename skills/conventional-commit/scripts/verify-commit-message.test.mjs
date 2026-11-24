import assert from "node:assert/strict";
import { test } from "node:test";

import { validateCommitMessage } from "./verify-commit-message.mjs";

test("accepts a subject-only message", () => {
  assert.deepEqual(validateCommitMessage("fix(skills): correct the branch name rule"), []);
});

test("accepts a body after a blank line", () => {
  const message = "feat: add the eval runner\n\n- Runs each eval case.\n- Reports failures.\n";

  assert.deepEqual(validateCommitMessage(message), []);
});

test("accepts a breaking change marker", () => {
  assert.deepEqual(validateCommitMessage("feat(api)!: drop the v1 endpoint"), []);
});

test("rejects a subject without a type", () => {
  assert.equal(validateCommitMessage("Add the eval runner").length, 1);
});

test("rejects an unknown type", () => {
  assert.equal(validateCommitMessage("feature: add the eval runner").length, 1);
});

test("rejects a description longer than 72 characters", () => {
  const subject = `feat: ${"a".repeat(73)}`;

  assert.equal(validateCommitMessage(subject).length, 1);
});

test("rejects a body without a blank line after the subject", () => {
  const errors = validateCommitMessage("fix: correct a rule\n- body without a blank line");

  assert.equal(errors.length, 1);
  assert.match(errors[0], /second line must be empty/u);
});

test("rejects literal escaped newlines", () => {
  const errors = validateCommitMessage("fix: correct a rule\\n\\n- one bullet");

  assert.equal(errors.length, 1);
  assert.match(errors[0], /literal/u);
});
