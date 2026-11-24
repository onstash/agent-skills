---
name: babysit-pr
description: Use when a pull request must be monitored until its checks, merge state, and review decision are known. Reads live GitHub state, names the next action for each state, and stops once all three are known.
---

# Babysit a pull request

Read the state from GitHub. A local checkout cannot prove that checks passed on the code you have.

## Read the state

```sh
gh pr view <number> --json url,headRefOid,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup
```

1. Compare `headRefOid` with `git rev-parse HEAD`. If they differ, the checks ran on another commit. Push or fetch so the two match, then read the state again.

   Why: a green check on an old commit says nothing about the code you have.

2. Sort each check in `statusCheckRollup`:
   - pending: no conclusion yet.
   - passing: conclusion `SUCCESS`.
   - failing: any other conclusion.

   Run `gh pr checks <number>` to see which checks are required.

3. Read `mergeable`: `MERGEABLE`, `CONFLICTING`, or `UNKNOWN`. Treat `UNKNOWN` as not known. Read again.
4. Read `reviewDecision`: `APPROVED`, `CHANGES_REQUESTED`, `REVIEW_REQUIRED`, or empty when no review is required.

## Act on each state

| State                                                 | Action                                                                                                                                                     |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A check is failing                                    | Capture the run URL and the failing log with `gh run view <run-id> --log-failed` before you edit code. Report both. Fix only when the user asks for a fix. |
| `CONFLICTING`                                         | Stop. Report the conflict. Resolve it only when the user asks.                                                                                             |
| `CHANGES_REQUESTED`                                   | List each review comment with its author and file location, from `gh pr view <number> --comments`. Stop and report.                                        |
| A check is pending                                    | Wait. If the host provides a PR watcher, use it. Otherwise read the state again on the next turn. Do not poll with a sleep loop.                           |
| Every check passes, `MERGEABLE`, no changes requested | Go to "Done".                                                                                                                                              |

## Done

Monitoring is done when all three are known: every check has a conclusion, `mergeable` is `MERGEABLE` or `CONFLICTING`, and `reviewDecision` has a value.

Why: a PR can look green while a required check has not started yet.

Before you report, stop any host watcher you started. Report the PR URL, the head SHA, and the state of each item.
