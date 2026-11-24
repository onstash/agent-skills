---
name: prepare-worktree
description: Use before implementing a change in a repository that already has work in progress. Records the starting state, keeps unrelated changes in place, and creates a named branch from the intended base.
---

# Prepare a worktree

## Record the starting state

Run each command and keep its output for the report:

```sh
git status --short --branch
git rev-parse HEAD
git rev-parse --abbrev-ref --symbolic-full-name @{u}
```

If the last command fails, record "no upstream" and continue.

## Decide

1. If a tracked change overlaps a file this task will edit, stop. Report the overlapping paths and ask how to proceed.

   Why: an edit made on top of unrelated work commits that work under this task's name.

2. Otherwise, continue. Leave unrelated tracked and untracked changes where they are.

## Create the branch

1. Fetch: `git fetch origin`. Fetching does not change local work.
2. Rebase the base branch only when the user authorizes it. Otherwise, branch from the remote base as it stands.
3. Create the branch from the remote base:

   ```sh
   git switch -c <branch> origin/<base>
   ```

   The name is `<type>/<short-kebab-description>`. Use the type from `conventional-commit`, for example `fix/pr-state-check`.

   Why: the name tells a reviewer the intent before they read the diff.

4. If a branch with that name already exists, stop and ask. Never overwrite it.

## Never

- Run `git reset`, `git clean`, `git checkout -- <path>`, `git stash`, or `rm` on any path that this task did not create.

  Why: each command can delete work the user has not committed. A stash hides changes from the next `git status`.

## Report

The starting branch, starting SHA, upstream, every dirty path (tracked and untracked), the new branch name, and the base SHA. This report is the audit trail for the rest of the task.
