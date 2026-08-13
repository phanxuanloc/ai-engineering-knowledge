---
name: learning-checkpoint
description: Close and capture a learning checkpoint in this repository. Use when the learner says “chốt kiến thức”, asks to checkpoint or save the current learning, or intends to turn the current learning session into canonical notes and synchronized progress evidence.
---

# Learning Checkpoint

Treat a checkpoint as closing the current learned slice, not as automatic completion of its broad topic.

## Inspect before editing

1. Read `AGENTS.md`, `README.md`, `docs/_templates/learning-note.mdx`, and `learning-progress.yaml`.
2. Identify the active topic and current checkpoint from the conversation and progress index. If the topic cannot be determined safely, inspect likely recent notes and ask only when ambiguity would change what is recorded.
3. Search `docs/` for the topic, synonyms, and related concepts. Read the full canonical note and likely overlaps.
4. Inventory only evidence demonstrated in the learning session: explanations, decisions, self-test answers, experiments, or applications. Do not infer mastery from polished documentation.

## Capture the checkpoint

1. Update or extend the canonical note when the concepts share its mental model or practical purpose. Create a new note only for a genuinely distinct standalone concept, following the repository template.
2. Write reusable knowledge in Vietnamese-first prose while retaining standard English technical terminology. Keep personal status, confidence, next steps, and evidence out of public docs.
3. Preserve uncertainty and uncovered gaps. Do not add generic knowledge merely to make the note look complete.
4. Synchronize `learning-progress.yaml` in the same change:
   - add the checkpoint ID to `checkpoints`;
   - record its `status`, canonical `note`, date, and concrete evidence under `checkpoint_progress`;
   - change topic `confidence` or `status` only when the supplied evidence supports the repository scale;
   - set `next_checkpoint` to the next small subtopic when the learning path supports one;
   - keep note paths, relationships, prerequisites, and experiments accurate.
5. Keep the broad topic in progress when only the current checkpoint is closed. Treat a topic as complete only when its defined learning path has no remaining checkpoint, the relevant completion criteria are satisfied, and evidence supports the corresponding repository status. Never use a non-schema status such as `learned`; use the statuses allowed by `AGENTS.md`.

## Validate and deliver

1. Re-read changed notes for duplicated concepts, contradictions, required heading order, public leakage of personal learning state, and broken or missing reciprocal links.
2. Run the relevant focused checks, `git diff --check`, and `npm run build`. Run additional type, diagram, or artifact checks only when the changed files require them.
3. Summarize what knowledge was captured, what evidence/progress changed, and the next learning checkpoint.
4. If the current request or established workflow authorizes repository writes, commit the coherent checkpoint update and push it to `main` after validation. Verify the branch and cleanly incorporate current user changes; never discard unrelated work. If commit or push is not authorized or fails, leave the prepared changes intact and report the exact state without claiming publication.
