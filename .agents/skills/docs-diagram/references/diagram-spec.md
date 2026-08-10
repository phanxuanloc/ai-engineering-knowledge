# Diagram Spec contract

Use the smallest structured plan that lets an agent reason about meaning before layout.

```ts
type DiagramSpec = {
  id: string;
  kind: 'conceptual' | 'architecture' | 'workflow' | 'sequence' | 'data-flow' | 'lifecycle' | 'relationship';
  teachingMessage: string;
  renderer: 'mdx' | 'excalidraw' | 'react-flow' | 'mermaid';
  direction?: 'TB' | 'LR';
  primaryPath?: string[];
  nodes: Array<{id: string; label: string; role: string; sourceFact?: string}>;
  edges: Array<{source: string; target: string; label?: string; meaning?: string}>;
  groups?: Array<{id: string; label: string; members: string[]; meaning: string}>;
  constraints?: {
    maxPrimaryNodes?: number;
    mobileStrategy?: 'alternate-layout' | 'pan-zoom' | 'scroll' | 'responsive';
    emphasis?: string;
  };
};
```

This is a reasoning contract, not a requirement to serialize every diagram. React Flow MDX already supplies typed nodes and edges; enrich that interface instead of duplicating it. Excalidraw scenes remain the editable renderer source.

## Classification rules

- **Architecture:** components, dependencies, ownership, trust or deployment boundaries. Use one dominant spine and short branches.
- **Workflow:** actions, decisions, responsibilities, phases, exceptions. Keep the happy path monotonic; route retries outside it.
- **Sequence:** participants and messages ordered in time. Do not fake a sequence with a generic graph if timing becomes ambiguous.
- **Data flow:** sources, transformations, stores, consumers, custody or sensitivity boundaries. Label only meaningful contracts or boundary crossings.
- **Lifecycle:** states, triggering events, waits, retries, cancellation, terminal outcomes. A retry annotation is not a transition.
- **Conceptual:** analogy, comparison, containment, selection, cause/effect, or intuition. Spatial metaphor may matter more than graph topology.
- **Relationship:** one tiny connection whose topology is the whole lesson.

## Grounding rules

- Keep stable IDs independent of layout and wording changes.
- Record only entities and relationships supported by the note, code, configuration, experiment, or user statement.
- Use groups only for real semantic boundaries.
- Mark uncertainty in prose; do not encode an assumption as a confident edge.
- Preserve source order only when it carries meaning. Otherwise let semantic ranks drive layout.
