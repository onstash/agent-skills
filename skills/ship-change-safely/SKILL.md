---
name: ship-change-safely
description: Use when a code change must go from a clean worktree to a verified, merged pull request. Runs the other skills in order, stops at the first failed step, and reports only what command or GitHub output proves.
---

# Ship a change safely

Run these skills in order. Stop at the first step that fails.

1. `prepare-worktree`. Record the starting state and create the branch.
2. Confirm the scope before you edit:
   - the files you will change;
   - the base branch, from `git symbolic-ref --short refs/remotes/origin/HEAD`;
   - the verify command, from the repository's AGENTS.md, then the `verify` script in `package.json`.

   Stop and ask when the repository defines no verify command.

   Why: the verify command is the only gate that proves the repository still works.

3. Make the smallest change that meets the request.
4. `implement-and-verify`.
5. `commit-safely`.
6. `create-or-update-pr`.
7. `babysit-pr`. Continue until every check and review state is known.
8. `merge-and-rebase`, only when the user has authorized the merge of this PR. Otherwise, report the PR as ready to merge and stop.

## Report

- Each command you ran, with its exit code.
- The commit SHA and message.
- The PR URL and head SHA.
- The merge state from `gh pr view`, or "not merged: not authorized".
- Anything you did not verify.

## Rules

- Never claim a merge, a deployment, or a passing check without command or GitHub output that shows it.
- Never skip a step to save time. Report a skipped step as skipped, with the reason.
- Repository settings, such as the verify command, the base branch, and protected branches, come from the repository's AGENTS.md. This skill does not define them.
