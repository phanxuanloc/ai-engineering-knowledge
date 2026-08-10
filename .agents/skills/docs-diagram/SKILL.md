---
name: docs-diagram
description: Orchestrate documentation diagrams for this repository before renderer-specific work. Use when creating, changing, reviewing, or classifying any educational visual, including architecture, workflow, sequence, data-flow, lifecycle, conceptual, comparison, or simple relationship diagrams; decide whether a visual helps, author a grounded Diagram Spec, select docs-react-flow or docs-excalidraw, apply layered validation, and direct targeted repairs.
---

# Documentation Diagram Orchestration

Treat a diagram as a communication artifact with a contract, not a renderer demo. Preserve authored facts, choose the smallest useful view, validate deterministically, inspect the render, and repair only diagnosed defects.

## Run the pipeline

1. Read the relevant note and verified source facts. State the 3–5 second teaching message and what evidence supports every entity and relationship.
2. Decide whether a visual materially improves comprehension. Keep normal MDX when prose is clearer.
3. Classify the intent as `conceptual`, `architecture`, `workflow`, `sequence`, `data-flow`, `lifecycle`, or `relationship`.
4. Define a bounded Diagram Spec before renderer details. Read `references/diagram-spec.md` for the contract and type-specific rules.
5. Select the renderer from communication needs:
   - `conceptual` and analogy-first views → read and use `docs-excalidraw`.
   - structured architecture, workflow, data-flow, lifecycle, pipeline, or graph relationships → read and use `docs-react-flow`.
   - `sequence` → use React Flow only when its node-edge abstraction stays truthful; otherwise keep prose/code or add a dedicated shared renderer only after repeated demand.
   - tiny `relationship` → normal MDX or Mermaid as a rare exception.
6. Render through existing shared infrastructure. Do not select a renderer merely because it is available.
7. Run the layered validation in `references/quality-gates.md`: structural → layout → routing → readability → visual review.
8. If validation fails, record the rule, affected subject, evidence, and supported local fixes. Change only the relevant spec, layout, routing, or label. Revalidate after every repair. Regenerate the whole diagram only when its structure or classification is fundamentally wrong.
9. Freeze the passing spec and source artifact, run repository checks, and report visual review truthfully.

## Keep the Diagram Spec grounded

Separate semantic content from rendering decisions. At minimum record:

- stable `id`, classification, teaching message, renderer, reading direction, and primary path;
- nodes/entities with concise labels, semantic roles, and verified source meaning;
- only relationships necessary to teach the chosen view;
- real groups or boundaries, never decorative containers;
- layout constraints such as ranks, lanes, direction, density limit, mobile strategy, and emphasis;
- accessibility message and surrounding explanation.

The existing React Flow `nodes` and `edges` are the renderer-facing form of this spec; do not introduce a parallel JSON platform. Excalidraw keeps editable scene JSON, but its semantic plan must still be stated before shapes. Stable IDs and stable input order should produce stable output.

Never infer topology from file proximity, names, or visual convenience. When a diagram reflects code or architecture, inspect entrypoints, runtime boundaries, storage, transports, and configuration. Omit unverified relationships or label them as assumptions in surrounding prose.

## Bound complexity with progressive disclosure

Keep one primary path or mental model obvious. Prefer roughly 6–12 primary entities; split or group before 15, and reject an ungrouped view above 18. Move secondary facts into prose, cards, callouts, or a second focused diagram. Do not add an edge merely because a relationship exists.

Architecture emphasizes components and real boundaries. Workflow emphasizes responsibility and ordered work. Sequence emphasizes actors and temporal messages. Data flow emphasizes movement, transformation, custody, and sensitivity. Lifecycle emphasizes states, events, retries, waiting, and terminal outcomes. Conceptual diagrams optimize intuition rather than topology coverage.

## Demand deterministic acceptance

For React Flow, semantic node/edge data, stable IDs, centralized Dagre options, and shared validation own reproducibility. For Excalidraw, source JSON, stable element generation, shared presets, and the official renderer own reproducibility. Equivalent inputs must not drift between builds.

Automated checks cannot prove teaching quality. After deterministic gates pass, inspect representative output at normal article width and mobile width, in light and dark themes. Never claim visual review passed without seeing the render.

Finish with the renderer skill’s checks, `npm run typecheck`, `npm run build`, and `git diff --check`.
