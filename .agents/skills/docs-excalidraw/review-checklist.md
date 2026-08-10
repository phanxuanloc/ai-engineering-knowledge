# Excalidraw review checklist

## Teaching and medium

- [ ] The main teaching message is understandable within roughly 3–5 seconds.
- [ ] The main concept receives the strongest visual emphasis.
- [ ] The metaphor matches the concept and important behavior is shown, not merely stated.
- [ ] The diagram adds value beyond plain text.
- [ ] Excalidraw is the correct medium; this is not a structured graph better handled by React Flow or a trivial relation better kept as MDX/Mermaid.

## Semantic correctness

- [ ] Semantic relationships are correct.
- [ ] Spatial placement does not imply a false relationship.
- [ ] Containers represent real conceptual boundaries.
- [ ] Arrow direction matches actual information flow.
- [ ] Grouping does not change the intended meaning.
- [ ] Rejected/noisy information is visually distinguishable when relevant.
- [ ] Arrow styles are semantically consistent.

## Composition

- [ ] No element overlaps and no text is clipped.
- [ ] Text is readable at normal article width.
- [ ] Labels and annotations are concise.
- [ ] Related elements are spatially grouped; unrelated groups have more separation.
- [ ] Whitespace feels intentional and outer margins are balanced.
- [ ] The scene is not unnecessarily large.
- [ ] It resembles a purposeful whiteboard explanation, not a card UI with rough borders.

## Relationships and color

- [ ] Arrow direction and meaning are clear.
- [ ] Arrow crossings are absent or minimal; no connector cuts through an unrelated element.
- [ ] Routing style is consistent and arrow labels have enough room.
- [ ] Colors follow `color-palette.md`, have semantic meaning, and are limited to roughly two to four roles.
- [ ] Meaning does not depend on color alone.
- [ ] There is no decorative clutter.

## Delivery and validation

- [ ] The editable `.excalidraw` source and generated `.svg` share the established asset directory.
- [ ] `npm run diagrams:build` exported through Excalidraw's renderer; generated SVG was not hand-edited.
- [ ] The rendered desktop and mobile assets were visually inspected and revised at least once when needed.
- [ ] The Docusaurus page was checked at desktop and narrow widths in light and dark themes.
- [ ] Alt text communicates the educational message and nearby prose remains understandable without the image.
- [ ] `npm run typecheck` and `npm run build` pass.
