# AI Engineering Knowledge — Canonical Agent Rules

This file contains only repository-wide invariants and routing rules. Do not duplicate detailed instructions here when a scoped `AGENTS.md` or project-local skill already owns them.

## Instruction hierarchy

Use the most specific applicable instruction source:

`root AGENTS.md → scoped AGENTS.md → role AGENT.md → relevant SKILL.md → tools`

When a lower-level file contains a newer specialization for its scope, follow it. If two files genuinely conflict, prefer the more specific scoped rule and fix the stale parent rule instead of reasoning around both forever.

### Canonical owners

- Public documentation authoring: `docs/AGENTS.md`
- Personal learning state: `learning-progress.yaml`
- Closing a learning checkpoint: `.agents/skills/learning-checkpoint/SKILL.md`
- Documentation UI/theme/layout: `.agents/skills/docs-ui/SKILL.md` + `DESIGN.md`
- Visual decision and diagram quality: `.agents/skills/docs-diagram/SKILL.md`
- Conceptual/whiteboard diagrams: `.agents/skills/docs-excalidraw/SKILL.md`
- Structured node/edge flows: `.agents/skills/docs-react-flow/SKILL.md`
- Animated step-by-step technical explanation: `.agents/skills/visual-explainer/SKILL.md`
- Documentation hierarchy / learning architecture work: `.agents/skills/docs-learning-architecture/SKILL.md`
- Visual density/readability review: `.agents/skills/docs-visual-density/SKILL.md`
- Multi-agent execution: `agents/AGENTS.md`

Do not copy the contents of these owners into another rule file. Reference the owner and load it only when the task needs it.

## Public docs and private learning are independent

The repository has two different systems:

- `docs/` is reader-facing public knowledge.
- `learning-progress.yaml` is private learning state and evidence.

AI may create complete, high-quality public knowledge articles before the learner studies them. Article existence or completeness is never learning evidence.

Never expose personal status, confidence, checkpoint state, remaining gaps, evidence, review dates, or next learning steps in public docs.

When working under `docs/`, `docs/AGENTS.md` is authoritative for authoring behavior, including the docs-first workflow and reader-first quality bar.

## Learning state

`learning-progress.yaml` is the source of truth for what the learner has actually demonstrated.

Only real learner evidence may change progress. Evidence can come from demonstrated explanation, correct reasoning, distinctions, corrected misunderstandings, scenario decisions, experiments, or practical application.

Keep this distinction explicit:

`AI generated ≠ learner read ≠ learner understood ≠ learner applied`.

Do not change progress merely because docs were created, expanded, reorganized, researched, or polished.

When the learner asks what to study next, inspect `learning-progress.yaml` and relevant current notes first. Recommend one concrete next checkpoint in the active broad topic unless a prerequisite detour is necessary.

When the learner says `chốt`, `chốt kiến thức`, or clearly asks to close the current checkpoint, use `.agents/skills/learning-checkpoint/SKILL.md`. Closing a checkpoint does not automatically complete its broad topic.

## Documentation work

Before creating or substantially editing public knowledge:

1. Read `docs/AGENTS.md`.
2. Inspect the relevant category, nearby canonical articles, and duplicate risk.
3. Prefer improving the canonical article over creating a duplicate.
4. Keep the article understandable for a cold reader who did not see the learning conversation.
5. Preserve public URLs, links, hierarchy, and unrelated content unless the task requires changing them.

Use Vietnamese-first explanation with standard English technical terms when those are the normal engineering vocabulary. Keep code, APIs, identifiers, paths, commands, and protocol names in their original language.

Do not put repository process, prompts, agent behavior, or personal learning metadata into public knowledge articles.

## Visual routing

Do not keep renderer-specific design rules in this file.

For documentation work, first decide whether the concept benefits materially from a visual. If yes, load `.agents/skills/docs-diagram/SKILL.md`, then load only the renderer skill selected by that classification.

Use the current mapping:

- mental model / conceptual relationship / whiteboard intuition → `docs-excalidraw`
- structured graph / pipeline / architecture / data flow → `docs-react-flow`
- step-by-step animated walkthrough where progressive reveal teaches behavior → `visual-explainer`

Use `docs-ui` for site shell, theme, navigation, responsive presentation, typography, or shared article presentation. Use `docs-visual-density` when the main task is density/readability cleanup.

Do not load every visual skill for every docs task.

## Agent execution

Agents are roles, skills are reusable capabilities, and tools are execution mechanisms.

Use the minimum sufficient route. Do not invoke every role automatically. Detailed role routing is owned by `agents/AGENTS.md` and each role's `AGENT.md`.

A specialist may use any relevant project-local skill without creating a new role. Do not create renderer-specific agents.

## Repository edits

Before editing, inspect the current file and relevant repository state. Do not assume chat history is newer than the repository.

Preserve unrelated user changes. Avoid broad rewrites when a focused edit is enough. Do not create duplicate source-of-truth files for the same policy.

For write operations requested or authorized by the user, make the coherent change on the intended branch. Never claim a commit, push, build, or deployment succeeded unless the corresponding action confirms it.

## Validation

Run only the checks relevant to the touched area, plus the repository's required checks for that area.

For docs or learning-progress changes, use the checks required by `docs/AGENTS.md` / `learning-checkpoint`, including `npm run docs:check` and the production build when applicable.

For diagram changes, use the validation required by the selected diagram skill and inspect the rendered result when that skill requires visual review.

For agent/rule/skill-only markdown changes that do not affect runtime or generated docs, verify references and consistency; a full Docusaurus build is not required solely because instruction markdown changed.

## Maintenance rule

When updating repository instructions in the future:

1. identify the single canonical owner for the behavior;
2. edit that owner instead of appending another competing rule elsewhere;
3. remove obsolete or contradictory wording from higher-level files;
4. prefer short routing references over copied rule blocks;
5. keep historical behavior in git history, not in active instructions.

The goal is one active rule per responsibility, not a chronology of every rule the project has ever used.
