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
- Increase spacing before shrinking text or detaching labels from edges.
- Long graph messages may truncate because full meaning must remain in the event narrative and accessible title.
- No message may cover a node, arrowhead, another connector, or another label.

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
9. Normal article width keeps node text comfortably readable without aggressive shrinking.
10. Mobile recomposes before shrinking and has no page-level overflow.
11. Light/dark themes retain contrast.
12. Reduced-motion mode retains all semantic states.
13. No decorative grid/scanline/glow obscures information hierarchy.
14. Run `npm run typecheck`, `npm run build`, and `git diff --check` when execution access exists.
15. Never claim rendered visual QA passed unless the actual rendered page was inspected.

## Regression cases

Review shared FlowExplainer changes against at least:

- Networking web request journey — progressive request lifecycle;
- REST request/response;
- gRPC unary remote boundary;
- gRPC streaming finite repeated messages + persistent stream;
- GraphQL fan-out/fan-in preserving sibling topology.

A shared improvement must not make one runtime story prettier by making another semantically wrong.

## Upstream attribution

Adapted from `nicobailon/visual-explainer`, version `0.8.1`, licensed under MIT. See the colocated `LICENSE`.
