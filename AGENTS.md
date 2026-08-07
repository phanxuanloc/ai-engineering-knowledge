# AI Engineering Knowledge Base — Agent Guide

This repository is a personal, evolving AI Engineering knowledge base. AI coding agents maintain it by consolidating understanding, not by accumulating disconnected pages.

These instructions apply to the entire repository.

## Knowledge must come from learning

- Knowledge articles must only be created or expanded from actual learning, discussion, research, or experiments performed by the learner.
- Do not pre-populate the knowledge base with generic AI-generated knowledge.
- Treat a request to explain or brainstorm as discussion, not automatic permission to save a knowledge article. Save or update knowledge only when the learner asks to capture the learning outcome or the active learning workflow explicitly reaches that step.
- Do not invent the learner's understanding, experiment hypothesis, observations, results, or mastery status. Record only what the learner actually expressed or performed; leave explicit gaps when those stages have not happened.
- Infrastructure documents, category metadata, and templates organize learning but do not count as learned knowledge.

## Before editing knowledge

1. Read `README.md`, this file, and `docs/_templates/learning-note.md`.
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

Start new learning notes from `docs/_templates/learning-note.md`. Every learning note must contain these second-level headings in this order:

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

## Language policy

- Write explanations primarily in Vietnamese. Optimize for a Vietnamese software engineer who needs to understand, remember, and apply the knowledge.
- Keep standard software engineering and AI terminology in English when that is how engineers normally recognize and use it. Examples include `Context Engineering`, `Prompt Engineering`, `Context Window`, `Coding Agent`, `Tool Calling`, `Embedding`, `Vector Database`, `Retrieval`, `RAG`, `MCP`, and `LLM`.
- Do not force Vietnamese translations for common technical terms when a translation sounds unnatural, obscures the established term, or makes the concept harder to search and recognize.
- When an important technical term first appears, optionally explain its meaning in Vietnamese if that improves comprehension. For example: “Retrieval là quá trình tìm và lấy ra những thông tin liên quan...” Continue using the standard term consistently afterward.
- Keep code, API names, class names, configuration keys and values, commands, filenames, paths, protocol names, and identifiers in their original language. Do not translate content inside code fences unless the content itself is user-facing prose being demonstrated.
- Keep the standard learning-note section headings in English for consistency: `TL;DR`, `Mental Model`, `Core Concepts`, `Example`, `When to Use`, `Common Mistakes`, `My Understanding`, `My Experiment`, `Related Knowledge`, and `Self-test`.
- The goal is not literal translation or eliminating English. The goal is natural Vietnamese explanation with recognizable industry terminology.
- Apply this policy to new notes and future edits. Do not translate or rewrite unrelated existing articles solely to make them conform.

## Preserve personal learning state

- `My Understanding` and `My Experiment` are owner-authored learning records. Never delete, overwrite, rewrite, or mark them complete merely to make an article look polished.
- When updating an existing note, preserve those sections verbatim unless the user explicitly asks to change them.
- Agents may append clearly labeled prompts, open questions, proposed experiments, or dated observations, but must distinguish those additions from the owner's words.
- Preserve experiment status, results, surprises, and failed attempts. They are knowledge, not cleanup targets.
- If consolidation moves a note, carry all personal learning state into the canonical article and identify its original context.

## Maintain the knowledge graph

- Every learning note must have a `Related Knowledge` section with useful relative Markdown links to existing notes.
- Explain the relationship after each link; do not produce an unexplained link dump.
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
5. Run `npm run build` and fix all errors.
6. Summarize whether the work created a canonical note, updated one, or consolidated duplicates.

Do not edit generated `build/` or `.docusaurus/` output. Change the source files instead.
