---
name: visual-explainer
description: Design and implement event-driven animated learning surfaces for runtime behavior. Use when learners should observe requests, messages, tokens, retries, streams, fan-out/fan-in, state transitions, or changing metrics over time.
license: MIT
metadata:
  upstream: nicobailon/visual-explainer
  upstream-version: "0.8.1"
---

# Visual Explainer

`FlowExplainer` is the repository's shared runtime-story renderer. It is **not** a static diagram with decorative motion. Use it when the learning question is “what happens over time?”; use `docs-react-flow` when the question is only “what connects to what?”. Always run `.agents/skills/docs-diagram/SKILL.md` first.

## Core contract

Author semantic scenarios and events. Article MDX owns facts; shared components own geometry, animation, theme, controls, responsive behavior, and visual state.

A scenario contains:

- stable `id` and `label`;
- semantic `nodes` and real `edges`;
- finite ordered `steps`;
- optional `layout`: `auto`, `compact`, or `trace`;
- optional `presentation`: `overview`, `progressive`, or `focused`.

A step may contain:

- `from` / `to` or `transitions`;
- `message`;
- `repeat` for finite bursts/stream chunks;
- `active` for current computation;
- `persistent` for state that remains alive;
- `visible` for semantically required scene context;
- `durationMs` only when the event needs extra inspection time;
- optional runtime `inspection` state.

Do not create article-specific animation engines.

## Presentation modes

### `overview`

Show the whole topology when the learner must see the complete structure at once. Inactive structure stays quiet; active motion highlights the current event.

### `progressive`

Reveal only entities that have become relevant through the current event. Previously reached entities become **completed context**; future nodes/edges stay absent. Refit the viewport to the **current scene**, not the maximum possible graph.

Use progressive by default when:

- the lesson is a journey/request lifecycle;
- full topology would force small labels or aggressive `fitView`;
- the learner should discover the system step by step;
- mobile would otherwise become a tall/shrunken full graph.

`layout="compact"` is treated as a progressive teaching trace by default unless the scenario explicitly requests another presentation.

### `focused`

Keep the full system visible for orientation but strongly subordinate inactive regions. Use when global context matters on every event.

**Do not default to show-everything-first.** The first frame should contain the minimum structure required for the first inference unless overview itself is the lesson.

## Runtime visual states

FlowExplainer should visually distinguish these semantics:

1. **future / not revealed** — absent in progressive mode;
2. **completed** — visible but quiet; shows where the trace has already been;
3. **persistent** — still alive/waiting/available across later events;
4. **active** — currently computing or sending;
5. **arrival** — destination receives the current event and gets one short reaction.

Precedence is `arrival/active > persistent > completed > idle`.

Do not use color alone. Border/surface/opacity/state marker should reinforce meaning.

## Motion semantics

Useful motion encodes causality:

- active connector draws/activates once;
- packet/message/token travels once and fades;
- destination gets a short arrival reaction;
- completed path remains as quiet trace history;
- fan-out transitions animate together when concurrency is real;
- streaming uses finite repeated chunks while the stream/channel remains persistent;
- request/response return direction must be explicit;
- filtering visibly rejects/fades candidates and carries selected items forward.

Avoid:

- perpetual packets for ordinary request/response;
- pulsing every node;
- ambient scanlines or cyberpunk motion;
- glow that does not encode a runtime state;
- animation timers that drift independently from event playback.

Playback must remain deterministic: previous, next, play/pause, replay, and direct event selection.

## Layout rules

### Compact traces

Compact flow is a teaching composition, not a generic editor canvas.

- On desktop, prefer a balanced short path over a long 2-column snake. A three-column serpentine/U-path is acceptable for a linear journey because progression remains visually continuous while using article width efficiently.
- Do not force independent branches into that sequence.
- On mobile, a truly linear trace may become one vertical spine.
- Progressive scenes should frame only revealed nodes so normal reading-size text can be preserved.

### Readability floor and fitView

`fitView` is a framing tool, not permission to shrink the teaching surface until text becomes tiny.

- Preserve a **minimum readable zoom** for ordinary runtime traces. For simple 2–3 node desktop flows, target roughly `0.85–0.9` or higher; a value around `0.88` is a reasonable shared default.
- More complex topologies may use a lower floor when necessary, but complexity should explicitly justify it. A fan-out graph can tolerate more zoom-out than a three-node request/response trace.
- Mobile should also retain a readability floor; do not solve a tall trace by shrinking the entire canvas indefinitely.
- If connector clearance increases graph width enough that `fitView` would cross the readability floor, **recompose or modestly reduce spacing before shrinking the graph further**.
- Prefer this order: **semantic recompose/progressive reveal → balanced spacing → bounded graph label → readability-preserving fitView**.
- Never increase global spacing in isolation without checking resulting viewport scale. Connector clarity and node readability are one layout problem, not separate CSS problems.
- Inspect the rendered node text size after any rank/column spacing change. CSS font-size being unchanged does not prove readability if the React Flow viewport is scaled down.

### Horizontal connector clearance

A horizontal connector with a message pill must reserve a real lane between adjacent nodes. Do not size desktop columns from node count or visual compactness alone.

- Compute horizontal spacing as **node width + connector clearance**. Connector clearance must include the message pill, visible line before the label, visible line after the label, arrowhead, and packet travel.
- The pill must not visually consume the full connector. A reader should still see an unmistakable line segment entering the label and another line segment continuing toward the destination.
- Prefer a balanced connector lane over an oversized global gap. Roughly `190–220px` of lane after subtracting node width is usually enough for common short/medium runtime labels when the label itself is bounded.
- Increase spacing before shrinking text, but stop increasing spacing when it would force `fitView` below the readability floor.
- Keep the label near the connector midpoint. Do not push it against a node just to make the overall diagram narrower.
- For long messages, use this fallback order: **balanced spacing → bound/truncate graph label → preserve full message in narrative/accessibility text**.
- Evaluate actual representative messages, not only empty edges. Regression labels include `GetPaymentRequest`, `protobuf request`, `conversation message`, `persisted message`, and `requested JSON shape` when applicable.

### Mobile connector clearance

A vertical mobile trace must reserve a real connector lane between adjacent nodes. Do not size mobile rows from node count alone.

- Compute row spacing as **node height + connector clearance**, where connector clearance includes room for the edge label, visible line before and after the label, arrowhead, and packet travel.
- The message pill may sit on the connector, but it must not visually consume the entire connector. A reader should still see a clear line segment on both sides of the label and understand direction at a glance.
- Increase mobile row/branch spacing before shrinking text, reducing pill padding, moving the label off the connector, or hiding the label.
- Keep the label near the connector midpoint unless topology requires otherwise; do not push it against either endpoint merely to make the canvas shorter.
- For longer messages, use this fallback order: **increase spacing → bound/truncate graph label → preserve full message in the event narrative/accessibility text**.
- Mobile spacing must be evaluated against actual node height and representative message labels, not only against an empty edge.
- For simple vertical traces, target enough clearance that common short labels such as `DNS query`, `TCP :443`, `GET /users`, and `200 OK` leave visibly meaningful connector segments above and below the pill.

### Topology-aware flows

For fan-out/fan-in, retries, loops, or explicit row/column structure:

- preserve real sibling/branch semantics;
- never turn sibling branches into a false mobile chain;
- use hub + stacked branches on narrow screens when needed;
- preserve authored edges and endpoints across breakpoints;
- refit only after responsive positions settle.

## Node and label rules

FlowExplainer nodes use bounded geometry so motion/routing stays stable.

- Keep title/detail inside the allocated node.
- Use normal readable text; detail may wrap to a small bounded number of lines.
- Never let DOM content silently grow beyond routing geometry.
- Keep edge message centered on its connector and mask the line behind the label.
- Increase spacing before shrinking text or detaching labels from edges, but respect the viewport readability floor.
- Long graph messages may truncate because full meaning must remain in the event narrative and accessible title.
- No message may cover a node, arrowhead, another connector, or another label.
- Connector-label clearance is part of layout geometry on both desktop and mobile, not a CSS afterthought.

## Visual language

Target: **calm future-facing system trace**, not a sci-fi dashboard.

Prefer:

- one semantic accent;
- restrained surfaces and borders;
- little or no background decoration;
- minimal shadows;
- active edge + packet as the strongest visual signal;
- completed path as quiet history;
- generous whitespace and clear hierarchy.

Avoid default grid overlays, scanlines, glass-card stacks, heavy glow, rainbow gradients, and nested dashboard chrome. Decoration must never compete with “where is the request now?”.

## Accessibility and reduced motion

- Respect `prefers-reduced-motion`.
- When travel animation is disabled, preserve active edge/node, completed state, persistent state, and narrative meaning.
- All controls remain keyboard reachable with visible focus.
- Use `aria-live="polite"` for current-event narration.
- Keep touch targets usable on mobile.

## Acceptance checks

Before accepting a change, verify:

1. Within 3–5 seconds, the current event and direction are obvious.
2. Progressive mode does not reveal unnecessary future complexity.
3. Completed, persistent, active, and arrival states are visually distinct without relying only on color.
4. Ordinary packets are finite, not ambient loops.
5. Event playback and animation remain synchronized and deterministic.
6. Request/response direction is truthful; no false transport path is invented.
7. Fan-out/fan-in remains semantically correct on desktop and mobile.
8. Labels stay attached to their connector and do not collide.
9. Horizontal labeled connectors retain visible line before and after the pill; message text must not consume the whole lane.
10. Simple desktop flows do not fall below the readability floor merely because spacing increased.
11. Normal article width keeps node text comfortably readable without aggressive shrinking.
12. Mobile recomposes before shrinking and has no page-level overflow.
13. On a mobile vertical trace, each labeled connector still exposes visible line before and after the pill; the label must not consume the whole lane.
14. Test representative horizontal messages such as `GetPaymentRequest`, `conversation message`, and `persisted message` when applicable.
15. Test representative mobile messages including `DNS query`, `203.0.113.20`, `TCP :443`, `GET /users`, and `200 OK` when applicable.
16. After any spacing change, inspect effective viewport scale as well as CSS font size.
17. Light/dark themes retain contrast.
18. Reduced-motion mode retains all semantic states.
19. No decorative grid/scanline/glow obscures information hierarchy.
20. Run `npm run typecheck`, `npm run build`, and `git diff --check` when execution access exists.
21. Never claim rendered visual QA passed unless the actual rendered page was inspected.

## Regression cases

Review shared FlowExplainer changes against at least:

- Networking web request journey — progressive request lifecycle and mobile connector-label clearance;
- Chat System Design — compact horizontal trace with `conversation message` / `persisted message` labels;
- REST request/response — simple three-node readability floor;
- gRPC unary remote boundary with `GetPaymentRequest` / `GetPaymentResponse` labels;
- gRPC streaming finite repeated messages + persistent stream;
- GraphQL fan-out/fan-in preserving sibling topology without forcing the same zoom floor as a simple trace.

A shared improvement must not make one runtime story prettier by making another semantically wrong.

## Upstream attribution

Adapted from `nicobailon/visual-explainer`, version `0.8.1`, licensed under MIT. See the colocated `LICENSE`.
