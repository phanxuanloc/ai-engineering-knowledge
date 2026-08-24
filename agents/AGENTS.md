# Multi-agent execution rules

This file defines routing for work under `agents/`. Repository-wide policy belongs to root `AGENTS.md`; public documentation policy belongs to `docs/AGENTS.md`.

## Instruction order

`root AGENTS.md → agents/AGENTS.md → role AGENT.md → relevant SKILL.md → tools`

## Roles

- `orchestrator` — coordinate mixed or multi-step work.
- `researcher` — current external research and source evaluation.
- `tutor` — learning flow, registry inspection, challenge, and evidence identification.
- `builder` — implementation, experiments, code, and reusable artifacts.
- `reviewer` — independent correctness, quality, and evidence review.
- `publisher` — reader-facing documentation and shareable knowledge integration.
- `consultant` — architecture, use-case, business fit, and solution recommendations.

Use the minimum sufficient route; do not run every role by default.

## Shared state

- `knowledge-progress.yaml` owns public sharing coverage plus the learner's private learning status.
- `sharing` and `learning.status` are independent; publishing never implies learning.
- `state/agent-system.yaml` may coordinate execution state only and must not duplicate knowledge registry state.
- Public docs must not contain personal learning state.

The creator of an artifact should not be the sole final reviewer when independent review is required.

## Human authority

Never fabricate user approval, learner evidence, publishing authorization, destructive-action authorization, or successful repository operations. When the user authorizes a repository write, perform the coherent change and report only confirmed results.
