---
name: implement-and-verify
description: Use when making a code change that must be proven correct. Makes a focused edit, runs format, lint, typecheck, and focused tests in order, runs the full gate for high-risk changes, and reports each command with its result.
---

# Implement and verify

## Before editing

1. Read the nearest AGENTS.md or CLAUDE.md to the files you will change. Its rules override this skill.
2. Write two lines: the behavior that changes, and what does not change.
3. Read each file you will edit, and the files that import it.

## Edit

- Make one behavior change per edit set.
- Do not reformat code you did not change.

  Why: formatting churn hides the real change in review.

## Check, in order

Find the commands in `package.json` scripts, a Makefile, or AGENTS.md. Run each one that exists. Stop at the first failure. Fix it, then run the checks again from the start.

1. Format check.
2. Lint.
3. Typecheck.
4. Focused tests: the tests that cover the files you changed.
5. Full gate (`pnpm verify`, `make check`, or the equivalent in AGENTS.md). Run this only when the change is high-risk.

A change is high-risk when it does any of these:

- changes a module that other modules import;
- changes build or lint configuration;
- changes an exported type or public API;
- changes a database schema or migration;
- changes a file that a search for its import path shows in more than 5 other files.

Why: these changes break code that the focused tests do not cover.

6. Run `git diff --check`. The exit code must be 0.

## Report

For each command, report:

- the exact command;
- the exit code;
- the first 20 lines of any error;
- the next action, when the command failed.

If the repository has no command for a step, write "not configured". Do not invent a command.
