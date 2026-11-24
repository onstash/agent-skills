---
name: install-anti-slop
description: Use when adding, configuring, updating, or migrating the vendored anti-slop Oxlint plugin in a repository. Chooses a fresh install or an update, then follows the matching reference.
---

# Install or update anti-slop

The plugin is vendored. The target repository owns its copy, its rules, its tests, and its configuration. Keep that ownership when you bring in upstream changes.

## Choose the path

1. Read the repository's AGENTS.md. Run `git status --short`.
2. Search the Oxlint config for `anti-slop` in `jsPlugins`. Include copies that were renamed or moved.
3. Pick one path:
   - Copy exists: follow [references/update.md](references/update.md). Do not use the fresh-install steps.
   - No copy exists: follow "Fresh install" below.
   - The user asked for an update, and no copy exists: stop and confirm the target path.

## Fresh install

1. Run the installer from the target repository:

   ```sh
   node <skill-dir>/scripts/install.mjs
   ```

   It writes to `tools/oxlint/anti-slop/`. Pass a relative path as the first argument when the repository uses another layout.

   The installer never replaces an existing directory. Why: replacing a directory deletes local rules. Route an existing copy through the update path.

2. Install dependencies. Read the `oxlint` version from the lockfile. Install `@oxlint/plugins` at exactly that version, as a dev dependency. Pin it exactly.

   Use `npm view oxlint version` only when the repository has no `oxlint` dependency. Install that version of both packages.

   Why: the plugin imports `@oxlint/plugins`. A mismatched pair fails when the plugin loads.

3. Register the plugin and enable the rules. Follow [references/configuration.md](references/configuration.md).
4. Run the repository's lint and typecheck. Fix findings in owned source only when the user asked for cleanup.

   Never suppress a rule, lower a rule's severity, or add an unsafe cast to make lint pass.

5. Record provenance in `UPSTREAM.md`, next to the entry point. Use the template in [references/configuration.md](references/configuration.md). Write "unknown" when the source revision cannot be verified.

   Why: a package version or the upstream HEAD does not identify the bytes that were copied.

6. Report the installed path, the source identity, each dependency and configuration change, and each check result.
