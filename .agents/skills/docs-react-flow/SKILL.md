---
name: docs-react-flow
description: Design, implement, or review polished React Flow diagrams for this repository's Docusaurus documentation. Use for structured technical flows, pipelines, architectures, lifecycles, agent or RAG workflows, graph layout, reusable diagram infrastructure, and React Flow visual QA. Do not use React Flow for analogy-first mental models that Excalidraw explains better.
---

# Documentation React Flow

Build learning diagrams whose structure is understandable within five seconds. Authors define entities, relationships, and semantic roles; shared infrastructure owns geometry, viewport behavior, interaction, theme, and responsive presentation.

Use the current `@xyflow/react` v12 API. Treat [React Flow documentation](https://reactflow.dev/) as the API source of truth, especially its [layouting guide](https://reactflow.dev/learn/layouting/layouting), [custom nodes guide](https://reactflow.dev/learn/customization/custom-nodes), and [built-in components guide](https://reactflow.dev/learn/concepts/built-in-components).

## Choose the medium and mode

State the visual's teaching job before implementation: five-second takeaway, entities/states, direction, main emphasis, and why the medium fits.

- Use normal MDX when two to four short lines are clearer.
- Use Excalidraw for analogy, informal conceptual relationships, and hand-drawn mental models.
- Use React Flow for directed structured entities: pipelines, architecture, lifecycle, retrieval, RAG, agent execution, orchestration, and multi-component relationships.

Choose one React Flow mode:

1. **Compact teaching flow:** few nodes; fit view; interaction only if useful; no MiniMap; dragging normally off.
2. **Architecture/process flow:** automatic layout; pan/zoom; Controls; optional dragging; MiniMap only if navigation benefits.
3. **Large interactive map:** automatic layout; draggable nodes; pan/zoom; Controls; MiniMap; consider groups, subflows, expansion, or toolbars.

Interactivity must improve comprehension. These are learning diagrams, not workflow editors.

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

## Layout deliberately

- Use Dagre for simple DAGs, trees, pipelines, and lifecycle flows through `layoutGraph()` / `layoutWithDagre()`.
- Use ELK only when multiple branches, cross-connections, nested structures, several handles, or routing failures justify its extra dependency. Add a shared `layoutWithElk()` adapter; never embed ELK in MDX.
- Use manual positioning only when spatial position itself communicates meaning. Document that reason next to the graph definition.
- Prefer `TB` for sequential processing, lifecycle, context, retrieval, and agent execution flows. Use `LR` only when it makes the concept more readable.
- Do not default five or more meaningful stages to one horizontal row. Use a vertical spine, semantic ranks, or balanced branches.
- Centralize `nodeSpacing`, `rankSpacing`, and viewport padding. Do not scatter coordinate patches or magic offsets.

Fix routing in this order: graph model/ranks → layout engine → spacing → handle placement → edge type. Reposition or change engine before patching many coordinates. Prefer short straight, step, or smooth-step edges. Every directional edge needs a clear arrowhead. Animate only when motion teaches behavior.

For `TB`, targets enter from top and sources leave from bottom. For `LR`, targets enter from left and sources leave from right. Multiple semantic connections may use stable handle IDs; hidden handles must retain measurable dimensions (`opacity` or `visibility`, never `display: none`).

## Configure the viewport

- Default to `fitView` with modest padding so the important graph is initially visible without clipping or giant margins.
- Show Controls whenever pan/zoom is enabled.
- Use `minimap="auto"`; show it for large canvases or roughly 15+ nodes, not tiny flows.
- Use a subtle Background only when it aids orientation.
- Allow dragging for exploratory architecture/maps; keep the initial automatic layout canonical. Disable it for small teaching flows when it adds no value.
- On mobile, preserve readable node text and provide pan/zoom rather than shrinking the entire graph into illegibility.
- Use site CSS variables and `colorMode="system"`; verify light and dark themes. Never encode meaning by color alone.

## Reuse infrastructure

Extend `ReactFlowDiagram` and `layoutGraph.ts` instead of repeating providers, Controls, MiniMap, Background, edge defaults, or layout code in MDX. Keep `nodeTypes` outside the render function. With React Flow v12, use `node.measured` for post-render dimensions if implementing measurement-aware relayout.

Add a new abstraction only for a recurring need. Avoid giant APIs that expose geometry details back to article authors.

## Quality gate

Before finishing, confirm:

- no node overlap, clipping, or edge through unrelated nodes;
- crossings are minimized and the main direction/branching/output are obvious;
- sibling and rank spacing are consistent; node sizes fit readable content;
- fitView has balanced padding without excessive empty canvas;
- Controls, MiniMap, background, and dragging match the selected mode;
- desktop and narrow/mobile layouts work in the Docusaurus article column;
- light and dark themes preserve contrast;
- keyboard focus and `ariaLabel` are present; meaning does not depend on color;
- the diagram teaches more clearly than prose or Excalidraw would.

Run the configured formatter/linter when present, `npm run typecheck`, and `npm run build`. Then inspect representative diagrams at desktop and mobile widths in light and dark themes; test fit, pan, zoom, Controls, dragging when enabled, and MiniMap when present. Compilation alone is not acceptance.
