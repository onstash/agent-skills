---
name: laws-of-ux
description: Use when a user asks whether an interface or product decision is easy to understand, light on cognitive load, familiar, or discoverable. Applies named UX principles to observed behavior and returns checkable changes.
---

# Laws of UX

## Procedure

1. Name the user goal and the single interaction under review. If the request names no interaction, ask for one.
2. Write what you observed, from the UI, the code, or a user report. Keep observations separate from interpretation.
3. Choose at most five laws. Use the routing table below. Name a law only when its mechanism explains an observation from step 2.

   Why: a law named for its sound, not its mechanism, adds noise to the review.

4. For each issue, state the mechanism: choice count, target size, grouping, memory load, feedback delay, or a break from a familiar pattern.
5. Rank the issues by user impact. Broken actions, misleading labels, lost work, and blocked recovery come first. Visual polish comes last.
6. Recommend the smallest change that fixes each issue. Keep the user's control. Prefer a clearer label or state over a new workflow.
7. For each recommendation, define one check: a DOM or state assertion, an accessibility assertion, a responsive screenshot, an interaction test, or a measured timing.

## Rules

- Cite each law by name. Link to its page in [references/laws-catalog.md](references/laws-catalog.md).
- A law describes a tendency. It does not prove that a design is correct. State the uncertainty when it affects the recommendation.
- Check the states that change the interaction: keyboard, touch, narrow screen, reduced motion, loading, empty, error, and recovery.
- Check that the primary action matches the user's goal. Check that unrelated warnings and controls do not sit in the same group as it. Use Law of Common Region and Law of Proximity for this.
- Cite two to five laws per review.

  Why: a review that cites every law shows no judgment about which one applies.

## Routing

- Too many or complex choices: Hick's Law, Choice Overload.
- Unfamiliar interaction or terminology: Jakob's Law, Mental Model, Paradox of the Active User.
- Dense content or hard review: Cognitive Load, Chunking, Working Memory, Law of Proximity.
- Poor grouping or unclear hierarchy: Law of Common Region, Law of Similarity, Law of Uniform Connectedness, Law of Prägnanz.
- Small controls or hard touch targets: Fitts's Law.
- Slow or unclear feedback: Doherty Threshold, Peak-End Rule.
- Interrupted or unfinished work: Zeigarnik Effect, Goal-Gradient Effect.
- Excessive complexity: Tesler's Law, Occam's Razor.
