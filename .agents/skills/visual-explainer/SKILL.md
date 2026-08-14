---
name: visual-explainer
description: Design and implement step-driven animated learning surfaces for technical runtime behavior, interactive experiments, and quantitative change. Use when a concept is learned better by observing states, messages, tokens, chunks, requests, retries, streams, or metrics change over time than by reading a static diagram.
license: MIT
metadata:
  upstream: nicobailon/visual-explainer
  upstream-version: "0.8.1"
---

# Visual Explainer

This repository-local skill turns runtime behavior into inspectable learning stories. It adapts `nicobailon/visual-explainer` principles to site-native React/MDX and extends them with a canonical **Flow Explainer** pattern.

## First-class use cases

Use this skill for:

- request → processing → response;
- REST, gRPC unary, gRPC streaming, GraphQL resolver/data-source behavior;
- Agent → Tool → Observation → next action loops;
- RAG: source → chunk → embed → retrieve → select → context → LLM;
- Context Manager: candidates → score/signals → select → budget → Context Window;
- token/chunk/message movement;
- retry, timeout, backoff, queue, event, acknowledgement, and state-machine behavior;
- interactive experiments where changing an input reveals causality;
- animated charts where progression or changing metrics are the lesson.

Do not use this skill merely to decorate a static architecture. If the lesson is only topology, use `docs-react-flow`.

## Canonical runtime story model

Author the learning story as semantic scenarios and steps, not CSS animation instructions. A scenario should contain:

- stable scenario ID and label;
- ordered entities/nodes with semantic roles;
- a finite ordered list of steps;
- for each step: active node(s), active connection/message, packet/token label when useful, and a one-sentence explanation;
- deterministic initial/reset state.

The article should say **what happens**; the shared component decides **how it moves**.

Prefer an API shaped like:

```tsx
<FlowExplainer
  title="REST request lifecycle"
  scenarios={[
    {
      id: 'rest',
      label: 'REST',
      nodes: [...],
      steps: [
        {title: 'Request', from: 'client', to: 'server', message: 'GET /users', description: 'Client sends an HTTP request.'},
        {title: 'Query', from: 'server', to: 'db', message: 'SELECT ...', description: 'Server reads required data.'},
        {title: 'Response', from: 'server', to: 'client', message: '200 OK', description: 'Server returns the response.'},
      ],
    },
  ]}
/>
```

Extend the shared component when a repeated behavior needs richer semantics. Do not create article-specific animation engines.

## Motion semantics

Motion must answer a learning question. Prefer:

- subtle node pulse for the component currently doing work;
- bright active connection while inactive structure recedes;
- packet/token/chunk traveling only on the active transition;
- short glow/trail around the active message or compute state;
- state transitions that preserve spatial continuity;
- visible message labels such as `GET /users`, `protobuf request`, `chunk #3`, `tool result`, or `200 OK` when the payload type is part of the lesson.

For streaming, show repeated packets/chunks and make the direction and multiplicity obvious. For request/response, make the return direction visible instead of using a perpetual one-way animation. For filtering/selection, visibly reject/fade candidates and carry only selected items forward.

## Controls

For finite stories, provide `Play`, `Pause`, `Step`, and `Replay` unless a simpler interaction is clearly better. Also provide:

- current step `n / total`;
- scenario tabs when comparing closely related behaviors;
- deterministic reset when switching scenarios;
- optional speed only when it materially helps observation.

Autoplay is not required. Prefer learner control over ambient distraction.

## AI-technical visual language

Aim for a restrained “AI system in motion” feel:

- dark-mode friendly surfaces;
- one primary active accent plus role-specific accents only when useful;
- restrained glow/trail on active packets/tokens;
- soft pulse on active processing nodes;
- inactive elements fade slightly rather than disappear;
- compact status pills and step indicators;
- crisp spacing and readable technical labels.

Avoid making the page a generic neon dashboard. No rainbow glow, heavy glassmorphism, constant motion, or decorative particles. The active computation can feel alive; the reading surface stays calm.

## Chart animation

Use a chart when numeric change is the lesson. Prefer Recharts/ECharts/D3 only through a shared abstraction when possible. Good examples include token usage, latency, throughput, score distributions, context budget, retrieval quality, and evaluation metrics.

Animation should reveal values progressively or respond to changed inputs. Preserve axes, units, tooltips, accessible labels, and deterministic data. Never invent measured values.

## Accessibility and reduced motion

- Respect `prefers-reduced-motion`: disable traveling/glowing motion and preserve the current state through static emphasis.
- All controls must be keyboard reachable with visible focus.
- Use text labels/captions so meaning never depends on color or motion alone.
- Use `aria-live="polite"` for current-step explanations when appropriate.
- Keep tap targets usable on mobile.

## Responsive behavior

The first frame must fit a normal Docusaurus article column. On narrow screens, preserve readable labels and sequence order. Prefer a compact stacked/wrapped sequence over shrinking text. Avoid horizontal page overflow; local horizontal scrolling is acceptable only when topology genuinely needs it.

## Migration rule for existing docs

When editing an old learning note, actively inspect static or continuously animated diagrams for behavioral content. Migrate when the diagram is trying to explain execution rather than topology.

High-priority migration targets include API communication, Context Manager/Context Engineering flows, RAG pipelines, agent loops, tool calls, streaming, retry/lifecycle examples, and evaluation pipelines with changing metrics.

Do not rewrite a clear static architecture solely to add motion. Keep the topology view and add or substitute a Flow Explainer for the runtime story.

## Validation

Before accepting a Visual Explainer:

- every step maps to a real concept in surrounding prose;
- current state and direction are obvious within 3–5 seconds;
- replay/reset are deterministic;
- scenario switch resets correctly;
- mobile has no page overflow or unreadably small labels;
- light/dark themes preserve contrast;
- reduced motion retains all meaning;
- controls are keyboard reachable;
- `npm run typecheck` and `npm run build` pass when execution access is available;
- the rendered visual is actually inspected before claiming visual QA.

## Upstream attribution

Adapted from `nicobailon/visual-explainer`, version 0.8.1, licensed under MIT. See the colocated `LICENSE`.
