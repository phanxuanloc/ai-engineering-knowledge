---
name: docs-react-flow
description: Design, implement, or review polished React Flow diagrams for this repository's Docusaurus documentation. Use for structured technical flows, pipelines, architectures, lifecycles, agent or RAG workflows, graph layout, reusable diagram infrastructure, and React Flow visual QA. Do not use React Flow for analogy-first mental models that Excalidraw explains better.
---

# Documentation React Flow

Build learning diagrams whose structure is understandable within five seconds. Authors define entities, relationships, and semantic roles; shared infrastructure owns geometry, viewport behavior, interaction, theme, and responsive presentation.

Use this skill only after `docs-diagram` classifies the communication intent and selects React Flow. Treat MDX `nodes`, `edges`, `kind`, and `primaryPath` as the renderer-facing Diagram Spec. Keep stable IDs and authored facts unchanged during layout repair.

Use the current `@xyflow/react` v12 API. Treat [React Flow documentation](https://reactflow.dev/) as the API source of truth, especially its [layouting guide](https://reactflow.dev/learn/layouting/layouting), [custom nodes guide](https://reactflow.dev/learn/customization/custom-nodes), and [built-in components guide](https://reactflow.dev/learn/concepts/built-in-components).

## Choose the medium and mode

State the visual's teaching job before implementation: five-second takeaway, entities/states, direction, main emphasis, and why the medium fits.

- Use normal MDX when two to four short lines are clearer.
- Use `docs-excalidraw` for analogy, informal conceptual relationships, conceptual comparisons, and hand-drawn mental models.
- Use React Flow for directed structured entities: pipelines, architecture, lifecycle, retrieval, RAG, agent execution, orchestration, and multi-component relationships.
- Use Mermaid only for an exceptionally tiny relationship whose topology is the entire lesson. It is not a default.

Do not make the specialized skills compete: Excalidraw explains how to think about an idea; React Flow explains how a structured system moves or connects. If a proposed Excalidraw scene needs graph layout, switch here. If a React Flow proposal is a static analogy or decorative boxes, switch to `docs-excalidraw`.

Choose one React Flow mode:

1. **Compact teaching flow:** few nodes; fit view; interaction only if useful; no MiniMap; dragging normally off.
2. **Architecture/process flow:** automatic layout; pan/zoom; Controls; optional dragging; MiniMap only if navigation benefits.
3. **Large interactive map:** automatic layout; draggable nodes; pan/zoom; Controls; MiniMap; consider groups, subflows, expansion, or toolbars.

Use a **read-only but navigable** interaction model. Pan, zoom, fit view, and fullscreen are viewing tools and should remain available by default. Node dragging, selection, connection creation, deletion, and other topology editing stay disabled unless spatial exploration itself teaches the concept. These are learning diagrams, not workflow editors.

## Inspect before changing

1. Read `AGENTS.md`, `DESIGN.md`, `src/components/Diagrams/ReactFlowDiagram.tsx`, `layoutGraph.ts`, and `diagrams.module.css`.
2. Search `docs/` and `src/` for `ReactFlowDiagram`, `ReactFlow`, `@xyflow/react`, `nodes`, `edges`, `Controls`, `MiniMap`, and `Background`.
3. Identify duplicated boilerplate, manual coordinates, topology problems, edge collisions, missing theme/responsive behavior, and poor initial framing.
4. Refactor shared infrastructure before adding one-off article code. Preserve an existing clear visual.

## Author semantic graph data

MDX supplies `nodes`, `edges`, node role, and only meaningful sizing hints. It must not supply arbitrary coordinates for ordinary graphs.

```tsx
<ReactFlowDiagram
  ariaLabel="Retrieval pipeline"
  direction="TB"
  nodes={[
    {id: 'sources', label: 'Knowledge Sources', role: 'source'},
    {id: 'retrieve', label: 'Retrieve', role: 'process'},
    {id: 'llm', label: 'LLM', role: 'model'},
  ]}
  edges={[
    {source: 'sources', target: 'retrieve'},
    {source: 'retrieve', target: 'llm'},
  ]}
/>
```

Use shared node roles: `source`, `process`, `decision`, `storage`, `model`, `tool`, `state`, `constraint`, `output`, and `group`. Keep copy to a title and optional short subtitle. Split distinct transformations instead of packing a sentence into one node. Use one emphasis accent.

All visible node content is contained by default. Lay out step number/eyebrow, a small gap, title, description, badges, and metadata inside the node with sufficient padding and a content-aware allocated height. Never use negative positioning or `overflow: visible` to make ordinary content escape the boundary. Wrap long text within the available width. Only explicit external annotations and routing handles/arrows may extend outside. Treat any border crossing, floating step number, metadata/title overlap, or fixed-height clipping as a layout failure.

## Layout deliberately

- Use Dagre for simple DAGs, trees, pipelines, and lifecycle flows through `layoutGraph()` / `layoutWithDagre()`.
- Use ELK only when multiple branches, cross-connections, nested structures, several handles, or routing failures justify its extra dependency. Add a shared `layoutWithElk()` adapter; never embed ELK in MDX.
- Use manual positioning only when spatial position itself communicates meaning. Document that reason next to the graph definition.
- Prefer `TB` for sequential processing, lifecycle, context, retrieval, and agent execution flows. Use `LR` only when it makes the concept more readable.
- Do not default five or more meaningful stages to one horizontal row. Use a vertical spine, semantic ranks, or balanced branches.
- Centralize `nodeSpacing`, `rankSpacing`, and viewport padding. Do not scatter coordinate patches or magic offsets.

### Compose for topology and canvas utilization

Choose composition from topology instead of forcing every graph through one shape:

- simple linear lifecycle → clean `TB` or `LR` spine;
- lifecycle with feedback → clean primary spine plus an external return edge;
- branching decision → primary spine plus balanced branches;
- fan-out/fan-in → use horizontal space for parallel nodes and align the merge;
- multiple real conceptual groups → use lanes, groups, or clusters only when they clarify boundaries.

On a wide desktop canvas, the meaningful graph should normally occupy a substantial portion of the usable width. If it uses roughly less than half, investigate the composition; ordinary medium-complexity graphs should often reach about 55–75% useful width when topology permits. This is a review heuristic, not a rendering constraint. Empty space is acceptable when it intentionally communicates structure. A narrow single-column stack in a wide canvas requires justification. Improve composition, grouping, semantic width tiers, or topology-aware placement before stretching every node.

Every graph with a declared `primaryPath` has a visual-spine invariant. In `TB`, primary progression moves predominantly downward, node centers are aligned or intentionally related, and connectors do not oscillate left/right. Apply the equivalent rule horizontally for `LR`. The primary path must be traceable within a few seconds without reading every label. **`TB` does not require every node to occupy one vertical column**: branches, parallel stages, evidence, groups, annotations, and feedback lanes should use horizontal space when the authored topology contains them. Never invent a branch merely to avoid a column, but never flatten real topology into one either.

Fix routing in this order: graph model/ranks → layout engine → spacing → handle placement → edge type. Reposition or change engine before patching many coordinates. Use straight edges for simple adjacent primary stages, `smoothstep` only for topology that genuinely needs orthogonal routing, and Bezier/custom curves for intentional feedback. Edge type follows semantic need, not a global default. Reject tiny S-shapes, hooks immediately after handles, repeated unnecessary bends, node crossings, detached labels, visually merged parallel edges, and routes touching node text. Every directional edge needs a clear arrowhead. Animate only when motion teaches behavior.

Keep the primary flow short, quiet, and consistent. Feedback, retry, refresh, and other long-distance cycles are secondary topology: route them outside the main node corridor with one deliberate large curve or a small number of clean orthogonal segments. They must never cross the primary flow, resemble a canvas border/divider, or run through controls. Reserve side clearance, use top/bottom handles for the main `TB` spine and left/right handles for side returns, and apply the equivalent geometry for `LR`. Feedback edges should be subtler or dashed. When the label belongs to the whole return loop, center it on the clear outer return segment and use an opaque label background to create an intentional break in the dashed stroke; when it names the return event at an endpoint, keep it immediately beside that endpoint. If automatic routing produces an ugly loop, use the shared feedback edge, explicit handles, or a reusable waypoint/custom-edge abstraction instead of accepting it.

Treat a feedback loop as a reserved routing lane, not a curve offset from only its source and target. Compute or validate its clearance against the outermost node boundary in the graph, including wider intermediate nodes; the lane must remain visibly detached from every card at desktop and mobile widths. A fixed offset from two compact endpoint nodes is insufficient when another node extends farther into the return corridor.

`fitView` commonly frames node bounds without accounting for the full custom-edge curve or its label. When a feedback lane extends beyond node bounds, explicitly include a non-semantic routing reserve in the fitted bounds or use an equivalent shared viewport calculation. Do not compensate by repeatedly moving the curve inward until it hugs nodes. Verify the initial viewport contains the complete return path and label without clipping or horizontal overflow.

For a label that describes the whole loop, place its center on the clear middle portion of the outer return segment—both vertically centered along the return and visually centered over the dashed stroke. Give the label an opaque background so the stroke breaks cleanly behind it. Do not leave a whole-loop label beside the start/target endpoint or merely at the same height while floating away from its edge.

For `TB`, targets enter from top and sources leave from bottom. For `LR`, targets enter from left and sources leave from right. Multiple semantic connections may use stable handle IDs; hidden handles must retain measurable dimensions (`opacity` or `visibility`, never `display: none`).

## Configure the viewport

- Default to `fitView` with modest padding so the important graph is initially visible without clipping or giant margins.
- Keep pan, zoom, fit view, and fullscreen available for inspecting the graph; show Controls whenever pan/zoom is enabled.
- Use `minimap="auto"`; show it for large canvases or roughly 15+ nodes, not tiny flows.
- Use a subtle Background only when it aids orientation.
- Allow dragging for exploratory architecture/maps; keep the initial automatic layout canonical. Disable it for small teaching flows when it adds no value.
- On mobile, preserve readable node text and provide pan/zoom rather than shrinking the entire graph into illegibility.
- Use site CSS variables and `colorMode="system"`; verify light and dark themes. Never encode meaning by color alone.

Derive canvas size from computed graph bounds with intentional modest padding whenever practical. Do not use a large fixed height to disguise poor density or a narrow graph. Inspect fit-view zoom: the default view must keep normal labels and metadata readable. Controls must clear meaningful content. Mobile may use responsive widths/spacing or an alternate composition; it must not merely shrink a desktop graph until text becomes unreadable.

## Size nodes and express semantic roles

Node width follows content and topology. Prefer the shared `compact`, `standard`, and `wide` tiers when they fit; use an explicit width only for a real content/layout need. Normal title and metadata must remain readable without fullscreen or zoom. Shorten metadata or move explanation into surrounding prose before shrinking text. Do not make every node wide merely to fill the canvas.

Use the shared semantic roles consistently: `source`, `process`, `state`, `evidence`, `constraint`, `model`, `tool`, `output`, and the closest existing specialized roles. Role differences should be subtle but visible through the established border, shape, surface, or weight language—not random per-diagram color.

For `TB`, rank separation must distinguish stages without turning a simple lifecycle into poster height. Keep consecutive stages close enough to read as one flow, but preserve enough clearance for a visible connector shaft in addition to the arrowhead; an edge that collapses into mostly a marker is a spacing failure. Allocate extra space only where a branch, loop, or annotation needs it. Spacing should remain proportional to node size and edge complexity.

## Reuse infrastructure

Extend `ReactFlowDiagram` and `layoutGraph.ts` instead of repeating providers, Controls, MiniMap, Background, edge defaults, or layout code in MDX. Keep `nodeTypes` outside the render function. With React Flow v12, use `node.measured` for post-render dimensions if implementing measurement-aware relayout.

Add a new abstraction only for a recurring need. Avoid giant APIs that expose geometry details back to article authors.

## Mandatory review checklist

Before accepting a React Flow diagram, answer all of these:

1. Can I identify the primary path immediately?
2. Does the graph use the available canvas reasonably?
3. Is suspicious empty space caused by layout rather than meaning?
4. Are titles and metadata readable without fullscreen or zoom?
5. Are primary edges clean and directionally consistent?
6. Are there tiny hooks or S-curves caused by handle placement?
7. Are feedback edges secondary and outside the main corridor?
8. Do custom feedback edges and labels participate in the fitted viewport bounds rather than being clipped outside node-only bounds?
9. Are edge labels visually attached to their own edges, with whole-loop labels centered over the clear middle return segment?
10. Are semantic node roles distinguishable before every label is read?
11. Is the diagram taller or wider than its topology needs?
12. Does `fitView` produce a useful default zoom?
13. Does mobile remain readable rather than merely scaled down?
14. Do controls clear graph content?
15. Does the diagram teach structure better than plain text?

If several answers fail, redesign the topology/composition instead of accumulating coordinate tweaks.

## Quality gate

Run the shared structural and layout validation built into `ReactFlowDiagram`, then apply the routing, readability, and visual gates from `docs-diagram/references/quality-gates.md`. A deterministic pass is necessary but not sufficient.

Before finishing, confirm:

- no node overlap, clipping, or edge through unrelated nodes;
- no node content crossing its border, floating step metadata, metadata/title overlap, or long-text overflow at desktop or mobile width;
- crossings are minimized and the main direction/branching/output are obvious;
- sibling and rank spacing are consistent; node sizes fit readable content;
- fitView has balanced padding without excessive empty canvas;
- Controls, MiniMap, background, and dragging match the selected mode;
- desktop and narrow/mobile layouts work in the Docusaurus article column;
- light and dark themes preserve contrast;
- keyboard focus and `ariaLabel` are present; meaning does not depend on color;
- the diagram teaches more clearly than prose or Excalidraw would.

On failure, repair locally in this order: semantic spec/ranks → affected node spacing/size → handle placement → edge type → label. Change one diagnosed control at a time; preserve unrelated nodes, edges, IDs, and copy. Split the view when density or topology is the real defect.

Run the configured formatter/linter when present, `npm run typecheck`, and `npm run build`. Then inspect representative diagrams at desktop and mobile widths in light and dark themes; test fit, pan, zoom, Controls, dragging when enabled, and MiniMap when present. Compilation alone is not acceptance.
