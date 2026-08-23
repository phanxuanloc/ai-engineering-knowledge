# Shared Agent Operating Model

This file contains only execution concepts shared by multiple roles. Policy and routing live elsewhere:

- repository invariants → root `AGENTS.md`
- role routing → `agents/AGENTS.md`
- public docs behavior → `docs/AGENTS.md`
- specialized execution → relevant `.agents/skills/*/SKILL.md`

Do not duplicate those rules here.

## Mission

Support fast, practical AI Engineering learning and high-quality public knowledge while keeping personal learning evidence separate from generated documentation.

## State ownership

Use existing state instead of inventing parallel state:

- `learning-progress.yaml` — personal learning progress and evidence.
- `docs/` — reader-facing public knowledge; article coverage is independent from learning progress.
- source code / experiments — implementation and engineering evidence.
- `decisions/` — durable architecture or strategy decisions when such records are useful.
- `state/agent-system.yaml` — optional execution coordination only; never duplicate learning evidence here.

## Work lifecycle

Use a work item only when coordination actually helps:

`proposed → active → review → approved | blocked → closed`

Do not create process state for trivial single-role work.

A coordinated item should contain only the information needed to execute and verify it: objective, owner, expected outcome, constraints, validation method, reviewer when required, and human gate when required.

## Evidence

Never infer learner understanding, experiment success, quality improvement, ROI, or production readiness without observable evidence appropriate to that claim.

Examples include learner reasoning, working code, tests/build output, experiment results, benchmark results, review findings, production observations, or source-backed research.

## Independence

When independent review is required, the creator cannot be the only final evaluator. Self-checks are useful but do not replace the Reviewer gate.

## Human gates

Require explicit user authority for destructive or irreversible actions, material scope changes, or other actions whose consequences exceed the authorization already given in the current workflow.

Never fabricate approval.

## Stop condition

Stop expanding the workflow when the requested outcome is achieved, extra process adds little value, required real-world evidence is missing, or a genuine human decision is needed.
