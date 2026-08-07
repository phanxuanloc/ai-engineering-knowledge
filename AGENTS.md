# AI Engineering Knowledge Base — Agent Guide

This repository is a personal, evolving AI Engineering knowledge base. AI coding agents maintain it by consolidating understanding, not by accumulating disconnected pages.

These instructions apply to the entire repository.

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
