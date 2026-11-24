---
name: conventional-commit
description: Use when writing a commit message or checking one before it is committed. Applies the Conventional Commits subject, the body rules, and real line breaks that Release Please reads.
---

# Conventional commit

If the repository's AGENTS.md defines other types or limits, follow the repository. Its release tooling depends on them.

## Subject

Format: `type(scope): description`. For a breaking change, write `type!: description` or `type(scope)!: description`.

1. Choose the type. Use the first type in this list that fits:
   - `fix`: a user-visible bug is corrected.
   - `feat`: new behavior is added.
   - `perf`: behavior is the same, and it is measurably faster or lighter.
   - `refactor`: behavior is the same, and the structure changes.
   - `test`: only tests change.
   - `docs`: only documentation changes.
   - `style`: only formatting changes.
   - `build`: build tooling or dependencies change.
   - `ci`: CI configuration changes.
   - `revert`: the commit reverts an earlier commit.
   - `chore`: anything else, with no behavior change.

   Why: Release Please reads the type to choose the next version. A wrong type publishes a wrong release.

2. Add a scope when the change lives in one package or skill. Use that package or skill's lowercase name. Omit the scope for repo-wide changes.
3. Write the description in the imperative mood, in lowercase, with no final period. Keep the whole subject at 72 characters or fewer.

   Why: longer subjects are cut off in `git log --oneline` and in release notes.

4. Mark a breaking change with `!`. Describe the break in the body.

## Body

1. Write a body when the staged diff changes more than 3 files or more than 50 lines. Write a subject only for smaller changes.

   Why: the diff shows what changed. A body explains why, which the diff cannot show.

2. Put one blank line between the subject and the body.
3. Write each body point as a Markdown bullet. Each bullet states one fact about the change.
4. Use real line breaks. Never type the two characters backslash and `n`.

   Why: the literal characters are stored in the commit and appear in every log.

5. Do not claim a result without evidence. Write "faster" only with a measurement.

## Validate

Save the message to a file, then run:

```sh
node <skill-dir>/scripts/verify-commit-message.mjs --file <message-file>
```

Exit code 0 means the message is valid. Exit code 1 lists each failed rule. Fix the file and run the check again. Never commit a message that fails.

To check a commit that already exists:

```sh
node <skill-dir>/scripts/verify-commit-message.mjs --commit <ref>
```
