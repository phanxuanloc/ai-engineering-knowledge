# AI Engineering Knowledge Base — Agent Guide

This repository is a personal, evolving AI Engineering knowledge base. AI coding agents maintain it by consolidating understanding, not by accumulating disconnected pages.

These instructions apply to the entire repository.

## Knowledge must come from learning

- Knowledge articles must only be created or expanded from actual learning, discussion, research, or experiments performed by the learner.
- Do not pre-populate the knowledge base with generic AI-generated knowledge.
- Treat a request to explain or brainstorm as discussion, not automatic permission to save a knowledge article. Save or update knowledge only when the learner asks to capture the learning outcome or the active learning workflow explicitly reaches that step.
- Do not invent the learner's understanding, experiment hypothesis, observations, results, or mastery status. Record only what the learner actually expressed or performed; leave explicit gaps when those stages have not happened.
- Infrastructure documents, category metadata, and templates organize learning but do not count as learned knowledge.

## Guide broad topics as learning journeys

- When recommending a new broad topic, do not only name the topic. First provide a concise `Learning Map` or syllabus of the important subtopics needed to understand it, then recommend the next small subtopic to study.
- Keep the distinction explicit: **Learning Map = what is planned to learn; Learning Progress = what has actually been learned.** A Learning Map guides future sessions but is not evidence of knowledge.
- Do not create knowledge notes or `learning-progress.yaml` entries for planned subtopics merely because they appear in a Learning Map. Record a subtopic only after actual learning reaches the save/update checkpoint and has real evidence.
- Treat “Chốt kiến thức” as a learning checkpoint for the material actually covered, not as automatic completion of the whole broad topic.
- After a checkpoint, prefer continuing with the next logical small subtopic in the same active topic.
- Move to a new broad topic only when the current topic has sufficient learning evidence, or when a prerequisite detour is needed to continue. Make a prerequisite detour explicit and return to the active topic afterward when appropriate.

The default journey for a broad topic is: Broad Topic → Learning Map → Small Subtopic → Learn → Checkpoint ("Chốt kiến thức") → Update actual knowledge/progress → Suggest next logical subtopic → Repeat → Experiment → Applied/Mastered.

## Keep the learning index synchronized

`learning-progress.yaml` is the machine-readable source of truth for the learner's current learning state. `/docs` contains what was learned; the index records progress and evidence state for each real topic.

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
- Base status and confidence changes on actual evidence from `My Understanding`, experiments, self-test results, reviews, discussion, or demonstrated application. Never fabricate evidence or promote progress automatically.
- Set `learned_at` to the date of the first real learning session, not the file creation date when those differ. Change `last_reviewed` only after an actual review.
- Keep arrays empty when there is no actual relationship or experiment to record. Do not pre-populate a curriculum.
- A structural category `index.mdx`, `docs/_templates/learning-note.mdx`, and `docs/start-here/learning-workflow.mdx` must never receive topic entries.

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
7. `My Understanding`
8. `My Experiment`
9. `Related Knowledge`
10. `Self-test`

Category landing pages, navigation files, and templates are not learning notes and do not need this structure.

Use descriptive kebab-case filenames and Docusaurus front matter. Keep explanations concise, practical, and grounded in examples. Mark assumptions and unverified claims clearly.

## Documentation format and visual conventions

- Use `.mdx` for all files under `docs/`, including learning notes, category landing pages, workflow documentation, and templates. Preserve existing front matter, slugs, sidebar order, public URLs, and internal links when migrating or renaming a source file.
- Follow this order of preference: standard Markdown → Mermaid → native Docusaurus features → JSX/React only when materially justified. MDX does not by itself justify a React component.
- Use Mermaid when architecture, workflow, data flow, agent flow, context pipeline, sequence, or concept relationships become easier to understand visually. Do not use plain-text code blocks as diagrams or use Mermaid as decoration.
- Reserve fenced code blocks for source code, commands, configuration, prompts, literal input/output, and raw data representations.
- Use Docusaurus `info`, `tip`, and `warning` admonitions selectively for important distinctions, practical guidance, and risks. Use tables when comparison is the primary purpose.
- Keep visual styling restrained, technical, semantic, and legible in light and dark themes. Visuals must reduce the effort needed to understand or remember a concept.
- Keep paragraphs focused and scannable, use emphasis sparingly, and avoid premature reusable components. The primary goal is learning clarity.

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

## Preserve personal learning state

- `My Understanding` and `My Experiment` are owner-authored learning records. Never delete, overwrite, rewrite, or mark them complete merely to make an article look polished.
- When updating an existing note, preserve those sections verbatim unless the user explicitly asks to change them.
- Agents may append clearly labeled prompts, open questions, proposed experiments, or dated observations, but must distinguish those additions from the owner's words.
- Preserve experiment status, results, surprises, and failed attempts. They are knowledge, not cleanup targets.
- If consolidation moves a note, carry all personal learning state into the canonical article and identify its original context.

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
3. Confirm personal sections were preserved.
4. Check related links and update reciprocal or inbound links where appropriate.
5. Confirm `learning-progress.yaml` matches the real notes and available learning evidence.
6. Run `npm run build` and fix all errors.
7. Summarize whether the work created a canonical note, updated one, or consolidated duplicates.

Do not edit generated `build/` or `.docusaurus/` output. Change the source files instead.
