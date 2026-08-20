# Learning UI guide

The site presents verified learning, not a generic documentation catalog. Visual treatment should make a concept easier to understand or recall, make actual progress clearer, or make the next learning action obvious.

## Knowledge articles

Use `.mdx` for every knowledge article and start from `docs/_templates/learning-note.mdx`. Prefer ordinary Markdown for prose and use the semantic components exported by `src/components/Learning` when visual hierarchy adds learning value. Keep `My Understanding` and `My Experiment` as owner-authored records.

## Visual decisions

Start with `.agents/skills/docs-visual-density/SKILL.md` to audit the page block-by-block, then use `.agents/skills/docs-diagram/SKILL.md` to classify each required visual before choosing technology:

- **Mental model / conceptual sketch** → Excalidraw.
- **Static flow / system topology** → React Flow.
- **Runtime behavior over time** → Visual Explainer / Flow Explainer.
- **Quantitative change** → chart visualization.
- **Genuine comparison** → Comparison or semantic table.
- **Two to four short lines already explain it** → ordinary MDX.

### Visual-first authoring rule

When a prose block, bullet cluster, or fenced `text` block mainly describes **flow, lifecycle, topology, hierarchy, state transition, causality, comparison, or quantitative change**, and an existing renderer can represent it truthfully, converting it to a visual is **mandatory**, not optional polish. Fenced ASCII/pseudo-diagrams are not acceptable substitutes for React Flow, FlowExplainer, Excalidraw, Comparison, or charts unless the literal terminal/text output itself is the subject.

Do not allow long pages to become walls of prose. After roughly two substantial conceptual blocks without a visual anchor, re-run the visual-density audit. The anchor must teach something; decorative cards do not count.

The key distinction is **structure vs behavior**. React Flow answers “what connects to what?”. Flow Explainer answers “what happens next?”. Do not animate every React Flow edge merely to make a page feel alive. When request/response, streaming, retries, events, messages, tokens, chunks, tool calls, selection, filtering, or state transitions are part of the lesson, prefer a finite step-driven explainer with visible current state.

Important visuals must remain understandable from their initial view and work cleanly on narrow screens. Keep rendering, geometry, animation, controls, theme, and responsive behavior in shared infrastructure rather than article-level boilerplate. Article MDX should declare semantic graph/story data.

### AI-technical aesthetic

The site can look slightly AI-native: technical, precise, dark-mode friendly, and alive. Use a restrained glow/trail for active packets or tokens, a subtle pulse for active computation, luminous focus/active edges, compact step/status indicators, and smooth state transitions when they encode meaning.

Do not turn the site into a cyberpunk dashboard. Avoid rainbow neon, heavy glassmorphism, decorative particles, excessive gradients, or constant animation. Inactive content should stay calm. The intended feeling is **watching a real system execute**, not watching decoration.

### Runtime explainer controls

Finite runtime stories should normally expose `Play`, `Pause`, `Step`, and `Replay`, show the current step, and provide a one-sentence explanation of the current state. Scenario tabs are preferred for related variants. Respect `prefers-reduced-motion`; motion may disappear but semantic emphasis must remain.

## Learning state

`learning-progress.yaml` is the internal source of truth for the author's learning workflow. Never infer a learned state from a file, a planned syllabus, or visual completeness. Public website data describes published content and reader navigation only; it must not expose personal progress.

## Visual hierarchy

Use `TLDR`, `KeyInsight`, `Remember`, and `ImportantDistinction` for high-value recall cues; `Comparison` for genuine comparisons; `ExperimentCard` for explicit experiment state; `TopicPath` for reader-oriented article structure; and `SelfTest` for question-by-question recall. Do not turn ordinary prose into cards.

Dense prose-heavy rubrics use `ResponsiveRubric`: semantic tables remain available on desktop/tablet, while narrow screens group the same score progression into one stacked card per dimension. Keep one data source for both presentations; do not shrink multi-column text or make readers horizontally scroll away from row labels.
