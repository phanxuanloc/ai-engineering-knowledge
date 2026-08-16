# Multi-agent execution layer

This directory contains a seven-role execution team:

- Orchestrator
- Researcher
- Tutor
- Builder
- Reviewer
- Publisher / Knowledge Curator
- AI Solution Architect / Consultant

Before acting in one of these roles, read repository `AGENTS.md`, `agents/README.md`, `agents/_shared/OPERATING-MODEL.md`, and the role's `AGENT.md`.

Keep **Agent / Skill / Tool** separate:
- Agent = role with decision responsibility.
- Skill = reusable capability under `.agents/skills/`.
- Tool = execution mechanism such as GitHub, web research, build/test, or code execution.

Use the minimum sufficient route. Do not run all agents for every request.

`learning-progress.yaml` remains the canonical non-public source of truth for learning state and evidence. `state/agent-system.yaml` coordinates work only and must not duplicate or invent learning evidence.

The creator of an artifact cannot be its final reviewer. Public publishing, destructive actions, ambiguous learning promotion, and consequential final consulting recommendations remain human-gated unless the user explicitly authorizes the action.
