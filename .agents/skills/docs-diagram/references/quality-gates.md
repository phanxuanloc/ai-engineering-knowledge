# Layered quality gates

## 1. Structural validation

- IDs are non-empty and unique.
- Every relationship references existing entities.
- Primary-path IDs exist and consecutive steps are connected in the intended direction.
- Groups reference existing members and represent real boundaries.
- No accidental self-loop or duplicate relationship exists.
- Classification, direction, and renderer match the teaching intent.
- The spec contains only grounded facts.

## 2. Layout validation

- No nodes overlap or crowd the canvas boundary.
- Clear gaps—not center distances—are consistent within ranks and groups.
- Bounds and aspect ratio fit the Docusaurus article column.
- Whitespace is approximately balanced; no secondary branch controls the canvas.
- The graph does not degenerate into a long row or column rescued by `fitView`.
- Primary entities remain readable without tiny text or nodes.
- Visible node content remains inside the node boundary with sufficient internal padding; wrapped copy receives content-aware height, and step numbers or badges never float outside unless explicitly modeled as external annotations.
- A declared primary path forms one obvious visual spine: `TB` centers do not drift or oscillate horizontally, and `LR` centers do not drift or oscillate vertically unless the topology explicitly requires it.
- On a wide desktop canvas, investigate a meaningful graph that uses roughly less than half the width. Treat about 55–75% useful width as a common target when topology permits, never as a hard rendering constraint.
- Canvas dimensions follow graph bounds and intentional padding; a large fixed height does not conceal poor density, extreme aspect ratio, or unused space.

## 3. Routing validation

- No edge crosses an unrelated opaque node or runs along a boundary.
- Crossings, bends, long detours, and ambiguous shared corridors are minimized.
- Endpoints and arrow direction match semantic flow.
- Connector glyphs and routes sit within the inter-node gap with visible clearance from both adjacent boundaries at desktop and mobile widths; they never appear attached to one card.
- Parallel edges do not pile onto one anchor when separation is needed.
- Edge labels clear nodes, routes, and other labels; omit an obvious label before forcing geometry.
- Adjacent primary stages use a clean direct route; reject tiny S-curves, handle hooks, repeated bends, or cross-axis oscillation caused by automatic routing.
- Long feedback edges stay outside the primary node corridor, remain visually secondary, and use one intentional curve or a few clean orthogonal segments. They must not resemble a border/divider or cross controls.
- A feedback label sits on or immediately beside the returning segment it describes, not at an unrelated geometric midpoint.

## 4. Readability validation

- The primary path and reading direction are obvious within 3–5 seconds.
- Labels are concise, unclipped, and readable at normal article width.
- Hierarchy and emphasis do not rely on color alone.
- Node count and information density stay bounded; secondary detail uses progressive disclosure.
- The reader does not have to decode the layout before understanding the concept.
- Normal titles and metadata remain readable in the default fitted view without fullscreen or zoom.
- Semantic roles are subtly distinguishable through the shared visual language before every node label is read.

## 5. Visual review

Inspect the actual render after deterministic checks pass. Check desktop/mobile, light/dark, initial framing, caption, accessibility, and any enabled interaction. Compilation is not visual acceptance.

## Diagnostic and repair format

Record each failure as:

```text
code: routing/edge-through-node
subject: edge refresh→retrieve
evidence: route intersects node quality
supported fixes: reposition affected rank; change shared edge type; split the view
```

Repair in order: semantic/schema → overlap/placement → edge-node/endpoint direction → crossings/corridors/bends → label clearance → polish. Change one diagnosed control at a time and revalidate. Preserve unrelated nodes, edges, IDs, and authored facts.
