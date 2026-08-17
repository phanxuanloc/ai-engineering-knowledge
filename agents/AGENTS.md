# Multi-agent execution layer

This directory contains the repository's multi-agent execution subsystem. Repository-wide learning, documentation, evidence, language, and validation policy remains owned by root `AGENTS.md`; this file only adds operating rules for work routed through `agents/`.

The seven role agents are:

- Orchestrator
- Researcher
- Tutor
- Builder
- Reviewer
- Publisher / Knowledge Curator
- AI Solution Architect / Consultant

## Instruction hierarchy

Treat the instruction layers as:

`root AGENTS.md → agents/AGENTS.md → role AGENT.md → relevant skills → tools`

Before acting in one of these roles, read repository `AGENTS.md`, `agents/README.md`, `agents/_shared/OPERATING-MODEL.md`, and the role's `AGENT.md`.

A role contract may specialize how that role works, but it must not weaken or redefine repository-wide learning/evidence rules. If instructions appear to conflict, preserve the higher-level repository policy and surface the conflict rather than silently overriding it.

## Agent / Skill / Tool

Keep **Agent / Skill / Tool** separate:

- Agent = role with decision responsibility.
- Skill = reusable capability under `.agents/skills/`.
- Tool = execution mechanism such as GitHub, web research, build/test, or code execution.

Do not create a new agent when an existing role can own the responsibility by using another skill.

## Routing

Use the minimum sufficient route. Do not run all agents for every request.

- learning/explanation/progress → Tutor
- implementation/experiment/code → Builder
- correctness/quality/evidence assessment → Reviewer
- current external landscape → Researcher
- docs/content/public repurposing → Publisher
- company/use-case/architecture/ROI → Consultant
- mixed or multi-step goals → Orchestrator

Before finalizing a route, run the repository's visual-routing gate: inspect the request and likely touched files for diagrams, flows, workflows, pipelines, architecture/topology, sequence/lifecycle, data movement, state transitions, animations, charts, and existing visual artifacts. If any are present:

- route teaching intent, semantic content, and canonical docs integration to Publisher / Knowledge Curator;
- route shared component, renderer, or interactive implementation to Builder;
- require the owning role to start with `docs-diagram`, then load only the renderer skill selected by that classification (`docs-excalidraw`, `docs-react-flow`, `visual-explainer`, or the established charting path);
- route final semantic and actual-render validation to Reviewer, independently of the creator;
- use Orchestrator when the work crosses those responsibilities.

These are existing role responsibilities. Do not invent an Excalidraw, React Flow, or animation role; assign the correct existing role and attach the required skill.

For every new or substantially expanded learning note, the owning route must record a visual-coverage decision. When a visual materially shortens the path to understanding the main mental model, structure, runtime behavior, or quantitative relationship, the route is incomplete until the correctly classified visual is created and independently reviewed. A prose-only exception needs a concrete 3–5 second teaching-test justification; convenience and “the text is already short” are insufficient.

For a learning request such as `Học tiếp Evaluation`, Orchestrator should normally route to Tutor first. Builder participates only when practical evidence is needed; Reviewer participates when evidence/artifacts need independent validation; Researcher, Publisher, and Consultant stay out unless the objective actually requires them.

## Shared state and gates

`learning-progress.yaml` remains the canonical non-public source of truth for learning state and evidence. `state/agent-system.yaml` coordinates work only and must not duplicate or invent learning evidence.

The creator of an artifact cannot be its final reviewer.

Public publishing, destructive actions, ambiguous learning promotion, and consequential final consulting recommendations remain human-gated unless the user explicitly authorizes the action.
