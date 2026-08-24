---
name: docs-learning-architecture
description: Structure or refactor broad knowledge topics into concise, non-duplicative Docusaurus learning paths while preserving canonical URLs, reader comprehension, registry state, and useful diagrams.
---

# Documentation Learning Architecture

Treat a broad topic as a small knowledge system, not one ever-growing article.

## Structure broad topics with progressive disclosure

Prefer, when useful:

1. a canonical map/entry point;
2. 2–4 conceptual deep dives grouped by coherent reader questions;
3. a practical/experiment article when implementation or experiment content has a distinct purpose.

Do not create a fixed number of pages mechanically.

## Registry and navigation

Read `knowledge-progress.yaml` before restructuring. It is the fast inventory of public sharing coverage and private learning status.

- synchronize `sharing.landing` and `sharing.articles` whenever canonical public coverage changes;
- do not change `learning.status` because docs were split, polished, nested, renamed, or diagrammed;
- use `sidebars.ts` only to implement/validate navigation hierarchy, not as the primary progress inventory.

Knowledge hierarchy and sidebar hierarchy should agree. Normally keep navigation near `domain → broad topic → article`; avoid one-item categories and unnecessary depth.

## Prevent monoliths and fragmentation

Use size as a review signal, not a hard rule:

- 6–20 KB is healthy for many focused articles;
- above 25 KB, review whether multiple mental models are mixed;
- above 40 KB, split unless the page is intentionally reference-like.

When splitting:

- preserve established public URLs where practical;
- move content instead of duplicating it;
- keep one primary home per definition, distinction, decision rule, example, or checklist;
- summarize/link from neighboring pages.

## Canonical maps

A topic map should quickly answer:

- what is the one mental model;
- how the pieces relate;
- which distinctions matter most;
- which article to open for foundations, decisions, operations/debugging, or practice.

Do not put private learning gaps into public maps.

## Diagram review

Read `docs-diagram` first, then only the selected renderer skill. Keep a diagram only when it has a unique teaching job. Prefer one canonical end-to-end flow over several slightly different copies.

For 5+ lifecycle stages, avoid one cramped horizontal row; prefer top-to-bottom or balanced semantic ranks and verify mobile readability.

## Refactor workflow

1. Read `AGENTS.md`, `docs/AGENTS.md`, `knowledge-progress.yaml`, the whole topic, and relevant diagram/UI skills.
2. Inventory concepts by reader question.
3. Identify duplicate explanations and choose one canonical home.
4. Propose the smallest coherent article set and sidebar hierarchy.
5. Preserve strong public URLs and repair links/navigation.
6. Review diagrams by teaching job.
7. Synchronize registry sharing paths.
8. Keep private learning status unchanged unless the learner supplied real new evidence.
9. Run relevant docs/type/diagram/build checks.
