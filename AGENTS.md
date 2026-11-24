# Repository instructions

## Scope

This file applies to the whole repository.

## Skill structure

- Put each skill in `skills/<name>/`.
- The folder name must equal the `name` field in `SKILL.md`.
- Write the `description` field as a trigger: start with "Use when" or "Use before".
- Keep a skill's scripts, references, and evals inside its folder.
- Do not link to files outside the skill folder. A skill can be installed alone.

## Writing rules

- Write each rule as a step the agent can follow.
- Give a reason for each rule that is not obvious.
- Define each term that a rule uses. Do not leave "when available" or "high risk" undefined.
- Use "always" and "never" for hard rules. Do not use "try to" or "where appropriate".
- Write commands in full. Do not name a tool without its command.
- Use sentence case in headings. Do not use em dashes.

## Verification

Run `pnpm verify` before you commit. The command runs format checks, lint, unit tests, and the skill checks in `scripts/verify-skills.mjs`.

## Documentation

Write documentation in Simplified Technical English. Use short sentences and active voice.
