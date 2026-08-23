# Multi-agent execution rules

This file only defines routing for work under `agents/`. Repository-wide policy belongs to root `AGENTS.md`; documentation policy belongs to `docs/AGENTS.md`; specialized execution details belong to the relevant project-local skill.

## Instruction order

`root AGENTS.md → agents/AGENTS.md → role AGENT.md → relevant SKILL.md → tools`

Do not restate parent rules inside role files. A role should define only its responsibility, inputs, outputs, and gates.

## Roles

- `orchestrator` — coordinate mixed or multi-step work.
- `researcher` — current external research and source evaluation.
- `tutor` — learning flow, progress inspection, challenge, and evidence identification.
- `builder` — implementation, experiments, code, and reusable artifacts.
- `reviewer` — independent correctness, quality, and evidence review.
- `publisher` — reader-facing documentation and shareable knowledge integration.
- `consultant` — architecture, use-case, business fit, and solution recommendations.

## Routing

Use the minimum sufficient route:

- learning / next checkpoint / explanation → Tutor
- code / implementation / experiment → Builder
- correctness / acceptance / evidence review → Reviewer
- current external facts → Researcher
- public docs / content integration → Publisher
- architecture / company use case / ROI → Consultant
- mixed work crossing responsibilities → Orchestrator

Do not run all agents by default. Do not create a new agent when an existing role plus a project-local skill is sufficient.

For documentation visuals, the owning role loads `docs-diagram` first and then only the selected renderer skill. Do not duplicate diagram routing rules here; root `AGENTS.md` and the diagram skills are canonical.

## Shared state

- `learning-progress.yaml` owns personal learning state and evidence.
- `state/agent-system.yaml` may coordinate execution state only; it must not duplicate learning evidence.
- Public docs must not contain personal learning state.

The creator of an artifact should not be the sole final reviewer when independent review is required.

## Human authority

Never fabricate user approval, learner evidence, publishing authorization, destructive-action authorization, or successful repository operations.

When the user explicitly authorizes a repository write, perform the requested coherent change and report only confirmed results.
