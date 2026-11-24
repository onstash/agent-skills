# agent-skills

This repository holds reusable agent skills. Each skill is one folder under `skills/`.

## Skills

| Skill                  | Use it to                                                |
| ---------------------- | -------------------------------------------------------- |
| `prepare-worktree`     | Record the starting state and create a branch.           |
| `implement-and-verify` | Make a change and run the checks in order.               |
| `conventional-commit`  | Write and validate a Conventional Commit message.        |
| `commit-safely`        | Stage the requested paths and commit from a file.        |
| `create-or-update-pr`  | Open or update a pull request.                           |
| `babysit-pr`           | Monitor a pull request until its state is known.         |
| `merge-and-rebase`     | Merge an authorized pull request and update the base.    |
| `ship-change-safely`   | Run the full change workflow in order.                   |
| `rca-and-prevention`   | Find root causes and prevention actions for an incident. |
| `laws-of-ux`           | Review an interface decision against UX principles.      |
| `install-anti-slop`    | Install or update the vendored anti-slop Oxlint plugin.  |

## Each skill folder contains

- `SKILL.md`: the procedure. Its frontmatter has `name` and `description`.
- `evals/*.json`: test cases that describe expected behavior.
- `references/`, `scripts/`, `assets/`: optional support files.
- `CHANGELOG.md` and `version.txt`: release metadata for Release Please.

## Commands

```sh
pnpm install     # install tools and set up git hooks
pnpm verify      # format, lint, unit tests, and skill checks
```

The `commit-msg` hook runs `skills/conventional-commit/scripts/verify-commit-message.mjs`.
