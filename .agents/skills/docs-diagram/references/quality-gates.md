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

## 3. Routing validation

- No edge crosses an unrelated opaque node or runs along a boundary.
- Crossings, bends, long detours, and ambiguous shared corridors are minimized.
- Endpoints and arrow direction match semantic flow.
- Connector glyphs and routes sit within the inter-node gap with visible clearance from both adjacent boundaries at desktop and mobile widths; they never appear attached to one card.
- Parallel edges do not pile onto one anchor when separation is needed.
- Edge labels clear nodes, routes, and other labels; omit an obvious label before forcing geometry.

## 4. Readability validation

- The primary path and reading direction are obvious within 3–5 seconds.
- Labels are concise, unclipped, and readable at normal article width.
- Hierarchy and emphasis do not rely on color alone.
- Node count and information density stay bounded; secondary detail uses progressive disclosure.
- The reader does not have to decode the layout before understanding the concept.

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
