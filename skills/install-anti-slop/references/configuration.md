# Configuration reference

Use this file during a fresh install, and to check an existing configuration during an update. Merge each block with the existing configuration. Do not replace it.

## Ignore patterns

Add these patterns to `ignorePatterns`. Keep every existing ignore.

```ts
ignorePatterns: [
  ".agent/**",
  ".agents/**",
  ".claude/**",
  ".codex/**",
  ".continue/**",
  ".cursor/**",
  ".gemini/**",
  ".opencode/**",
  ".pi/**",
  ".roo/**",
  ".windsurf/**",
  "tools/oxlint/anti-slop/**",
],
```

Change the last pattern when the copy lives elsewhere. Add any other agent-tooling directory the repository has.

Do not ignore every dot-directory. Some repositories keep owned source in them.

Why: linting installed skills, hooks, or generated agent config reports findings in files the team does not own.

## Plugin registration

```ts
jsPlugins: [
  { name: "anti-slop", specifier: "./tools/oxlint/anti-slop/index.ts" },
],
```

## Generic rules

Set each rule to `"error"`:

```json
{
  "oxc/no-accumulating-spread": "error",
  "anti-slop/no-array-filter-map": "error",
  "anti-slop/no-reduce-accumulator-copy": "error",
  "anti-slop/no-chained-type-assertions": "error",
  "anti-slop/no-conditional-empty-object-spread": "error",
  "anti-slop/no-known-value-widening": "error",
  "anti-slop/no-module-mocking": "error",
  "anti-slop/no-object-parameters": "error",
  "anti-slop/no-reflect-apply": "error",
  "anti-slop/no-reflect-get": "error",
  "anti-slop/no-runtime-typeof": "error",
  "anti-slop/no-shape-in-symbol-names": "error",
  "anti-slop/no-unknown-parameters": "error",
  "anti-slop/no-unknown-returns": "error",
  "anti-slop/no-unknown-type-aliases": "error",
  "anti-slop/no-unsafe-dictionary-type": "error",
  "anti-slop/no-widen-then-assert": "error",
  "anti-slop/require-readable-spacing": "error",
  "anti-slop/require-safety-comment-for-type-assertion": "error"
}
```

Notes on specific rules:

- `no-array-filter-map`: Use a lazy iterator pipeline, `.values().filter(...).map(...).toArray()`, only when the runtime supports iterator helpers. Otherwise use one `flatMap`, or a reducer that mutates a local accumulator. Before you rewrite a chain, check callback order, indexes, sparse arrays, `thisArg`, and filter behavior. The rule does not infer the type of an unknown receiver.
- `no-reduce-accumulator-copy`: This rule pairs with the native `oxc/no-accumulating-spread` rule. The custom rule catches `Object.assign({}, acc, item)`, `Array.from(acc)`, and `concat` or `slice` on an array accumulator. It does not analyze named callbacks, indirect helpers, or nested accumulator properties. Do not state that it rules out every quadratic reducer.

## Effect plugin (opt-in)

Enable this only when `package.json` lists `effect` as a direct dependency, or when the user asks for it.

Why: `effect` can appear in a lockfile without the project using it directly.

```ts
jsPlugins: [
  { name: "anti-slop-effect", specifier: "./tools/oxlint/anti-slop/effect/index.ts" },
],
rules: {
  "anti-slop-effect/no-manual-effect-error-tag": "error",
  "anti-slop-effect/no-manual-tag-comparison": "error",
  "anti-slop-effect/no-manual-tagged-construction": "error",
  "anti-slop-effect/no-service-constructor-imports": "error",
  "anti-slop-effect/prefer-effect-match": "error",
},
```

Merge these entries with the generic configuration. The Effect rules check relative project imports only. Report package-alias imports as not enforced.

## Vite+

Add the lint and format ignore patterns to `lint.ignorePatterns` and `fmt.ignorePatterns`. Add the plugin to `lint.jsPlugins`. Run the repository's full `vp check` command.

## Cleanup (only when the user authorizes it)

1. Run lint with autofix for `anti-slop/require-readable-spacing`.
2. Run the formatter, then lint again.
3. Confirm that a second fix and format pass changes no file.
4. Commit whitespace fixes separately from semantic edits.

Do not enable a competing formatting preset.

## Provenance template

Write this as `UPSTREAM.md` next to the entry point:

```md
# Anti-slop provenance

- Source repository: <url>
- Source revision: <commit SHA, or "unknown" with the install date>
- Installed path: <path>
- Dependencies: @oxlint/plugins <version>, matching oxlint <version>
- Intentional deviations: <list, or "none">
```
