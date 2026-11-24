---
name: create-or-update-pr
description: Use when opening a pull request for the current branch or updating its open pull request. Chooses create or edit from live GitHub state, validates the title, and writes the body from the actual diff.
---

# Create or update a pull request

Use the `gh` CLI. Read the PR state from GitHub each time. Do not rely on memory of an earlier run.

## Procedure

1. Find the base branch: `gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`. Use this branch unless the user names another base.
2. Check that the branch has commits to review: `git log --oneline <base>..HEAD`. If the output is empty, stop and report that there is no change to review.
3. Read the diff: `git diff --stat <base>...HEAD`. Write the title and body from this diff.
4. Find the PR for this branch: `gh pr view --json number,url,state,headRefOid`.
   - `OPEN`: go to step 6.
   - No PR: go to step 5, then step 7.
   - `CLOSED` or `MERGED`: stop and ask the user whether to open a new PR.

   Why: a new PR from a branch with a closed PR can duplicate review work the user has not approved.

5. Push the branch: `git push -u origin <branch>`. Never force push unless the user authorizes it. Why: a force push replaces the commits a reviewer has already read.
6. Update the open PR: `gh pr edit <number> --title <title> --body-file <body-file>`. Push first, so the body describes the head that reviewers will read.
7. Create the PR: `gh pr create --base <base> --head <branch> --title <title> --body-file <body-file>`.

## Title

Write the title in the `conventional-commit` subject format. Validate it before you use it:

```sh
printf '%s\n' "<title>" > "$title_file"
node <conventional-commit-dir>/scripts/verify-commit-message.mjs --file "$title_file"
```

Why: a squash merge uses the PR title as the commit subject. An invalid title becomes an invalid commit on the base branch.

## Body

Write the body to a file with real line breaks. Never pass a body with escaped `\n` text. Use these sections, in this order, each as a `##` heading:

- `## Summary`: one to three bullets. State the change for a user or maintainer.
- `## Verification`: each command you ran, with its exit code.
- `## Limitations`: what the change does not cover, and why. Write "None" when nothing is left out.

## Report

Report the PR URL from `gh pr view --json url --jq .url`. If the host provides a tool that links a PR to the thread, call it with that URL before you report.
