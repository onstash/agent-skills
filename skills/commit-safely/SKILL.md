---
name: commit-safely
description: Use when committing a requested change. Stages only the requested paths, checks the message with the conventional-commit validator, commits from a file, and reports the commit SHA.
---

# Commit safely

Use the `conventional-commit` skill for the message rules. This skill covers the staging and commit steps.

## Procedure

1. Stage the requested paths only: `git add -- <path> [<path> ...]`. Never run `git add -A` or `git add .`.

   Why: those commands stage unrelated files. A file in a commit cannot be removed without rewriting history.

2. Check the staged set: `git status --short` and `git diff --cached --stat`. Each staged path must belong to the requested change. If a staged path does not, unstage only that path with `git restore --staged -- <path>`.
3. Check whitespace: `git diff --cached --check`. The exit code must be 0. If it fails, fix the lines it lists, then stage the same paths again.
4. Choose the body. Run `git diff --cached --shortstat`, then apply the body rule in `conventional-commit`.
5. Write the message to a file, for example `msg=$(mktemp)`. Validate it with `conventional-commit`. Fix the file until the check passes.
6. Commit from the file: `git commit -F "$msg"`.

   Never use `--no-verify`. Why: the commit-msg hook runs the same validator. Skipping it lets an invalid message into history.

7. Verify the result: `git log -1 --format=%B` must match the file. Run the validator with `--commit HEAD`.
8. Report the short SHA from `git rev-parse --short HEAD` and the exact message.

## Stop when

- Nothing is staged after step 1. Report that there is nothing to commit. Do not stage extra files to make a commit.
- The validator fails twice on the same rule. Report the rule and the message. Ask for the intended wording.
