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
   - **desktop composition and mobile composition separately**;
   - accessibility message.
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

- a finite sequence of named events;
- one clearly active state or meaningful parallel event group at a time;
- active nodes that pulse/highlight subtly;
- active edges that become visually dominant while unrelated edges fade;
- packet/token/chunk motion with restrained glow/trail when movement itself matters;
- a short narrative explaining the current event;
- play/pause, previous/next, replay, and direct event selection when the sequence is inspectable;
- deterministic reset state;
- `prefers-reduced-motion` support.

Never animate all edges forever just to make a page feel alive. Continuous ambient motion is secondary to event semantics.

## Mobile-first visual contract

A visual is not accepted until its **mobile composition is intentional**. `fitView`, browser scaling, or clipping a desktop canvas are not mobile strategies.

For every diagram, FlowExplainer, or chart, decide before implementation what happens around a 360–430px article width.

- **Prefer recomposition over shrinking.** A desktop `LR` graph should normally become a `TB`/vertical composition on narrow screens when semantics survive the change. Runtime explainers should prefer a vertical event spine or stacked narrative rather than scaling a long horizontal trace to tiny text.
- **Do not preserve desktop coordinates blindly.** Fixed horizontal gaps that look good on desktop must not force mobile zoom below readable size or push nodes outside the first frame.
- **No silent clipping.** Nodes, labels, arrowheads, legends, axes, tooltips, controls, and active packets must stay reachable. Page-level horizontal overflow is a failure.
- **Horizontal scrolling is a fallback, not the default.** Use an internal scroll/pan viewport only when topology genuinely depends on horizontal spatial relationships that would be distorted by reflow. The first frame must still explain how to inspect the rest.
- **Fixed height is not authoritative on mobile.** Recompute canvas height from the mobile layout so a desktop height prop does not crop a vertical reflow.
- **Controls must not cover learning content.** Compact, move, or hide nonessential controls on narrow screens; maintain touch targets of roughly 44px where controls remain important.
- **Text stays normal reading size.** Do not solve mobile by shrinking node/axis/legend text until it technically fits.

For charts specifically:
- use responsive width; never rely on a fixed desktop plot width;
- keep category labels readable rather than clipping or auto-skipping the labels that carry the lesson;
- for many categories, prefer a vertical list / horizontal-bar presentation on mobile when that improves label readability;
- wrap or relocate legends instead of letting them steal plot width;
- keep axes, units, and tooltip values accessible; if an axis becomes unreadable, change composition or label density deliberately rather than simply scaling the entire chart down;
- mobile animation must preserve the metric story and must not require hover-only interaction.

Mobile acceptance must inspect at least one narrow viewport representative of ~375px and one wider phone viewport around ~430px whenever execution/render access is available.

## Static React Flow label-clearance gate

Treat every visible edge label as **layout geometry**, not decoration painted after layout.

Before accepting a static React Flow diagram:

- reserve enough rank/node spacing for the longest meaningful edge labels at the current direction and breakpoint;
- keep labels visually attached to their own connector and inside the clear gap between endpoint nodes whenever possible;
- no edge label may overlap node borders, node text, arrowheads, another label, or an unrelated connector;
- for `LR`, horizontal rank spacing must account for label width; for `TB`, inspect sibling/branch lanes because label width can collide laterally even when vertical rank spacing is sufficient;
- when a label does not fit, repair in this order: **shorten redundant wording → increase shared spacing/layout clearance → improve routing/handle placement → split an over-dense view**;
- do **not** fix recurring collisions with arbitrary per-edge `x/y` offsets, negative margins, transforms, tiny font sizes, or by pushing the label so far from the connector that ownership becomes ambiguous;
- opaque label backgrounds may create a clean visual break in the connector, but masking a line does not excuse insufficient node clearance;
- validate the actual render at desktop and narrow/mobile widths after changing labels, node copy, node width, direction, or spacing.

Shared layout infrastructure should solve repeated label-clearance problems automatically when practical. Article authors should not need coordinate patches for ordinary labeled edges.

## Runtime layout and label gate

For `FlowExplainer`, runtime readability includes geometry—not only whether motion exists.

Before accepting the explainer:

- edge message labels should remain visually attached to their connector, normally centered in the connector lane;
- a connector may be visually masked behind the label so the line does not cross the text;
- if a centered message collides with an endpoint node, **increase spacing or shorten the graph label first** rather than pushing the message far away from the connector;
- long graph labels may be truncated when their full value is available in the event narrative/accessible text;
- bounded FlowExplainer node text must remain inside the geometry used for routing; do not allow DOM content growth to silently invalidate node bounds;
- no label may overlap node borders/text, arrowheads, packet paths, or unrelated connectors;
- do not make text unreadably small to rescue an over-dense layout.

Keep this distinction clear: static React Flow can use content-aware node sizing and recalculate topology around it; FlowExplainer may deliberately use compact bounded event-node geometry to preserve stable motion and routing.

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
- verify mobile/narrow article width with an intentional mobile composition, not only scaled desktop output;
- verify light and dark themes;
- verify reduced-motion behavior;
- verify no clipping or page-level horizontal overflow;
- verify animation reveals causality rather than decoration;
- for static React Flow, verify every visible edge label has clear ownership and collision-free node/arrow/label clearance at inspected breakpoints;
- for FlowExplainer, verify edge labels stay attached to connectors and remain collision-free at inspected breakpoints;
- for FlowExplainer, verify node text and visible DOM bounds match the geometry used for routing;
- for charts, verify axes/category labels/legend remain readable on mobile and no essential information depends on hover;
- run `npm run typecheck`, `npm run build`, and `git diff --check` when execution access is available;
- never claim visual review passed unless the rendered result was actually inspected.
