---
name: visual-explainer
description: Design and implement event-driven animated learning surfaces for technical runtime behavior, interactive experiments, and quantitative change. Use when a concept is learned better by observing states, messages, tokens, chunks, requests, retries, streams, fan-out, or metrics change over time than by reading a static diagram.
license: MIT
metadata:
  upstream: nicobailon/visual-explainer
  upstream-version: "0.8.1"
---

# Visual Explainer

This repository-local skill turns runtime behavior into inspectable learning stories. It adapts `nicobailon/visual-explainer` principles to site-native React/MDX and defines the canonical shared `FlowExplainer`.

## Mandatory use rule

When the concept includes runtime behavior and the shared `FlowExplainer` can represent that behavior truthfully and readably, **use it**. Static-only treatment is not acceptable in that case.

This applies especially to request/response, streaming, retries, state transitions, agent/tool execution, RAG, Context Engineering, queue/event processing, token/chunk/message movement, and lifecycle behavior.

A static React Flow may still appear beside the explainer when topology itself is also a teaching goal:

- Static React Flow answers **what connects to what**.
- Animated Flow Explainer answers **what happens over time**.

Do not replace a runtime explainer with perpetual animated React Flow edges. Ambient motion does not satisfy this rule.

A static-only exception is valid only when:
1. time/order/state is not part of the lesson;
2. the current explainer would distort or hide important topology/semantics;
3. accessibility, performance, or rendering constraints make animation materially worse.

Implementation convenience is not an exception.

## First-class use cases

Use this skill for:

- request → processing → response;
- REST, gRPC unary, gRPC streaming, GraphQL resolver/data-source behavior;
- Agent → Tool → Observation → next action loops;
- RAG: source → chunk → embed → retrieve → select → context → LLM;
- Context Manager: candidates → score/signals → select → budget → Context Window;
- token/chunk/message movement;
- retry, timeout, backoff, queue, event, acknowledgement, and state-machine behavior;
- fan-out / fan-in and parallel calls;
- interactive experiments where changing an input reveals causality;
- animated charts where progression or changing metrics are the lesson.

If the lesson is only topology, use `docs-react-flow`.

## Canonical runtime story model

Author semantic scenarios and events, not CSS animation instructions.

A scenario should contain:
- stable scenario ID and label;
- ordered entities/nodes with semantic roles;
- explicit edges when topology is not a simple linear sequence;
- a finite ordered event list;
- deterministic reset state.

Each event should describe the real behavior:
- `from` / `to` for one transition;
- `transitions` for parallel fan-out/fan-in;
- `message` when payload identity matters;
- `repeat` for multiple chunks/messages;
- `persistent` for state that stays alive across an event, such as an open stream;
- `active` for components computing or waiting;
- optional `durationMs` only when the behavior genuinely needs a different inspection time.

The article says **what happens**. Shared components own layout, motion, controls, theme, and responsive behavior.

Example:

```tsx
<FlowExplainer
  title="GraphQL request"
  scenarios={[
    {
      id: 'graphql',
      label: 'GraphQL',
      nodes: [...],
      edges: [...],
      steps: [
        {
          title: 'Client query',
          from: 'client',
          to: 'graphql',
          message: 'user { orders {...} }',
          description: 'Client asks for a data shape.',
        },
        {
          title: 'Resolver fan-out',
          transitions: [
            {from: 'graphql', to: 'db', message: 'user'},
            {from: 'graphql', to: 'rest', message: 'orders'},
            {from: 'graphql', to: 'grpc', message: 'rewards'},
          ],
          active: ['graphql'],
          description: 'Independent resolver dependencies can run in parallel.',
        },
      ],
    },
  ]}
/>
```

Do not create article-specific animation engines.

## FlowExplainer v2 experience contract

`FlowExplainer` is an **event trace**, not a diagram with decoration.

Required behavior:

1. **One-shot event motion.** A packet/message appears, travels, arrives, and fades. Do not loop ordinary request/response motion forever.
2. **Playback synchronized to events.** Use an event lifecycle/timer, not unrelated animation and step intervals that drift apart.
3. **Parallel transitions are first-class.** Fan-out/fan-in must be representable in one event instead of faking concurrency as a forced sequence.
4. **Persistent state is explicit.** Open streams, waiting states, locks, active context, or long-lived channels should remain visually present while later events occur.
5. **Narrative is integrated with the visual stage.** The current event title, payload, and explanation should be visible without forcing the reader to scan far below the diagram.
6. **Timeline is inspectable.** Provide play/pause, previous/next, replay, and direct event selection. Prefer a timeline/scrubber over a row of unrelated numbered control dots.
7. **Semantic state beats decoration.** Distinguish idle, active, persistent/waiting, success/failure when relevant. Motion/glow must encode meaning.
8. **First frame must teach.** Before interaction, the topology, current event, and primary path must already be understandable.
9. **Mobile becomes a narrative composition.** Do not merely shrink a desktop graph until labels are unreadable.
10. **Reduced motion keeps meaning.** Disable travel/glow while preserving active edge/node/state emphasis.

## Layout, labels, and collision contract

FlowExplainer uses a compact event-trace geometry, so text and connector layout must be bounded deliberately rather than allowed to expand unpredictably.

- **Edge message labels belong on the connector.** For a normal transition, center the message at the edge midpoint. Do not move it far above/below the line merely to avoid a collision; that breaks the visual association between message and transition.
- **Create visual clearance behind the label.** The label surface may mask the connector underneath so the line appears to pause through the text and continue on both sides. The arrow must remain visually readable as one connector.
- **Spacing is the first collision fix.** If a centered message would touch either endpoint node, increase rank/column spacing or otherwise create a wider connector lane before considering label offset. Layout should make room for semantic content.
- **Truncate graph labels, preserve full meaning elsewhere.** A long edge message may use bounded width plus ellipsis inside the graph because the full payload/message is repeated in the adjacent event narrative and may also be exposed through a title/accessible label. Do not let a pill overlap a node just to display every character inline.
- **FlowExplainer node geometry is bounded.** Node title/detail text must stay inside the node and must not silently make the rendered DOM box larger than the geometry React Flow uses for routing. Use bounded lines/ellipsis for event-trace nodes; keep the full concept in surrounding narrative when needed.
- **Static React Flow has a different text policy.** Content-aware node growth in `docs-react-flow` is valid because topology layout can recalculate around it. Do not copy that rule blindly into FlowExplainer when fixed event-trace geometry is what keeps motion/routing stable.
- **No connector-label-node overlap at any inspected breakpoint.** Labels must not cover node borders, node text, arrowheads, packet paths, or unrelated connectors.
- **Do not solve collisions by shrinking text below normal reading size.** Prefer more space, shorter graph labels, or a different composition.

The acceptance example `gRPC Unary → GetPaymentRequest` in `api-communication-fundamentals.mdx` is a useful regression case: the message should appear centered in the connector lane between `Order Service` and `HTTP/2`, not inside either node and not detached far below the edge.

## Motion semantics

Prefer:
- bright active connection while inactive structure recedes;
- a one-shot packet/token/chunk on the active transition;
- a short arrival/focus reaction at the destination;
- restrained glow/trail only around the active computation/message;
- stable spatial continuity between events;
- message labels such as `GET /users`, `protobuf request`, `chunk #3`, `tool result`, or `200 OK` when useful.

For streaming:
- show the connection as persistent;
- spawn repeated chunks as finite events/bursts;
- preserve bidirectional directionality.

For request/response:
- make the return direction explicit;
- never replace request/response semantics with perpetual one-way motion.

For filtering/selection:
- visibly reject/fade candidates and carry selected items forward.

For fan-out:
- show independent transitions together when they are allowed to occur concurrently;
- do not imply strict ordering unless the source material requires it.

## AI-native visual language

Aim for **calm futuristic + intelligent + spatial + responsive**, not generic neon.

Prefer:
- dark-mode friendly layered surfaces;
- subtle depth/grid only when it aids spatial reading;
- one semantic active accent;
- compact system-status language;
- generous whitespace and strong hierarchy;
- role-aware shapes and surfaces;
- restrained luminous focus on active computation.

Avoid:
- rainbow gradients;
- constant pulsing everywhere;
- cyberpunk decoration;
- glassmorphism as a default;
- card-inside-card dashboard chrome;
- motion that exists only to look technical.

The target is **observing a real system run**, not looking at a sci-fi poster.

## Article-level visual density

Use **one visual = one learning question**.

Do not add a visual if it only repeats nearby prose or another visual. If both topology and runtime behavior matter, use two focused visuals with different teaching jobs rather than one overloaded diagram.

`api-communication-fundamentals.mdx` is the reference acceptance case for the shared Flow Explainer because it exercises:
- REST sequential request/response;
- gRPC unary remote-boundary semantics;
- gRPC streaming repeated/bidirectional messages with persistent connection state;
- GraphQL fan-out/fan-in and composed response.

A FlowExplainer change should be reviewed against these four behaviors before being treated as a reusable improvement for RAG, Agent, Tool Calling, or Context Manager docs.

## Chart animation

Use a chart when numeric change is the lesson. Prefer a shared chart abstraction.

Animation should reveal values progressively or respond to changed inputs. Preserve axes, units, tooltips, accessible labels, and deterministic data. Never invent measured values.

Distinguish:
- **static metric comparison** → normal chart;
- **metric progression over time/scenario** → animated chart;
- **input changes cause multiple outputs to change** → interactive causal explainer/simulation.

## Accessibility

- Respect `prefers-reduced-motion`.
- All controls must be keyboard reachable with visible focus.
- Meaning must never depend on color or motion alone.
- Use `aria-live="polite"` for current-event narration where appropriate.
- Keep touch targets usable on mobile.

## Responsive behavior

The first frame must fit a normal Docusaurus article column. On narrow screens:
- preserve readable labels;
- place narrative directly below the stage when a side rail no longer fits;
- keep event order obvious;
- prefer a vertical/stacked narrative over shrinking text;
- avoid page-level horizontal overflow.

### Preserve topology semantics during mobile reflow

Responsive reflow may change **geometry**, but it must not change the **meaning of the graph**.

- Never turn a real desktop fan-out/fan-in into a sequential mobile pipeline merely because a single vertical column is easy to fit. `GraphQL Server → Database / REST Service / gRPC Service` must still read as three sibling dependencies, not `Database → REST Service → gRPC Service`.
- A simple linear scenario may use a single vertical event spine. A scenario with authored `row`/`column` structure, sibling branches, parallel transitions, or fan-out/fan-in requires topology-aware mobile composition.
- For a narrow fan-out, prefer **hub + stacked branches**: keep the hub on the main spine, stack branch cards vertically for width, and offset/route each branch independently back to the hub. Visual stacking must not imply branch-to-branch edges.
- Preserve authored edges and transition endpoints across breakpoints. Responsive layout must not infer new sequential relationships from node array order.
- Edge labels/messages need their own branch lanes. Do not place several fan-out labels on one shared vertical trunk where they can collide with sibling cards or make edge ownership ambiguous.
- Compute mobile canvas bounds from the final responsive node positions, including node height and breathing room. Do not estimate height from `nodes.length * gap` when branch offsets or multiple mobile lanes are present.
- Run `fitView` only after the final responsive geometry is mounted/settled. `fitView` is framing, not a substitute for a valid mobile topology.

`api-communication-fundamentals.mdx` GraphQL is the regression case: on mobile, `Database`, `REST Service`, and `gRPC Service` may be vertically stacked for readability, but all three must remain visually connected to `GraphQL Server` as sibling fan-out branches.

## Migration rule

When editing an old learning note, inspect static or continuously animated diagrams for behavioral content. If the behavior can be represented truthfully by the shared Flow Explainer, migrate it in the same change.

High-priority migration targets include API communication, Context Manager/Context Engineering, RAG pipelines, agent loops, tool calls, streaming, retry/lifecycle examples, and evaluation pipelines with changing metrics.

Do not rewrite a clear static architecture solely to add motion.

## Validation

Before accepting a Visual Explainer:
- confirm every event maps to a real concept in surrounding prose;
- verify direction and current state are obvious within 3–5 seconds;
- verify ordinary messages do not animate indefinitely;
- verify event playback and motion are synchronized;
- verify parallel transitions do not falsely become sequential;
- verify persistent state survives the intended events;
- verify every message label is visually attached to its connector and does not collide with endpoint nodes, arrowheads, or other labels;
- verify long node/message text remains bounded to the geometry used for routing, with full meaning recoverable from narrative/accessible text;
- verify replay/reset and scenario switching are deterministic;
- verify mobile has no page overflow or unreadably small labels;
- verify mobile reflow preserves topology semantics: sibling branches remain siblings, fan-out/fan-in does not become a false sequential chain, and branch labels retain clear edge ownership;
- verify mobile canvas bounds are derived from final responsive positions and the final geometry is fit only after responsive layout settles;
- verify light/dark themes preserve contrast;
- verify reduced motion retains all meaning;
- verify controls are keyboard reachable;
- run `npm run typecheck`, `npm run build`, and `git diff --check` when execution access is available;
- never claim rendered visual QA passed unless the actual page was inspected.

## Upstream attribution

Adapted from `nicobailon/visual-explainer`, version `0.8.1`, licensed under MIT. See the colocated `LICENSE`.
