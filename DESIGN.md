# Learning UI guide

The site presents verified learning, not a generic documentation catalog. Visual treatment should make a concept easier to understand or recall, make actual progress clearer, or make the next learning action obvious.

## Knowledge articles

Use `.mdx` for every knowledge article and start from `docs/_templates/learning-note.mdx`. Prefer ordinary Markdown for prose and use the semantic components exported by `src/components/Learning` when visual hierarchy adds learning value. Keep `My Understanding` and `My Experiment` as owner-authored records.

## Diagram decisions

- Core learning visual → reusable React component.
- Simple conceptual flow or pipeline → React component.
- Complex graph where automatic layout is materially useful → Mermaid is allowed.
- Temporary technical diagram → Mermaid is allowed.
- Timeline-based explanation where motion is essential → consider Remotion only for that exceptional case.

Important diagrams must remain understandable without animation and stack cleanly on narrow screens. Do not create a one-off component when the same idea can be expressed with `Diagram`, `Pipeline`, `Flow`, `Group`, and `Step`.

## Learning state

`learning-progress.yaml` is the source of truth. Never infer a learned state from a file, a planned syllabus, or visual completeness. Homepage presentation data in `src/data/learning.ts` must stay synchronized with it and must use simpler wording rather than invented percentages.

## Visual hierarchy

Use `TLDR`, `KeyInsight`, `Remember`, and `ImportantDistinction` for high-value recall cues; `Comparison` for genuine comparisons; `ExperimentCard` for explicit experiment state; `LearningPath` for evidence-backed checkpoints; and `SelfTest` for question-by-question recall. Do not turn ordinary prose into cards.

