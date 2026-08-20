---
name: docs-visual-density
description: Audit learning notes for prose or ASCII blocks that should become diagrams, flows, runtime explainers, comparisons, or charts. Use during docs creation, expansion, refactoring, or visual review.
---

# Documentation Visual Density

Public learning notes should be **visual-first where structure, behavior, state, causality, comparison, or quantitative relationships are being taught**. Prose remains necessary for nuance, constraints, caveats, and exact definitions; it must not be the default representation for information that a reader can understand materially faster as a visual.

Always run `docs-diagram` before selecting a renderer.

## Mandatory block audit

For every new, substantially expanded, or refactored learning note, inspect every meaningful prose block, bullet cluster, table, and fenced `text`/ASCII block. Ask whether the block primarily expresses one of these shapes:

- ordered steps, lifecycle, request/response, retry, loop, fan-out/fan-in;
- topology, dependency, ownership, boundary, hierarchy, or data movement;
- state transition or before/after behavior;
- two or more alternatives whose differences are easier to scan side-by-side;
- capacity, latency, cost, memory, throughput, distribution, or other quantitative relationship;
- causal chain such as symptom → mechanism → outcome;
- conceptual spatial relationship that benefits from a whiteboard mental model.

If yes and the repository has a truthful renderer for it, **convert the block to a visual**. This is a required teaching step, not optional polish.

## Renderer routing

- Runtime/order/state/transport → `FlowExplainer` / `visual-explainer`.
- Structured topology, dependency, static phase flow → `ReactFlowDiagram` / `docs-react-flow`.
- Conceptual analogy, boundary, mental model → Excalidraw / `docs-excalidraw`.
- Quantitative relationship → chart or focused interactive visualization.
- Genuine comparison without directional semantics → `Comparison` or a compact semantic table.

## Text that should usually stay text

Keep prose or code when precision is the lesson: exact definitions, caveats, invariants, API/code/config examples, formulas, short decision rules, and explanations already clear in roughly 2–4 lines. Do not create decorative diagrams that merely restate a sentence.

## ASCII and pseudo-diagram rule

Fenced `text` diagrams, arrow chains, pseudo-trees, and hand-aligned status blocks are review failures when they encode real topology, flow, state, or causal structure that React Flow, FlowExplainer, Excalidraw, Comparison, or a chart can represent more clearly. Preserve ASCII only for literal terminal output or when typography itself is the subject.

## Density rule

Do not allow a page to become a wall of consecutive prose sections. After roughly two substantial conceptual blocks without a visual anchor, explicitly re-run the block audit. A visual anchor must teach something; cards used only as decoration do not count.

## Acceptance

Before publishing, verify:

1. Every substantial block has a documented internal visual-or-text decision.
2. No convertible ASCII/pseudo-diagram remains.
3. Runtime behavior is not represented only by static prose when FlowExplainer can show it truthfully.
4. Topology/hierarchy is not buried in paragraphs when React Flow can make it obvious.
5. Quantitative claims are not forced into prose when a compact chart would teach faster.
6. Visuals do not invent order, topology, or causal relationships.
7. Mobile remains readable; recompose before shrinking.
8. Visual refactoring does not change `learning-progress.yaml` evidence or mastery by itself.
9. Run typecheck/build and inspect rendered output when execution access exists; never claim visual QA without seeing the render.
