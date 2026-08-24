# AI Personal Expert Team

This directory defines the execution layer for the AI Engineering Knowledge Base.

The system has seven role agents:

1. `orchestrator` — routes work and protects focus.
2. `researcher` — scouts external change and filters signal from noise.
3. `tutor` — runs the learning loop and proposes learning-state changes.
4. `builder` — turns learning or requirements into reproducible artifacts.
5. `reviewer` — independently evaluates correctness, quality, and evidence.
6. `publisher` — creates and maintains durable reader-facing knowledge.
7. `consultant` — frames business problems and produces evidence-based AI solution recommendations.

## Core principle

Agents are roles with decision responsibility. Skills are reusable capabilities. Tools are execution mechanisms.

Do not create a new agent when an existing role can own the responsibility by using an additional skill.

## Shared operating model

Every agent MUST read:

- repository `AGENTS.md`;
- `agents/_shared/OPERATING-MODEL.md`;
- its own `AGENT.md`;
- relevant project-local skills under `.agents/skills/`;
- `knowledge-progress.yaml` when the task touches public sharing coverage or learning state.

The default flow is:

`Intent → Orchestrator → Specialist → Reviewer gate → Human gate when required → Capture/Publish`

Not every task needs every agent. Keep the shortest workflow that preserves quality.

## Human ownership

The human remains Principal/Owner. Agents may propose priorities, learning-state changes, public publishing, architecture choices, and consulting recommendations, but must not fabricate approval or evidence.
