---
name: merge-and-rebase
description: Use when the user has authorized the merge of a named pull request. Checks the merge gates, squash-merges against the verified head commit, and brings the local base branch up to date with its upstream.
---

# Merge and rebase

## Authorization

The user must name this PR, by number or URL, in the current conversation and ask for its merge. A request to finish the work does not count.

Why: a merge changes the shared base branch. Each merge needs its own approval.

If the user has not authorized this PR, stop. Report that the PR is ready to merge, and ask.

## Gates

All four must hold. If one fails, stop and report which one.

1. `gh pr view <number> --json headRefOid,state,mergeable,reviewDecision,statusCheckRollup` shows `state` `OPEN`, `mergeable` `MERGEABLE`, and `reviewDecision` that is not `CHANGES_REQUESTED`.
2. Every check in `statusCheckRollup` has conclusion `SUCCESS`, or is skipped and not required.
3. `headRefOid` is the SHA that `babysit-pr` verified.

   Why: a push after verification would merge code nobody checked.

4. No review comment is unresolved.

## Merge

```sh
gh pr merge <number> --squash --match-head-commit <headRefOid> --delete-branch
```

`--match-head-commit` makes GitHub refuse the merge if the head moved. Never add `--admin`. Never bypass a failing gate.

Record the result:

```sh
gh pr view <number> --json state,mergeCommit --jq '{state, sha: .mergeCommit.oid}'
```

`state` must be `MERGED`. Report the merge commit SHA only after this check returns it.

## Update the base

1. `git switch <base>`.
2. `git pull --ff-only origin <base>`. If this fails, stop and report it.

   Why: a non-fast-forward pull means the local base has commits the remote does not. A merge would hide them.

3. Run `git status --short --branch` and report the output.

## Never

- Run `git reset --hard`, `git clean`, or `git checkout -- <path>` to get a clean status. Report dirty paths instead. Why: these commands delete uncommitted work.
- Run `git push --force` during a merge.
- Delete a local branch with `git branch -D`. Use `git branch -d`, which refuses unmerged work.
