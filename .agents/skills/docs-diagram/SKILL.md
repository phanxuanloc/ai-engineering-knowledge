---
name: docs-diagram
description: Orchestrate educational visuals before renderer-specific work. Start from learner question and semantic truth, design the visual story, then choose Excalidraw, React Flow, FlowExplainer, charting, or no diagram.
---

# Documentation Visual Orchestration

Treat every visual as a teaching artifact, not decoration and not a renderer demo. The visual pipeline is:

**Learner Question → Semantic Truth → Visual Story → Visual Grammar → Renderer → Validation**

Never start by asking “which diagram/library should I use?”. Start by asking **what misconception or question must become obvious within 3–5 seconds?**

## 1. Story-first gate

Before creating any visual, write a compact internal spec with these fields:

- **Learner question:** the exact question the visual answers.
- **Five-second takeaway:** what should be obvious before every label is read.
- **Entities:** real concepts/components/states that are allowed to appear.
- **Relationships:** only relationships supported by the note/source.
- **Ordering:** which events are strictly ordered, partially ordered, concurrent, or unordered.
- **State changes:** what actually changes over time, if anything.
- **Invariants:** facts the visual must preserve at every breakpoint.
- **Forbidden implications:** relationships/order/topology the layout must never suggest.

If these cannot be stated confidently, do not draw yet. Repair the semantic model first.

### Semantic implication gate

A visual is wrong when its geometry implies something the semantic spec does not.

Examples:

- sibling branches stacked vertically must not read as `A → B → C`;
- routing, firewall, and NAT responsibilities must not automatically become three physical hops;
- independent GraphQL resolver calls must not become a forced sequence;
- a conceptual progression must not be presented as a packet path unless real transport is the lesson.

Validation must check **rendered implication**, not only whether the authored edge list is technically correct.

### Phase-flow rule for layered mental models

Do not confuse **“some internals are unordered/optional”** with **“the whole concept has no flow.”**

When the learner needs to understand a real logical progression across responsibility or failure boundaries, prefer a **phase flow**:

- one node per meaningful phase/boundary;
- connect only phases whose progression is semantically true;
- keep optional, deployment-specific, concurrent, or unordered internals inside the phase as short detail/annotation;
- never explode those internals into a fake primary path merely to show more concepts.

Example for networking/web fundamentals:

`Client → Resolve Destination → Reach Destination → Establish Communication → Process Request → Result`

Inside `Reach Destination`, routing/firewall/NAT may be listed as responsibilities, but must not automatically become `Routing → Firewall → NAT` edges. Inside `Process Request`, proxy/LB/application/data may be shown as examples without claiming every deployment has that exact topology.

Use this rule when a mental model has **true progression at one abstraction level** but **non-sequential detail inside each stage**.

## 2. No-diagram is a valid outcome

A visual must expose something that prose, a short list, or normal learning cards cannot expose as clearly.

Use **no diagram** when:

- the idea is already clear in 2–4 short lines;
- spatial layout adds no information;
- drawing would invent topology/order;
- concepts are genuinely unordered and connecting them would imply a false progression.

Do **not** choose no-diagram merely because lower-level responsibilities are not strictly sequential. If a higher-level logical progression is real, use the phase-flow rule above.

Do not add a diagram merely because the page should look “AI-native” or because a renderer is available.

## 3. Choose visual grammar before renderer

Classify the teaching job using the smallest grammar that preserves truth:

1. **Concept / Boundary / Mental Model** — analogy, responsibilities, buckets, filters, layers, constraints, comparisons.
2. **Phase Flow** — real progression across high-level responsibility/failure boundaries while lower-level details remain optional or unordered.
3. **Topology** — what connects to what.
4. **Sequence / Timeline** — what happens before/after and where time/order matters.
5. **State Transition** — one entity changing state.
6. **Transformation** — input becomes another representation, e.g. documents → chunks → embeddings.
7. **Transport** — packet/message/token physically or logically moves between endpoints.
8. **Quantitative Change / Simulation** — values, metrics, distributions, trade-offs, or causal input/output changes.

Do not collapse all runtime behavior into “a flow with moving dots”. Transport, state transition, transformation, sequence, phase flow, and simulation are different teaching grammars.

## 4. Renderer routing

Choose a renderer only after the grammar is clear:

- **Excalidraw** → analogy-first mental models, conceptual boundaries, comparisons, filters, whiteboard explanations.
- **React Flow** → phase flows, topology, dependency, architecture, structured graph relationships where explicit connections/progression teach the lesson.
- **FlowExplainer** → inspectable runtime stories with finite events, meaningful state changes, request/response, fan-out/fan-in, retries, streaming, agent/tool loops.
- **Chart / interactive component** → quantitative change, simulation, distributions, latency/cost/quality trade-offs.
- **Normal MDX / Concept cards** → truly unordered responsibilities/questions where connecting them would create false meaning.

Renderer choice is a consequence of the semantic story, never the starting point.

For a **phase flow**, React Flow is appropriate even when the phase internals are not a topology. The authored edges represent only the high-level progression; internals stay as node detail or surrounding explanation.

## 5. Progressive story instead of show-everything-first

When the learner benefits from building the model incrementally, define **scenes**. A scene may show only the subset needed for the current inference.

Each scene can specify:

- visible entities;
- active/highlighted entities;
- transitions;
- state changes;
- annotations;
- takeaway.

Do not show the complete architecture in frame 1 by default. Reveal complexity only when the learner needs it.

A valid progressive explainer may look like:

`Question → candidate set → scoring → selected subset → context window → answer`

rather than presenting every source, ranker, store, model, and edge immediately.

## 6. Mandatory runtime-explainer gate

If the lesson depends on time/order/state and shared `FlowExplainer` can represent it truthfully, static-only treatment is a failure.

Before accepting a workflow, lifecycle, request/response, streaming, retry, agent/tool, RAG, Context Engineering, queue/event, or state-transition visual, ask:

> Can the important runtime behavior be taught truthfully with finite scenes/events and grounded transitions?

- **Yes** → use FlowExplainer or another semantic runtime primitive.
- **Topology also matters** → pair a focused static topology with the runtime story; do not overload one view.
- **No** → document the concrete reason: motion adds no learning value, the runtime renderer would distort semantics, or accessibility/performance would materially worsen the lesson.

A phase flow whose primary lesson is **debug responsibility/failure boundaries** may remain static when animation adds no extra causal information. Do not animate it merely to look alive.

Perpetual edge animation is not a substitute for event semantics.

## 7. Animation must encode meaning

Animation is allowed only when motion teaches causality.

Good animation can encode:

- one-shot message transport;
- state changes such as pending → running → success;
- transformation such as documents → chunks;
- progressive reveal/construction;
- finite fan-out/fan-in;
- persistent stream/waiting state;
- numeric progression.

Avoid ambient motion, infinite packets, pulsing every node, or effects that merely make the page look technical.

For inspectable runtime stories, prefer:

- finite named events;
- deterministic reset;
- previous/next/play/pause/replay;
- direct event selection when useful;
- visible current-event narrative;
- `prefers-reduced-motion` support.

## 8. Complexity bound

Use **one visual = one learning question**.

Prefer roughly 4–10 primary entities in one topology view. Split overloaded stories. If several technologies/scenarios share the same teaching question, use tabs/scenarios rather than overlaying every path.

Do not create long snake diagrams simply to fit many concepts. A 10-node primary path is a warning sign: verify that those nodes are truly sequential events rather than independent responsibilities, optional infrastructure, branches, or conceptual layers.

For layered concepts, **compress to phase nodes before deleting the visual**. A six-node phase flow can be more truthful than either an eleven-node snake or a prose-only replacement.

## 9. Mobile semantic contract

Responsive layout may change geometry but never meaning.

- Recompose before shrinking.
- Linear and phase flows may become vertical.
- Sibling branches remain siblings.
- Fan-out/fan-in must not become false chains.
- Preserve authored relationships across breakpoints; node array order is not topology.
- Branch labels remain owned by their branch.
- Do not silently clip nodes, labels, arrows, controls, or active packets.
- Horizontal scroll/pan is a fallback only when reflow would distort the topology.
- Compute bounds from final responsive geometry; `fitView` frames valid geometry, it does not repair invalid layout.
- Keep readable text and usable touch targets.

## 10. React Flow acceptance

Use React Flow when explicit relationships or high-level progression itself teaches the lesson.

Before accepting:

- primary path/branch/phase structure is obvious within seconds;
- no invented sequential relationship;
- phase nodes do not leak unordered internals into fake edges;
- no node/edge/label overlap;
- labels visibly belong to their connectors;
- feedback loops stay outside the main corridor;
- arrow direction is clear;
- mobile preserves topology/phase semantics;
- interaction matches the teaching job;
- a simpler mental-model or MDX representation would not be clearer.

Static React Flow can answer **what connects to what** or **what high-level phase comes next**. It does not automatically explain runtime timing or packet transport.

## 11. Mental-model acceptance

For a Mental Model section, do not assume either “graph required” or “graph forbidden.”

Prefer one of these outcomes:

- conceptual Excalidraw when spatial metaphor helps;
- **phase flow when responsibilities form a real logical progression but internals are optional/unordered**;
- progressive explainer when understanding requires observing change;
- responsibility/question cards when concepts are genuinely unordered boundaries;
- a tiny topology only when real relationships are the lesson;
- plain prose when that is clearest.

A mental model fails when the visual contradicts the prose. If prose says “routing/firewall/NAT are responsibilities, not sequential physical hops”, the visual may still show a higher-level `Reach Destination` phase, but must not present those internals as one long connected primary path.

## 12. Validation

Before finishing visual work:

1. Re-read the learner question.
2. Verify every entity, relationship, order, and state change against source truth.
3. Check forbidden implications against the actual rendered composition.
4. Verify abstraction level consistency: phase edges connect phases; optional internals do not silently become topology.
5. Verify the first frame teaches without interaction.
6. Verify mobile preserves semantics.
7. Verify animation encodes causality rather than decoration.
8. Verify light/dark and reduced-motion behavior where applicable.
9. Verify no clipping, overflow, unreadable labels, or controls covering learning content.
10. Run `npm run typecheck`, `npm run build`, and `git diff --check` when execution access exists.
11. Never claim visual review passed unless the rendered output was actually inspected.

When a gate fails, repair the semantic model/story first. Only then repair renderer/layout details. Do not accumulate coordinate hacks around a wrong teaching abstraction.
