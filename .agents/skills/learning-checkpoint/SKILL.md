---
name: learning-checkpoint
description: Close and capture a learning checkpoint in this repository. Use when the learner says “chốt kiến thức”, asks to checkpoint or save the current learning, or intends to synchronize private learning evidence after reading, discussing, or applying canonical public knowledge.
---

# Learning Checkpoint

Treat a checkpoint as closing the learner's current evidence slice, not as creating the public article from scratch and not as automatic completion of its broad topic.

Public documentation and learning progress are independent. A canonical article may already be complete before the learner studies it.

## Inspect before editing

1. Read `AGENTS.md`, `docs/AGENTS.md`, `README.md`, the relevant documentation template, and `learning-progress.yaml`.
2. Identify the active topic and current checkpoint from the conversation and progress index. If the topic cannot be determined safely, inspect likely recent notes and ask only when ambiguity would change what is recorded.
3. Search `docs/` for the topic, synonyms, and related concepts. Read the full canonical article and likely overlaps.
4. Inventory only evidence demonstrated in the learning session: explanations, decisions, self-test answers, corrected misunderstandings, experiments, or applications. Do not infer mastery from polished documentation or from AI-generated content.
5. Separately inventory documentation feedback discovered during learning: confusing explanations, missing reasoning bridges, weak examples, incorrect distinctions, missing practical context, or visual problems that would affect future readers.

## Improve public knowledge when useful

1. Treat public docs as reader-facing knowledge, not as a transcript or progress record.
2. If the discussion exposed a reusable teaching improvement, update the canonical article for a cold reader. Add enough explanation, examples, distinctions, trade-offs, practical context, or visuals to make the concept genuinely understandable.
3. Do not constrain public article depth to only the facts the learner demonstrated. Learning evidence controls progress state; it does not cap documentation quality.
4. Do not add personal status, confidence, next steps, checkpoint evidence, or remaining personal gaps to public docs.
5. If the canonical article is already clear and complete, a checkpoint does not require any public-doc change.
6. Follow `docs/AGENTS.md` plus all existing repository rules for canonical placement, duplicate prevention, MDX structure, diagrams, language, links, UI, and validation.

## Capture private learning evidence

Synchronize `learning-progress.yaml` only from actual learner evidence:

- add the checkpoint ID to `checkpoints` when the checkpoint has real evidence;
- record its `status`, canonical `note`, date, and concrete evidence under `checkpoint_progress`;
- change topic `confidence` or `status` only when demonstrated evidence supports the repository scale;
- set `next_checkpoint` to the next small subtopic when the learning path supports one;
- keep note paths, relationships, prerequisites, and experiments accurate.

Never create progress evidence merely because:

- an article exists;
- AI generated or expanded an article;
- the learner opened or read an article;
- the article is technically complete or public-ready.

Keep the distinction explicit:

`AI generated ≠ learner read ≠ learner understood ≠ learner applied`.

## Topic completion

Keep the broad topic in progress when only the current checkpoint is closed. Treat a topic as complete only when its learning path and completion criteria are satisfied and real evidence supports the corresponding repository status.

Never use a non-schema status such as `learned`; use the statuses allowed by `AGENTS.md`.

Documentation coverage and learning completion are independent. A complete public category does not imply a completed learning topic.

## Validate and deliver

1. Re-read changed public articles for duplicated concepts, contradictions, missing reasoning bridges, required structure, personal learning-state leakage, and broken or missing useful links.
2. Re-read `learning-progress.yaml` changes and verify every status/confidence/evidence change is supported by demonstrated learning rather than article content.
3. Run the relevant focused checks, `git diff --check`, `npm run docs:check` when documentation/progress is touched, and `npm run build`. Run additional type, diagram, or artifact checks when the changed files require them.
4. Summarize separately: public knowledge improvements, private evidence/progress changes, and the next learning checkpoint.
5. If the current request or established workflow authorizes repository writes, commit the coherent checkpoint update and push it to `main` after validation. Verify the branch and cleanly incorporate current user changes; never discard unrelated work. If commit or push is not authorized or fails, leave the prepared changes intact and report the exact state without claiming publication.
