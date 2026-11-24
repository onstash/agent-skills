---
name: rca-and-prevention
description: Use when investigating an incident, failure, or repeated defect to find its root causes and prevention actions. Builds an evidence-first timeline, separates facts from hypotheses, and ends in owned, testable actions.
---

# Root-cause analysis and prevention

Read [references/incident-rca-agent-skill.md](references/incident-rca-agent-skill.md) before the first analysis. It holds the sources and the method.

## Procedure

1. **Scope.** Write the incident identifier, the time window, the sources you may read, and the data to redact.

   Why: an analysis that reads beyond its scope can leak data or mix in unrelated events.

2. **Evidence ledger.** Write one row per event before any explanation:
   - `time`, with its timezone;
   - `observed_event`, in one sentence;
   - `source`: a file and line, a command output, or a query;
   - `status`: `observed`, `derived`, `disputed`, or `missing`.

   Why: an explanation written first pulls the evidence toward it.

3. **Classify.** Sort each finding into one class: impact, symptom, trigger, contributing factor, systemic cause, mitigation, or unknown.
4. **Test each hypothesis.** For each cause, write one disconfirming test: an observation that would prove the cause wrong. Run the test. Keep the cause only when it survives.
5. **Set confidence.** Use one level:
   - `high`: two independent sources agree, and the disconfirming test failed.
   - `medium`: one source supports the cause, and no source contradicts it.
   - `low`: an inference with no direct source.

   Do not use percentages.

6. **Write actions.** Propose at most 5 actions, ordered by impact. Each action has:
   - an owner, named as a role or team;
   - an acceptance criterion;
   - a proof artifact: a test, a query, or a check that fails before the fix and passes after it.
7. **Prefer guardrails.** Rank the action types in this order: prevent (code, type, or config change), detect (test, alert, or check), mitigate (runbook step), document. Use a document only when no other type applies.

   Why: a reminder fails when the person forgets it. A check runs every time.

8. **Record residual risk.** List what the actions do not cover, and the open questions.

## Blameless rule

Name systems, conditions, and missing guardrails as causes. Never name a person as a cause.

Why: a person-level cause ends the investigation at the person. It hides the condition that let the error happen.

Five Whys is a probe, not a required format. When two causes interact, follow a second chain for each.
