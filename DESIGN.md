# Learning UI guide

The site presents verified learning, not a generic documentation catalog. Visual treatment should make a concept easier to understand or recall, make actual progress clearer, or make the next learning action obvious.

## Knowledge articles

Use `.mdx` for every knowledge article and start from `docs/_templates/learning-note.mdx`. Prefer ordinary Markdown for prose and use the semantic components exported by `src/components/Learning` when visual hierarchy adds learning value. Keep `My Understanding` and `My Experiment` as owner-authored records.

## Diagram decisions

- Start with `.agents/skills/docs-diagram/SKILL.md`: decide whether visualization adds value, classify the communication intent, define grounded semantic content and a primary path, then validate the result.
- Conceptual mental model or analogy → Excalidraw when a visual materially helps.
- Structured flow, pipeline, architecture, or directed graph → shared React Flow infrastructure.
- Two to four short lines already explain it → ordinary MDX.
- Tiny relationships whose topology is the entire lesson → Mermaid as a rare exception, never the default.

Important diagrams must remain understandable without animation and work cleanly on narrow screens. Follow `.agents/skills/docs-excalidraw/SKILL.md` for mental models and `.agents/skills/docs-react-flow/SKILL.md` for structured graphs; keep rendering, geometry, and interaction in shared infrastructure rather than article-level boilerplate. Prefer one primary view with progressive disclosure, deterministic layout from stable semantic input, layered quality gates, actual visual review, and targeted repair over whole-diagram regeneration.

## Learning state

`learning-progress.yaml` is the internal source of truth for the author's learning workflow. Never infer a learned state from a file, a planned syllabus, or visual completeness. Public website data in `src/data/knowledge.ts` describes published content and reader navigation only; it must not expose personal progress.

## Visual hierarchy

Use `TLDR`, `KeyInsight`, `Remember`, and `ImportantDistinction` for high-value recall cues; `Comparison` for genuine comparisons; `ExperimentCard` for explicit experiment state; `TopicPath` for reader-oriented article structure; and `SelfTest` for question-by-question recall. Do not turn ordinary prose into cards.
