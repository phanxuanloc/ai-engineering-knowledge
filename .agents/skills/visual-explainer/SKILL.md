---
name: visual-explainer
description: Create polished visual explanations and interactive learning surfaces for technical concepts. Use when a concept is better learned through an interactive playground, architecture overview, comparison, or rich visual composition than through prose alone. This repository-local adaptation is based on nicobailon/visual-explainer v0.8.1 (MIT).
license: MIT
metadata:
  upstream: nicobailon/visual-explainer
  upstream-version: "0.8.1"
---

# Visual Explainer

This repository-local skill adapts the public `nicobailon/visual-explainer` skill to the Docusaurus learning environment. The upstream skill generates self-contained HTML visual explanations; here the same principles should normally produce site-native React/MDX components so interactive labs live with the knowledge they teach.

## When to use

Use this skill when the reader benefits from changing inputs and observing system behavior, or when a dense technical explanation needs a visual surface rather than another static prose block. Good fits include interactive experiments, selection/ranking playgrounds, architecture overviews, comparisons, timelines, and compact dashboards.

Do not use it merely to decorate an article. For a static documentation diagram, run `docs-diagram` first and use `docs-react-flow` or `docs-excalidraw` when those renderers fit better.

## Repository delivery rules

- Prefer a reusable component under `src/components/` and embed it from MDX when the visual is part of a learning article.
- Keep learning logic separate from presentation. A playground should expose a small deterministic model that can be reasoned about and tested independently.
- Reuse repository theme variables and existing design language. Do not create a competing design system.
- Keep the main teaching message obvious in the first viewport.
- Use semantic HTML, visible labels, keyboard-reachable native controls, `aria-live` for changing results, and readable light/dark themes.
- Prevent horizontal overflow and preserve useful behavior at mobile article width.
- Respect `prefers-reduced-motion`; animation should reveal process or state change, never exist as decoration.
- Do not add remote runtime dependencies for a learning surface when React/CSS already in the repository can express it.

## Choose the representation

- A directed static system/pipeline → `docs-react-flow`.
- An analogy-first mental model → `docs-excalidraw`.
- A user-adjustable simulation or experiment → React component + CSS module.
- A dense comparison or audit → semantic HTML table/cards.
- A one-off external visual artifact explicitly requested as HTML → self-contained HTML following upstream Visual Explainer principles.

## Interactive playground pattern

A learning playground should make causality inspectable:

1. Show the task/decision and current inputs.
2. Expose only the few controls that teach the target concept.
3. Make intermediate stages visible when process matters.
4. Show the final output next to rejected/alternative states when comparison matters.
5. Explain why each item changed state; do not rely on color alone.
6. Keep a deterministic reset state so the learner can reproduce the example.

For Context Engineering, prefer showing `candidates → signals → selection policy → budget → final context`, with explicit reasons such as mandatory, stale, low relevance, selected, or over budget.

## Visual invariants

- Use restrained surfaces, borders, spacing, and one primary accent.
- Avoid generic neon/gradient dashboard styling.
- Use depth sparingly and keep information density appropriate for an article column.
- Use real typography hierarchy rather than filling the page with card chrome.
- Long labels must wrap; grid/flex children need `min-width: 0` where necessary.
- If a visual becomes harder to understand than the prose it replaces, simplify or remove it.

## Validation

Before accepting a playground or rich visual:

- run `npm run typecheck`;
- run `npm run build`;
- check desktop and narrow/mobile article widths;
- check light and dark theme contrast;
- verify native controls and keyboard focus;
- verify no horizontal overflow;
- verify state transitions and reset behavior;
- verify the visual teaches the intended concept rather than only looking polished.

## Upstream attribution

Adapted from `nicobailon/visual-explainer`, version 0.8.1, licensed under MIT. The upstream project remains the source for the broader self-contained HTML/slide-deck workflow. See the colocated `LICENSE` file for the MIT license text.
