---
name: docs-learning-architecture
description: Structure or refactor broad learning topics into concise, non-duplicative Docusaurus learning paths while preserving learned knowledge, canonical URLs, progress evidence, and useful diagrams. Use when a learning note becomes a monolith, when several related notes need a canonical map, or when reorganizing a completed/near-complete topic.
---

# Documentation Learning Architecture

Treat a broad learning topic as a small knowledge system, not one ever-growing article. Preserve what the learner actually learned, then organize it so a future reader can recover the mental model quickly and deep-dive only where needed.

## Structure broad topics with progressive disclosure

When a topic contains several distinct sub-concepts, prefer this shape:

1. **Canonical map / entry point** — one compact mental model, the end-to-end lifecycle, key distinctions, and links to deep dives. It is navigation + recall, not a second copy of every explanation.
2. **2–4 conceptual deep dives** — group concepts by one coherent question or mental model. Prefer a few meaningful articles over one article per heading.
3. **Practical / experiment article** — keep implementation, experiment setup, observations, and applied evidence separate when they form a distinct practical purpose.

Do not create a fixed number of pages mechanically. Split only where a section can answer a distinct reader question and remain useful independently.

## Prevent monoliths and fragmentation

Use size as a review signal, not a hard product rule:

- roughly **6–20 KB** is a healthy range for many focused learning articles;
- above **25 KB**, actively review whether multiple mental models are being mixed;
- above **40 KB**, split unless the article is intentionally reference-like and the structure genuinely benefits from staying together.

A broad topic should not require rereading an 80 KB note just to recover its main model. Conversely, do not produce many 2 KB pages that force constant navigation.

When splitting an existing canonical article:

- preserve the established public URL when practical; turn that page into the strongest foundational deep dive or a compact entry page rather than deleting the route;
- move content, do not duplicate it;
- keep exactly one primary home for each definition, distinction, decision rule, example, or detailed checklist;
- in other pages, summarize the connection in one or two sentences and link to the canonical home;
- preserve learner-authored understanding, experiments, caveats, and evidence.

## Separate knowledge architecture from learning evidence

A documentation refactor is not new learning evidence by itself.

- Do not increase `status`, `confidence`, or mastery merely because docs were split, polished, mapped, or diagrammed.
- Do not add a learning checkpoint for purely structural work.
- Keep `learning-progress.yaml` pointing at a real canonical learning note and preserve experiment gaps.
- Only learning discussion, self-test, review, implementation, or experiment evidence can justify progress promotion.

## Design a canonical map

A topic map should let a reader answer within about 30 seconds:

- What is the one mental model?
- What is the canonical lifecycle or relationship between the learned pieces?
- What are the 2–4 distinctions most worth remembering?
- Which article should I open for foundations, optimization/decision rules, operations/debugging, or practice?
- What is still incomplete in the learner's evidence?

Keep the map compact. Do not repeat full examples, long metric catalogs, security checklists, or implementation details there.

## Review diagrams as part of restructuring

Read `docs-diagram` first, then the selected renderer skill.

A diagram survives the refactor only if it has a unique teaching job. Remove or merge diagrams that merely restate nearby prose or duplicate another canonical flow.

- **React Flow**: directed pipelines, lifecycle, data flow, architecture, agent execution, or other topology where edges and progression are the lesson.
- **Excalidraw**: analogy-first mental models, conceptual contrast, whiteboard explanations, or spatial intuition.
- **Normal MDX**: when 2–4 short lines explain the idea more clearly than a visual.

For a broad topic, prefer one **canonical lifecycle React Flow** rather than several slightly different copies of the same pipeline across articles. Deep-dive diagrams should show a genuinely different local relationship.

For 5+ meaningful lifecycle stages, do not force one horizontal row. Prefer `TB`, semantic ranks, or a balanced multi-rank composition. Keep the `primaryPath` explicit, make feedback a secondary outer lane, and verify mobile readability.

Do not use a `Pipeline` card component, ASCII arrows, Mermaid, Excalidraw, and React Flow to depict the same lifecycle in parallel. Pick one canonical representation and let prose handle local reminders.

## Refactor workflow

1. Read `AGENTS.md`, the learning note template, `learning-progress.yaml`, the whole topic, related practical notes, and diagram skills.
2. Inventory concepts by **reader question**, not by existing heading.
3. Identify duplicate explanations and choose one canonical home for each.
4. Propose the smallest coherent article set.
5. Preserve the strongest established URL and repair links/navigation.
6. Review every diagram: teaching job → classification → keep/remove/replace → validate.
7. Keep progress evidence unchanged unless the learner actually supplied new evidence.
8. Run typecheck/build/diagram checks when the environment supports them; otherwise state that runtime visual validation was not performed and avoid claiming it passed.

## Acceptance checklist

A restructure is successful when:

- a reader can recover the topic from the map without opening every article;
- no deep-dive article tries to teach the whole broad topic again;
- no learned concept disappears during condensation;
- definitions and decision rules have one primary home;
- practical evidence stays distinguishable from conceptual knowledge;
- diagrams are fewer but more purposeful, with one canonical end-to-end flow;
- old public entry URLs still lead somewhere useful;
- structural cleanup has not been misrepresented as new mastery evidence.
