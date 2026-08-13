# AI Engineering Knowledge Base — Agent Guide

This repository is a personal, evolving AI Engineering knowledge base. AI coding agents maintain it by consolidating understanding, not by accumulating disconnected pages.

These instructions apply to the entire repository.

## Knowledge must come from learning

- Public `/docs` pages exist to present shareable AI Engineering knowledge that the learner has actually learned and intentionally captured. Personal progress, checkpoint status, confidence, incomplete learning plans, repository maintenance procedures, system prompts, agent behavior, authoring instructions, and workflow documentation belong in `learning-progress.yaml`, `AGENTS.md`, repository metadata, configuration, or another appropriate non-public file—not in `/docs`.
- Never create a public knowledge page or a `learning-progress.yaml` entry merely because an agent needs internal instructions or repository workflow documentation. Operational usefulness is not learning evidence.
- Do not infer that every file under `/docs` represents learned knowledge. Category landing pages, navigation files, and templates may be structural; learned status comes from actual learning evidence recorded in `learning-progress.yaml`.
- Knowledge articles must only be created or expanded from actual learning, discussion, research, or experiments performed by the learner.
- Do not pre-populate the knowledge base with generic AI-generated knowledge.
- Treat a request to explain or brainstorm as discussion, not automatic permission to save a knowledge article. Save or update knowledge only when the learner asks to capture the learning outcome or the active learning workflow explicitly reaches that step.
- Do not invent the learner's understanding, experiment hypothesis, observations, results, or mastery status. Record learning state only in `learning-progress.yaml`. Public docs may present completed experiment setup, observations, results, and limitations when they are useful to readers, but must not expose personal checkpoint state.
- Infrastructure documents, category metadata, and templates organize learning but do not count as learned knowledge.

## Guide broad topics as learning journeys

- When recommending a new broad topic, do not only name the topic. First provide a concise `Learning Map` or syllabus of the important subtopics needed to understand it, then recommend the next small subtopic to study.
- When the learner asks what to learn next, first inspect `learning-progress.yaml` and the relevant existing knowledge notes. Recommend the next logical, manageable subtopic based on actual progress, gaps, prerequisites, and the currently active broad topic—not from a generic curriculum alone.
- Keep the distinction explicit: **Learning Map = what is planned to learn; Learning Progress = what has actually been learned.** A Learning Map guides future sessions but is not evidence of knowledge.
- Do not create knowledge notes or `learning-progress.yaml` entries for planned subtopics merely because they appear in a Learning Map. Record a subtopic only after actual learning reaches the save/update checkpoint and has real evidence.
- Treat the learner's explicit command “Chốt kiến thức” as the checkpoint that triggers capturing or updating the current learned knowledge and synchronizing `learning-progress.yaml`. Capture only the material actually covered; preserve gaps and uncertainty, and do not treat the checkpoint as automatic completion of the whole broad topic.
- After a checkpoint, prefer continuing with the next logical small subtopic in the same active topic.
- Move to a new broad topic only when the current topic has sufficient learning evidence, or when a prerequisite detour is needed to continue. Make a prerequisite detour explicit and return to the active topic afterward when appropriate.

The default journey for a broad topic is: Broad Topic → Learning Map → Small Subtopic → Learn → Checkpoint ("Chốt kiến thức") → Update actual knowledge/progress → Suggest next logical subtopic → Repeat → Experiment → Applied/Mastered.

## Keep the learning index synchronized

`learning-progress.yaml` is the machine-readable and non-public source of truth for the learner's current learning state. Canonical learning notes under `/docs` contain shareable knowledge; the index records progress and evidence state for each real topic. Structural files under `/docs` are not learning evidence.

- Read `learning-progress.yaml` before creating or meaningfully updating a learning note.
- Add an entry only after an actual learning topic has a real note. An absent topic means “not learned yet.” Never add Learning Map or syllabus items, aspirational topics, suggested curricula, category placeholders, or system documentation.
- Whenever a real learning note is created, meaningfully updated, moved, renamed, or deleted, update its index entry in the same change. Keep `note`, `category`, `related`, `prerequisites`, and `experiments` synchronized with the canonical note and repository paths.
- Use a stable kebab-case topic key. Each entry must use this shape:

  ```yaml
  topics:
    topic-key:
      title: Standard Topic Name
      category: Category Name
      status: learning
      note: docs/category/topic-key.mdx
      learned_at: YYYY-MM-DD
      last_reviewed: null
      confidence: 1
      experiments: []
      prerequisites: []
      related: []
  ```

- Allowed `status` values are `learning`, `understood`, `applied`, and `mastered`.
- Confidence uses this evidence scale: `1` = barely understand; `2` = basic understanding; `3` = can explain; `4` = can apply independently; `5` = can teach or design with it.
- New entries normally begin at `status: learning`. Do not infer `understood`, `applied`, or `mastered` merely because a note exists or is detailed.
- Base status and confidence changes on actual evidence from discussion, experiments, self-test results, reviews, or demonstrated application. Never fabricate evidence or promote progress automatically.
- Set `learned_at` to the date of the first real learning session, not the file creation date when those differ. Change `last_reviewed` only after an actual review.
- Keep arrays empty when there is no actual relationship or experiment to record. Do not pre-populate a curriculum.
- A structural category `index.mdx` and `docs/_templates/learning-note.mdx` must never receive topic entries.

## Before editing knowledge

1. Read `README.md`, this file, and `docs/_templates/learning-note.mdx`.
2. Inspect the relevant category and search all of `docs/` for the topic, its synonyms, and closely related concepts. Use filenames, titles, headings, tags, and body text—not filenames alone.
3. Read the full contents of likely related notes before deciding what to change.
4. Identify the canonical existing note, overlapping notes, and links that may need updating.

## Decide whether to create or update

- Prefer updating an existing article when the new material explains the same concept, answers a question already covered, adds an example, corrects an error, or deepens an existing mental model.
- Create a new article only when the topic has a distinct mental model or practical purpose and would remain useful as a standalone note.
- Do not create duplicate articles for synonyms, alternate phrasing, or a narrower example. Add aliases or terminology to the canonical article instead.
- When two existing notes substantially overlap, consolidate them into the stronger canonical note and repair inbound links. Do not remove unique personal content.
- Keep one primary home for each concept. Other notes should summarize the connection and link to that home rather than repeat its explanation.

## Standard learning-note structure

Start new learning notes from `docs/_templates/learning-note.mdx`. Every learning note must contain these second-level headings in this order:

1. `TL;DR`
2. `Mental Model`
3. `Core Concepts`
4. `Example`
5. `When to Use`
6. `Common Mistakes`
7. `Related Knowledge`
8. `Self-test`

Category landing pages, navigation files, and templates are not learning notes and do not need this structure.

Use descriptive kebab-case filenames and Docusaurus front matter. Keep explanations concise, practical, and grounded in examples. Mark assumptions and unverified claims clearly.

## Documentation format and visual conventions

- When creating, modifying, or reviewing any documentation diagram, first read `.agents/skills/docs-diagram/SKILL.md` to decide whether a visual helps, classify its intent, define a grounded Diagram Spec, select a renderer, and apply layered validation. Then read `.agents/skills/docs-excalidraw/SKILL.md` for conceptual visuals or `.agents/skills/docs-react-flow/SKILL.md` for structured graphs. Do not make the renderer skills compete or manually position non-trivial graphs unless spatial position itself carries meaning.

- Use `.mdx` for all files under `docs/`, including learning notes, category landing pages, and templates. Keep internal repository and agent workflow documentation outside `/docs`. Preserve existing front matter, slugs, sidebar order, public URLs, and internal links when migrating or renaming a source file.
- Prefer a visual when it communicates the idea more clearly than a large text block. Keep normal MDX when the idea is already clear in two to four short lines or a diagram would only add noise.
- Use **Excalidraw diagrams** to explain mental models, conceptual relationships, high-level architecture sketches, comparisons, and learning-oriented ideas. They must look intentionally hand-drawn, like an engineer or teacher explaining on a whiteboard—not like polished UI cards with a rough border. Use genuine Excalidraw scene elements, handwritten typography, rough shapes, sketch fills, natural arrows, asymmetry, annotations, and simple visual metaphors when they improve learning.
- Use **React Flow** for pipelines, node-edge workflows, retrieval/agent/context flows, system-component relationships, dependency graphs, data movement, and multi-step technical processes where structured positioning is useful.
- Treat the choice as guidance rather than an absolute rule: **Excalidraw explains the idea; React Flow explains how the system or flow is structured.** Choose the simplest clear representation.
- Mermaid is a rare exception for a tiny relationship whose topology is the entire lesson; it is never the default. When relevant work encounters an existing Mermaid, ASCII-art, fenced `text` pseudo-diagram, or awkward custom diagram, classify it first and migrate only when another medium meaningfully improves comprehension. Preserve text and code examples when text is genuinely clearer.
- Use `ExcalidrawDiagram` from `src/components/Diagrams` to render optimized SVG exports. Keep reading pages light by not shipping the Excalidraw editor. Treat the `.excalidraw` JSON as canonical source, use shared presets from `scripts/excalidraw-presets.mjs`, keep scene and export together under `static/img/diagrams/excalidraw/`, and run `npm run diagrams:build` after source changes. The build must export through Excalidraw's renderer. Never hand-code or hand-edit SVG to imitate Excalidraw. SVG is only a generated artifact from genuine scene data.
- Prefer `roughness: 1–2`, `hachure` or `cross-hatch` pastel fills, Virgil/Excalidraw handwriting, slightly curved or bent arrows, natural whitespace, offsets, and shapes sized by conceptual importance. Avoid strict grids, identical cards, perfectly symmetric alignment, flat opaque fills, and regular UI typography.
- If an Excalidraw diagram starts resembling a Figma UI, architecture-card layout, or React Flow diagram, simplify it and increase its whiteboard/sketch character. Ask whether it plausibly looks drawn while teaching; if removing the rough border would leave a Figma diagram, revise it.
- Make the mental model legible before every label is read. Prefer showing behavior over describing it: visibly cross out, fade, block, reject, contain, highlight, or constrain information instead of adding a sentence that says those things happen. Use containers, buckets, funnels, boundaries, circled concepts, dashed arrows, small symbols, and handwritten notes when they clarify the idea without turning it into a cartoon.
- Different semantic roles should not become a repeated card system. A task may be circled, constraints may be a sketch note, relevant information may be highlighted, and noise may be crossed out. Allow different sizes and treatments based on meaning.
- In source-to-context mental models, make `many available sources → selection/filtering → limited Context Window → LLM` visually obvious and show that some information does not enter the window. When a flow ends at an LLM, draw a small rough endpoint such as a circle, cloud, or sketch box rather than pointing to floating text.
- Before accepting an Excalidraw diagram, verify: (1) it resembles a whiteboard explanation, (2) its main idea is visible before reading every label, (3) important behavior is shown rather than merely stated, (4) it does not resemble Figma/UI layout, (5) shapes and arrows retain intentional imperfection, (6) semantic roles are visually differentiated where useful, and (7) it remains quickly understandable. Prefer explanatory imperfection over decorative polish.
- Use `ReactFlowDiagram` from `src/components/Diagrams` for read-only technical graphs. Define only node/edge data in MDX; keep layout behavior, theme integration, and controls in the shared component. Do not embed hundreds of lines of React Flow implementation in an article or add one-off components when the shared abstraction is sufficient.
- Before drawing or revising any diagram, state its teaching job: what a reader should understand within five seconds, the important entities or states, directional relationships, the single concept (if any) that deserves emphasis, and why React Flow or Excalidraw is the clearer medium. Follow the conceptual model rather than library convenience. Preserve meaningful intermediate states, but hide implementation details that do not aid learning.
- Ground every diagram in the note, verified code/configuration, experiment, or learner statement. Keep stable semantic IDs, one obvious primary path or mental model, and bounded complexity. Prefer roughly 6–12 primary entities; use grouping, surrounding MDX, or another focused view instead of maximizing topology coverage.
- Validate diagrams in layers: structural references and hierarchy; layout overlap, spacing, bounds, and whitespace; routing intersections, crossings, bends, and anchor congestion; readability, density, and primary-path visibility; then actual visual review. Deterministic validation cannot replace inspecting the render.
- When a gate fails, repair the named nodes, edges, group, spacing, routing, or label and revalidate. Preserve unrelated structure; regenerate the whole diagram only when its classification or semantic model is wrong.
- Treat published React Flow as **read-only but navigable**, never as an editor canvas. Source/target handles may exist only for edge calculation and must be visually hidden. Keep topology editing disabled: no node dragging by default, selection, connection creation, deletion, or keyboard manipulation. Preserve viewing controls—pan, zoom, fit view, and fullscreen—so readers can inspect dense diagrams and retain readable text on narrow screens. MiniMaps remain reserved for genuinely large graphs; enable node dragging only when spatial exploration itself teaches the concept.
- Every directional React Flow edge needs an obvious arrowhead, consistent restrained stroke, and a predictable dominant direction (normally left-to-right for pipelines or top-to-bottom for lifecycles). Prevent overlapping edges, floating endpoints, label collisions, and exposed IDs or internal terms. Add an edge label only when it carries essential meaning.
- Keep connector arrows visually centered in the gap between adjacent nodes or cards. At every responsive layout, both the arrow tail and arrowhead must retain visible clearance from the preceding and following boundaries; a connector must never appear stuck to, embedded in, or owned by one card.
- Give React Flow nodes semantic roles such as source/input, process/action, state/data, constraint, and output/consumer. Express these roles through more than color alone. Use one subtle accent for the most important concept, not several competing highlights. Keep node copy to a title and optional short subtitle; split genuinely independent concepts when that makes the state transition clearer.
- Keep all normal node content inside its boundary. Step numbers, eyebrows, labels, titles, descriptions, icons, badges, and metadata must use an internal layout with content-aware height and roughly 12–16px horizontal padding; never move them outside with negative offsets, margins, or transforms. Long text must wrap without crossing the border. External annotations are the only intentional exception, and connector handles/arrows may extend beyond the node for routing. Do not use `overflow: visible` to hide incorrect sizing. After rendering at desktop and narrow widths, verify that text clears every border, metadata clears titles, wrapping increases the node's allocated height, and adjacent nodes/connectors retain separation.
- Manually tune React Flow positions, widths, alignment, whitespace, and branch balance. Use subtle borders, soft surfaces, small radii, restrained or no shadows, and no default dotted/grid background. At narrow widths, prefer intentional scrolling over illegibly shrinking a complex horizontal flow; never silently clip content or place arrows outside the reachable viewport.
- Captions should state the key lesson or distinction rather than narrate every node. A caption cannot compensate for an unclear diagram. Keep terminology aligned with nearby prose, use natural Vietnamese explanations where useful, and preserve established English technical terms.
- Reuse the shared React Flow node roles, edge treatment, canvas, caption, and responsive behavior. Add small focused primitives when a repeated need appears; do not create competing one-off diagram systems or a giant abstraction that obscures the article's node/edge data.
- React Flow layout must communicate graph topology before edge routing becomes noticeable. Classify the graph before positioning nodes: short linear flow, long process, semantic pipeline, branch, merge, or multi-rank graph. Position by conceptual ranks and teaching intent, never by array/source order.
- Do not default to one horizontal row. A row is normally appropriate only for roughly two to four compact nodes that fit the article column at normal text scale. For five or more meaningful stages, evaluate a vertical spine, clear multi-rank composition, or semantic groups. Do not use a snake merely to save width when its changing direction makes sequence harder to scan.
- Treat the Docusaurus article column as a hard width budget. `fitView` is a camera helper, not a layout engine; if it noticeably shrinks text, redesign positions or topology. For narrow screens, provide an intentional alternate layout when practical. Reserve horizontal scrolling primarily for architecture or other graphs whose topology genuinely benefits from a wide canvas.
- Keep consecutive conceptual stages visually adjacent. Prefer edge routing in this order: short straight edge, short orthogonal/step edge, simple smooth-step edge, then a curve only when it teaches something. Long S-curves, crossings, connectors through unrelated nodes, repeated direction changes, and edges routed around half the graph are layout failures; reposition nodes rather than decorating the route.
- Give the primary pipeline an obvious visual spine and place branches in distinct lanes. Align multiple inputs around their merge destination. Use semantic ranks even when lane boxes are not drawn. Primary edges should be shorter and quieter than secondary relationships.
- Vary node size by meaning and content. State/data and consumer nodes may be smaller than process nodes; source groups may be wider only when necessary. Group multiple sources compactly or use small source chips feeding one retrieval stage instead of allowing a large source card to dictate the whole graph. Move sentence-length explanation into surrounding prose.
- For complex automatic layout, ELK or Dagre may provide a starting point, but do not add a heavy dependency for trivial graphs or accept generated positions without tuning rank separation, node separation, alignment, routing, and group placement.
- A React Flow diagram fails review when it resembles spaghetti flow: crossed edges, long decorative curves, loops around nodes, arbitrary node order, unclear next step, or a giant row rescued by `fitView`. Use semantic grouping → sensible placement → short connectors → simple arrows, in that order.
- After positioning nodes, inspect the graph bounds (`minX`, `maxX`, `minY`, `maxY`), normalize away arbitrary layout offsets, and center the actual graph—not merely the React Flow viewport—with modest, approximately balanced outer padding. Unless the composition intentionally calls for asymmetry, left/right whitespace should feel comparable and no node should crowd a canvas boundary.
- Never use large `fitView` padding to disguise poorly translated or unbalanced coordinates. The sequence is semantic layout → graph bounds → coordinate normalization → intentional outer padding → viewport fit. Keep `fitView` padding small after the positions themselves are correct.
- Do not let a tall secondary branch determine the entire canvas height or push the primary path away from the visual center. When one node fans out to several equivalent leaves, emphasize the parent-to-cluster relationship and arrange leaves as a compact stack, grid, or cluster rather than full-size major stages.
- Terminal leaves with little semantic content should normally be smaller than core process nodes. A compact shared leaf cluster is preferable when individual edge geometry adds no teaching value. Review whether compacting the leaves preserves meaning while reducing graph width, height, and edge length.
- During visual review, compare actual empty space around the graph: check for one dramatically emptier side, boundary crowding, secondary branches controlling canvas dimensions, and a main teaching path displaced by leaf details. Fix node bounds and composition before accepting the diagram.
- Reuse the other learning components where appropriate: `TLDR` for the required summary, `Principle` for memorable invariants or decision rules, `ConceptCard` with `ConceptGrid` for small related mental-model groups, and `Comparison` when comparison is the primary teaching structure. Import only the components a note uses.
- Every important diagram needs a concise explanation before or after it; a diagram supports the surrounding explanation rather than replacing it. Keep node count low, emphasize the main path, avoid unnecessary branches, use meaningful labels, and keep terminology consistent with the article.
- Diagram markup must be accessible where practical, responsive, usable on mobile, understandable from its initial fitted view, compatible with light/dark themes, and visually restrained. Navigation may improve inspection but must not be required to discover the core lesson. Use animation only when it genuinely explains progression; explanatory React Flow diagrams should omit editing UI while retaining useful viewing controls.
- Audit any diagram touched by a documentation change for the five-second test: the reader can identify the start, end, major transformations, main emphasis, and direction of information. Meaning must not rely on color; nearby prose must carry every important concept. Preserve an already-clear diagram rather than redesigning it solely for uniformity.
- Reserve fenced code blocks for source code, commands, configuration, prompts, literal input/output, and raw data representations.
- Use Docusaurus `info`, `tip`, and `warning` admonitions selectively for important distinctions, practical guidance, and risks. Use tables when comparison is the primary purpose.
- For dense comparison or rubric tables with several prose-heavy columns, use one shared semantic data source with responsive dual presentation: a real table on desktop/tablet and stacked cards grouped by row or dimension on narrow screens. Preserve the column progression inside each mobile card. Do not solve mobile readability by shrinking text or requiring horizontal scrolling that separates row labels from their values.
- Keep visual styling restrained, technical, semantic, and legible in light and dark themes. Visuals must reduce the effort needed to understand or remember a concept.
- Keep paragraphs focused and scannable, use emphasis sparingly, and avoid creating new abstractions unless a repeated pattern is not covered by the established components. Do not turn ordinary prose into cards. The primary goal is learning clarity.

### Diagram decision model

```text
Does the concept need a visual?
        |
        +-- No --> normal MDX
        |
        +-- Yes
             |
             +-- Mainly a mental model / conceptual explanation? --> Excalidraw
             |
             +-- Mainly nodes, relationships, pipeline, or data flow? --> React Flow
             |
             +-- Only a tiny trivial relationship? --> Mermaid (rare exception)
```

## Language policy

- Write explanations primarily in Vietnamese. Optimize for a Vietnamese software engineer who needs to understand, remember, and apply the knowledge.
- Keep standard software engineering and AI terminology in English when that is how engineers normally recognize and use it. Examples include `Context Engineering`, `Prompt Engineering`, `Context Window`, `Coding Agent`, `Tool Calling`, `Embedding`, `Vector Database`, `Retrieval`, `RAG`, `MCP`, and `LLM`.
- Do not force Vietnamese translations for common technical terms when a translation sounds unnatural, obscures the established term, or makes the concept harder to search and recognize.
- When an important technical term first appears, optionally explain its meaning in Vietnamese if that improves comprehension. For example: “Retrieval là quá trình tìm và lấy ra những thông tin liên quan...” Continue using the standard term consistently afterward.
- Keep code, API names, class names, configuration keys and values, commands, filenames, paths, protocol names, and identifiers in their original language. Do not translate content inside code fences unless the content itself is user-facing prose being demonstrated.
- Keep the standard learning-note section headings in English for consistency: `TL;DR`, `Mental Model`, `Core Concepts`, `Example`, `When to Use`, `Common Mistakes`, `My Understanding`, `My Experiment`, `Related Knowledge`, and `Self-test`.
- The goal is not literal translation or eliminating English. The goal is natural Vietnamese explanation with recognizable industry terminology.
- Apply this policy to new notes and future edits. Do not translate or rewrite unrelated existing articles solely to make them conform.

## Explain technical terms and link learned knowledge

Use this principle: **Explain locally, link when learned, never generate unlearned knowledge just to satisfy a link.**

- Do not list a technical term without enough context for the learner to understand what it means in the current article.
- Keep every knowledge article understandable on its own. A reader should not have to open every linked concept to follow the current explanation.
- If a concept is simple or needs only a short explanation, explain it locally in one or two concise sentences. Do not create a separate article unnecessarily.
- If a concept already has a real learning note in `/docs`, provide enough local context for the current article to remain self-contained, then link to the canonical note when it offers meaningful deeper understanding.
- If an important concept has not actually been learned yet, provide only the minimum explanation needed for the current topic. Do not create a full note or add it to `learning-progress.yaml` merely to satisfy a link. It may be identified as a related or future learning topic when useful.
- Prefer meaningful internal links between concepts the learner has actually learned. For example, `Context Engineering` may connect to `Context Window`, `RAG`, or `Tool Calling` only after those target learning notes exist.
- Avoid excessive linking. Link when the target note adds meaningful understanding, not at every occurrence of a technical term.
- When creating or updating a learning note, search `/docs` for related learned concepts and add useful bidirectional relationships when appropriate. If a later `RAG` learning session creates its canonical note and an existing `Context Engineering` note discusses RAG, consider linking both notes and adding concise relationship explanations.
- Updating an old article to add links or improve short explanations is a presentation and knowledge-connection improvement. It must not invent learning evidence, increase confidence automatically, change learning status automatically, or represent unlearned knowledge as learned.
- Do not introduce or maintain a separate glossary system yet. Use concise local explanations and links between real learning notes until the knowledge base is large enough to justify a glossary.

## Keep personal learning state private

- Store personal status, confidence, checkpoints, review dates, remaining learning work, and evidence references in `learning-progress.yaml`, not public `/docs` or `/blog` content.
- Public articles should use reader-facing sections such as `Key Takeaways`, `Experiment`, `Results`, and `Limitations` only when they communicate reusable knowledge.
- Do not publish `My Understanding`, `My Experiment`, planned/in-progress learning status, “what I still need to learn,” or references to `learning-progress.yaml`.
- Preserve useful experiment setup, observations, failures, results, and limitations, but rewrite them as neutral technical knowledge rather than personal progress evidence.

## Maintain the knowledge graph

- Every learning note must have a `Related Knowledge` section. Add useful relative Markdown links when related learned notes exist; otherwise state the current gap without creating a placeholder note.
- Explain the relationship after each link; do not produce an unexplained link dump.
- Before adding a link, confirm that its target note exists and represents actual learned knowledge. Never create a placeholder target solely to complete the graph.
- When adding, renaming, moving, merging, or deleting a note, search `docs/` for inbound links and update them.
- Add a reciprocal link when the relationship helps readers navigate in both directions.
- Prefer links to canonical learning notes over category landing pages when a relevant note exists.
- Never leave placeholder or broken links in a published note. Run the production build, which treats broken links as errors.

## Validation and handoff

Before finishing a knowledge change:

1. Re-read the edited notes for duplication and contradictions.
2. Confirm the required headings and their order.
3. Confirm personal learning state appears only in `learning-progress.yaml`, while reusable experiment knowledge is preserved in reader-facing form.
4. Check related links and update reciprocal or inbound links where appropriate.
5. Confirm `learning-progress.yaml` matches the real notes and available learning evidence.
6. Confirm public navigation exposes actual learned knowledge and does not publish internal repository instructions. Add a category to public navigation only when it contains intentionally captured learning or experiments.
7. Run `npm run build` and fix all errors.
8. Summarize whether the work created a canonical note, updated one, or consolidated duplicates.

Do not edit generated `build/` or `.docusaurus/` output. Change the source files instead.
