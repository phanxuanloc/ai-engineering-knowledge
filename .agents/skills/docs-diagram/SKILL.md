---
name: docs-diagram
description: Orchestrate educational visuals before renderer-specific work. Start from learner question and semantic truth, design a progressive visual story, then choose Excalidraw, React Flow, FlowExplainer, charting, or no diagram.
---

# Documentation Visual Orchestration

Treat every visual as a teaching artifact, not decoration and not a renderer demo. The visual pipeline is:

**Learner Question → Semantic Truth → Visual Story → Presentation Mode → Visual Grammar → Renderer → Validation**

Never start by asking “which diagram/library should I use?”. Start by asking **what misconception or question must become obvious within 3–5 seconds?**

## 1. Public-doc boundary

Public `/docs` must contain the finished knowledge, not the discussion that produced it.

Never publish authoring or review rationale such as:

- “why this diagram is better than the old one”;
- “why the previous flow was wrong”;
- “why the agent chose React Flow / FlowExplainer”;
- instructions to future agents or reviewers;
- implementation notes, renderer limitations, migration commentary, or design-process discussion.

Those belong in skills, agent instructions, review notes, issues, PR/commit context, or other non-public repository files.

A public note may explain a **domain truth** that also motivated the visual—for example, “routing, firewall, and NAT are responsibilities and do not necessarily correspond to three separate physical hops”—but it must be written as durable subject-matter knowledge, never as commentary about how the page was edited.

Before publishing, run a **shareability pass**: if a sentence only makes sense to someone who watched the authoring conversation, remove or rewrite it.

## 2. Story-first semantic gate

Before creating any visual, write a compact internal spec:

- **Learner question** — exact question the visual answers.
- **Five-second takeaway** — what should be obvious before every label is read.
- **Entities** — real concepts/components/states allowed to appear.
- **Relationships** — only relationships supported by the note/source.
- **Ordering** — strictly ordered, partially ordered, concurrent, or unordered.
- **State changes** — what actually changes over time.
- **Invariants** — facts the visual must preserve at every breakpoint.
- **Forbidden implications** — relationships/order/topology the layout must never suggest.

If these cannot be stated confidently, repair the semantic model before drawing.

A visual is wrong when its geometry implies something the semantic spec does not. Sibling branches must not become a chain. Routing/firewall/NAT must not automatically become three physical hops. Independent resolver calls must not become a forced sequence. A conceptual progression must not masquerade as packet transport.

Validation checks **rendered implication**, not only the authored edge list.

## 3. Preserve real flow without inventing topology

Do not confuse **“some internals are unordered/optional”** with **“the whole concept has no flow.”**

When a real logical progression exists across responsibility, state, lifecycle, or failure boundaries, preserve it. Connect only transitions whose progression is semantically true. Optional, deployment-specific, concurrent, or unordered internals may be grouped, annotated, expanded only when active, or shown as branches instead of being forced into the primary path.

Use abstraction to remove false edges, not to remove useful flow.

## 4. Choose presentation mode before renderer

Every visual must deliberately choose one of these presentation modes:

### Overview

Show the complete structure when the learning question is **“what exists and how is it connected?”** Full topology is appropriate only when seeing the whole graph at once materially helps comprehension.

### Progressive

Build the model over finite scenes when the learning question is **“how does this unfold?”** A scene may reveal only the entities needed for the current inference. Nodes and edges may appear, expand, collapse, fade, or become persistent as the story advances.

Default to progressive presentation when showing the complete graph would force aggressive `fitView`, shrink text/nodes, hide the primary path, or make the learner search for where to look next.

### Focused runtime

Keep useful context visible but visually subordinate inactive regions while the current message, state, branch, or transformation is emphasized. Use this when learners benefit from orientation to the larger system but should follow one active event at a time.

**Do not default to show-everything-first.** The first frame should contain the minimum structure required to understand the first inference, unless overview itself is the lesson.

## 5. Progressive-scene contract

When using progressive or focused runtime presentation, define scenes/events explicitly. Each may specify:

- visible entities;
- newly revealed entities;
- active/highlighted entities;
- persistent context;
- visible edges;
- transitions/messages;
- state changes;
- expanded/collapsed detail;
- annotations;
- takeaway.

Later scenes may accumulate earlier context, replace it, or collapse it depending on the teaching story. Do not require every node to exist visually in every frame.

Progressive reveal is especially preferred when a complete diagram would be too small on desktop or mobile. **Fit-to-screen is not a reason to make the learning content tiny. Reduce simultaneous visual complexity first.**

## 6. Choose visual grammar

Use the smallest grammar that preserves truth:

1. **Concept / Boundary / Mental Model** — analogy, responsibilities, buckets, filters, layers, constraints, comparisons.
2. **Phase Flow** — real progression across high-level boundaries while lower-level details remain optional or unordered.
3. **Topology** — what connects to what.
4. **Sequence / Timeline** — what happens before/after.
5. **State Transition** — one entity changing state.
6. **Transformation** — input becomes another representation.
7. **Transport** — packet/message/token moves between endpoints.
8. **Quantitative Change / Simulation** — metrics, distributions, trade-offs, causal input/output changes.

Do not collapse all runtime behavior into “a flow with moving dots”. A single story may combine grammars when that is truthful—for example progressive reveal + transport + state change.

## 7. Renderer routing

Choose a renderer only after semantic story, presentation mode, and grammar are clear:

- **Excalidraw** → analogy-first mental models, conceptual boundaries, comparisons, whiteboard explanations.
- **React Flow** → overview topology or static phase flow where explicit structure/progression is the lesson.
- **FlowExplainer** → progressive/focused runtime stories with finite events, reveal, request/response, fan-out/fan-in, retries, streaming, agent/tool loops, state changes, or transport.
- **Chart / interactive component** → quantitative change, simulation, distributions, latency/cost/quality trade-offs.
- **Normal MDX / Concept cards** → genuinely unordered ideas where spatial representation adds no learning value.

Do not use static React Flow merely because the final topology can be represented as nodes and edges. If the learner should follow a journey through that topology, prefer a progressive/focused explainer.

## 8. Runtime and animation gate

If the lesson depends on time, order, state, transport, reveal, or causal progression and the shared runtime primitives can represent it truthfully, static-only treatment is a failure.

Animation must encode meaning. Useful animation includes:

- node/edge reveal when a concept becomes relevant;
- one-shot packet/message/token transport;
- pending → running → success/failure state change;
- expand/collapse of the currently active boundary;
- fade/de-emphasis of irrelevant context;
- finite fan-out/fan-in;
- transformation between representations;
- response returning along a path;
- persistent waiting/stream state;
- numeric progression.

Avoid ambient infinite packets, pulsing everything, or decorative motion.

Prefer finite named events, deterministic reset, previous/next/play/pause/replay, direct event selection when useful, a visible current-event narrative, and `prefers-reduced-motion` support.

## 9. Density and fitView gate

Before showing the complete graph, ask:

> At normal article width, can the primary labels remain comfortably readable without zooming or shrinking the graph aggressively?

If no, do not solve it first with smaller nodes, smaller fonts, or a more aggressive `fitView`. Choose one or more of:

- progressive reveal;
- focused runtime presentation;
- semantic grouping/boundaries;
- multiple focused scenes;
- tabs/scenarios for alternatives;
- a separate overview paired with a runtime story.

A graph being technically able to fit inside the canvas is not acceptance. The learner must be able to follow it at normal reading size.

Long snake diagrams are a warning sign. Verify that nodes are truly sequential. If they are, progressive presentation may still be better than showing the whole chain at once.

## 10. Mobile semantic contract

Responsive layout may change geometry but never meaning.

- Recompose before shrinking.
- Progressive scenes should keep only the necessary active context on narrow screens.
- Linear/phase flows may become vertical.
- Sibling branches remain siblings; fan-out/fan-in must not become false chains.
- Preserve authored relationships across breakpoints.
- Never silently clip nodes, labels, arrows, controls, or active packets.
- Horizontal scroll/pan is a fallback only when reflow would distort topology.
- Compute bounds from the current scene, not blindly from the maximum possible graph.
- `fitView` frames valid geometry; it must not repair excessive simultaneous complexity.
- Keep normal reading-size text and usable touch targets.

## 11. Mental-model acceptance

For a Mental Model section, choose the experience that teaches fastest:

- conceptual Excalidraw for analogy/spatial metaphor;
- static phase flow when seeing all phases at once is the lesson and remains readable;
- **progressive FlowExplainer when the learner should experience the journey step by step**;
- focused runtime when the whole system provides orientation but only one event should dominate;
- tiny topology when real relationships are the lesson;
- cards/prose only when a visual genuinely adds no value.

Accuracy does not mean “make everything abstract”. Keep useful detail, but reveal it at the moment it becomes relevant and connect only relationships that are true.

## 12. Validation

Before finishing visual work:

1. Re-read the learner question and five-second takeaway.
2. Verify every entity, relationship, order, branch, and state change against source truth.
3. Check forbidden implications against the rendered composition.
4. Verify the chosen presentation mode is intentional: overview, progressive, or focused runtime.
5. For progressive visuals, verify each scene teaches one inference and does not reveal unnecessary future complexity.
6. Verify labels remain readable at normal article width without relying on aggressive fit-to-screen.
7. Verify mobile preserves semantics and reading size.
8. Verify animation encodes causality/reveal/state rather than decoration.
9. Verify first frame is useful before interaction and controls do not cover content.
10. Verify light/dark and reduced-motion behavior where applicable.
11. Verify no clipping, overflow, unreadable labels, or misleading inactive edges.
12. Run `npm run typecheck`, `npm run build`, and `git diff --check` when execution access exists.
13. Never claim rendered visual review passed unless the rendered output was actually inspected.
14. Run a public-doc shareability pass: remove authoring discussion, old-vs-new commentary, agent instructions, and renderer rationale from `/docs`.

When a gate fails, repair the semantic story/presentation first. Do not accumulate coordinate hacks around a wrong teaching abstraction.