---
name: docs-diagram
description: Orchestrate educational visuals for this repository before renderer-specific work. Classify whether the teaching job is a mental model, static topology, runtime behavior, or quantitative trend; route to Excalidraw, React Flow, Visual Explainer, or charting accordingly; define grounded semantic content and validate the result.
---

# Documentation Visual Orchestration

Treat every visual as a teaching artifact, not decoration and not a renderer demo. The first decision is **what must the learner understand within 3–5 seconds?** The second is whether that understanding is about an idea, a structure, a behavior over time, or a quantitative change.

## Classify before choosing a renderer

Use these four first-class visual modes:

1. **Mental Model / Conceptual Sketch** → `docs-excalidraw`.
   Use for analogy, intuition, conceptual relationships, comparisons, boundaries, filters, buckets, and whiteboard-style explanations.
2. **Static Flow / System Diagram** → `docs-react-flow`.
   Use for architecture, topology, dependency, pipeline structure, component relationships, and graphs where the important lesson is **what connects to what**.
3. **Animated Flow Explainer** → `visual-explainer`.
   Use when the lesson depends on **what happens over time**: request/response, packet/message travel, streaming, retries, tool calls, agent loops, state transitions, retrieval/selection, token/chunk movement, event propagation, queue processing, or lifecycle execution.
4. **Animated Chart / Quantitative Visual** → a shared chart component or the simplest existing charting stack.
   Use when the lesson is a metric, comparison, progression, distribution, latency, token usage, throughput, error rate, score, budget, or value changing over time.

## Mandatory runtime-explainer gate

**If a runtime behavior can be represented truthfully and readably with the shared Animated Flow Explainer, using only a static diagram is a failure.** This is a mandatory renderer-selection rule, not a stylistic preference.

Before accepting any `workflow`, `sequence`, `data-flow`, `lifecycle`, request/response, streaming, retry, agent/tool, RAG, Context Engineering, queue/event, or state-transition visual, explicitly answer:

> Can the important runtime behavior be taught truthfully with `FlowExplainer` using finite states/steps and grounded transitions?

- **If yes:** use Animated Flow Explainer for the runtime story.
- **If the same lesson also needs topology:** keep or add a Static React Flow view for **what connects to what**, and use Animated Flow Explainer for **what happens over time**.
- **If no:** record the concrete reason before using a static-only representation. Valid reasons are limited to:
  1. motion adds no learning value because time/order/state is not part of the lesson;
  2. the current explainer cannot represent the topology/semantics without distortion or hiding important facts;
  3. accessibility, performance, or rendering constraints would make the animated version materially worse than the static alternative.

“Static is simpler”, “React Flow already exists”, “the article already has a diagram”, implementation convenience, or lack of initiative are **not** valid exceptions.

Do not satisfy this gate by enabling perpetual packet animation on a static React Flow. Continuous edge motion is not a substitute for step/state semantics, direction changes, intermediate states, learner controls, or causal explanation.

Do not collapse static topology and runtime explanation into one compromised visual when both teaching jobs are important. Prefer the pair:

**Static React Flow = what connects to what**  
**Animated Flow Explainer = what happens over time**

## Run the pipeline

1. Read the relevant note and verified source facts.
2. State the 3–5 second teaching message and the evidence supporting every entity, relationship, state, and transition.
3. Decide whether a visual materially improves comprehension. Keep normal MDX when prose is clearer.
4. Classify as `mental-model`, `static-topology`, `runtime-behavior`, or `quantitative-change` before selecting a renderer.
5. If runtime behavior exists, run the **Mandatory runtime-explainer gate** before implementing anything static.
6. Define a bounded semantic spec before implementation:
   - stable IDs;
   - entities/nodes and roles;
   - relationships;
   - states and transitions when behavior matters;
   - primary path;
   - timeline/step order when behavior matters;
   - metric and scale when charting;
   - mobile strategy and accessibility message.
7. Select the renderer from the classification and mandatory gate, not from library convenience.
8. Reuse shared infrastructure. Article MDX should declare semantic data/story; shared components own layout, motion, controls, theme, and responsive behavior.
9. Validate structural correctness, layout, routing, readability, animation semantics, reduced-motion behavior, mobile, light/dark themes, and actual visual output.
10. Repair the diagnosed layer only. Regenerate the whole visual only when classification or semantic modeling is wrong.

## Detect behavioral content automatically

Treat these as strong signals that the mandatory runtime-explainer gate applies:

- words such as sends, receives, returns, retries, streams, emits, consumes, calls, waits, transitions, selects, filters, scores, evicts, compresses, chunks, retrieves, routes, propagates, acknowledges;
- arrows whose meaning changes by step or direction;
- a reader asking “what happens next?”, “where is the packet now?”, “why did this item disappear?”, or “how does the state change?”;
- multiple messages over the same connection;
- an important intermediate state that would otherwise be hidden in prose.

For API communication, agent execution, Context Engineering, RAG, tool calling, queues/events, and streaming, assume the gate applies unless inspection shows the lesson is topology-only.

## Animation must encode meaning

Animation is allowed only when motion teaches behavior. A good explainer normally has:

- a finite sequence of named steps;
- one clearly active state at a time;
- active nodes that pulse/highlight subtly;
- active edges that become visually dominant while unrelated edges fade;
- packet/token/chunk motion with restrained glow/trail when movement itself matters;
- a short caption explaining the current step;
- `Play`, `Pause`, `Step`, and `Replay` when the sequence is inspectable;
- deterministic reset state;
- `prefers-reduced-motion` support.

Never animate all edges forever just to make a page feel alive. Continuous ambient motion is secondary to step semantics.

## AI-technical aesthetic

The site may feel slightly “AI-native”: precise, dark-mode friendly, alive, and technical. Use glow, trail, pulse, gradient accents, luminous focus, and compact status indicators **sparingly and semantically**. The active computation/message may glow; the entire page should not.

Avoid cyberpunk decoration, excessive neon, rainbow gradients, glassmorphism everywhere, dense dashboard chrome, or effects that compete with reading. The target is **observing a real system run**, not a sci-fi poster.

## Bound complexity

Keep one primary path or mental model obvious. Prefer roughly 4–10 primary entities in one view. Split before a flow becomes visually dense. Runtime explainers should usually teach one behavior per scenario; use scenario tabs for closely related variants such as REST, gRPC Unary, gRPC Streaming, and GraphQL rather than overlaying every behavior at once.

## Acceptance

Before finishing any visual work:

- verify semantic truth against the note/source;
- verify the first frame is understandable without interaction;
- verify every behavioral visual passed the Mandatory runtime-explainer gate;
- if a behavioral visual remains static-only, verify a valid exception is explicitly documented;
- verify controls and keyboard focus;
- verify mobile/narrow article width;
- verify light and dark themes;
- verify reduced-motion behavior;
- verify no clipping or horizontal overflow;
- verify animation reveals causality rather than decoration;
- run `npm run typecheck`, `npm run build`, and `git diff --check` when execution access is available;
- never claim visual review passed unless the rendered result was actually inspected.
