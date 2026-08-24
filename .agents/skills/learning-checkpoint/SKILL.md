---
name: learning-checkpoint
description: Close and capture a learning checkpoint while keeping public sharing coverage independent from private learning state.
---

# Learning Checkpoint

Treat a checkpoint as closing the learner's current evidence slice, not as creating the public article from scratch and not as automatic completion of its broad topic.

## Inspect before editing

1. Read `AGENTS.md`, `docs/AGENTS.md`, `knowledge-progress.yaml`, and the relevant canonical article.
2. Identify the active broad topic and current checkpoint from the conversation and registry.
3. Inventory only evidence actually demonstrated in the session: explanations, decisions, corrected misunderstandings, scenarios, experiments, or applications.
4. Separately identify reusable documentation improvements discovered during learning.

## Improve public knowledge when useful

If discussion exposed a reusable clarification, example, distinction, trade-off, or visual improvement, update the canonical public article for a cold reader. Do not constrain article depth to the learner's current evidence and do not put personal progress into docs.

## Update private learning state

Update only `learning.status` and `next_checkpoint` in `knowledge-progress.yaml` when actual learner evidence supports the change.

Valid statuses are:

- `not_started`
- `learning`
- `understood`

Never advance learning state merely because an article exists, was generated, was read, or became public-ready.

Keep the distinction explicit:

`AI generated ≠ learner read ≠ learner understood ≠ learner applied`.

A broad topic becomes `understood` only when its important checkpoints have sufficient demonstrated evidence; closing one checkpoint is not enough by itself.

## Sharing synchronization

If the checkpoint discussion also creates, removes, renames, or changes canonical public articles, synchronize the topic's `sharing.landing` / `sharing.articles` in `knowledge-progress.yaml` in the same coherent change.

## Validate and deliver

Re-read changed docs for duplication and personal-state leakage, validate registry paths, run `npm run docs:check` and the production build when docs/registry changes require it, then report public changes and private learning-state changes separately.
