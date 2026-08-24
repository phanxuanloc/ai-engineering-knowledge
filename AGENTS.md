# AI Engineering Knowledge — Canonical Agent Rules

This file contains repository-wide invariants and routing rules. Use the most specific applicable instruction source:

`root AGENTS.md → scoped AGENTS.md → role AGENT.md → relevant SKILL.md → tools`

## Canonical owners

- Public documentation authoring: `docs/AGENTS.md`
- Sharing coverage + personal learning state: `knowledge-progress.yaml`
- Closing a learning checkpoint: `.agents/skills/learning-checkpoint/SKILL.md`
- Documentation UI/theme/layout: `.agents/skills/docs-ui/SKILL.md` + `DESIGN.md`
- Visual decision and diagram quality: `.agents/skills/docs-diagram/SKILL.md`
- Conceptual diagrams: `.agents/skills/docs-excalidraw/SKILL.md`
- Structured flows: `.agents/skills/docs-react-flow/SKILL.md`
- Animated technical explanation: `.agents/skills/visual-explainer/SKILL.md`
- Documentation hierarchy: `.agents/skills/docs-learning-architecture/SKILL.md`
- Visual density/readability: `.agents/skills/docs-visual-density/SKILL.md`
- Multi-agent execution: `agents/AGENTS.md`

`learning-progress.yaml` is deprecated and may exist only as a compatibility pointer. Never treat it as state.

## Knowledge registry

`knowledge-progress.yaml` is the fast source of truth for two independent axes:

- `sharing`: which broad topics and canonical articles are already published;
- `learning.status`: whether the learner has not started, is learning, or has demonstrated enough understanding for the broad topic.

Use the registry first for questions such as `đã share gì?`, `share gì tiếp?`, `đã học gì?`, and `học gì tiếp?`. Do not scan `sidebars.ts` merely to reconstruct coverage already recorded in the registry.

The registry is an index, not permission to skip semantic validation. Before creating a new article, inspect the relevant docs and search topic synonyms to detect overlap or a better canonical home. When navigation changes, synchronize the registry with the actual public docs in the same coherent change.

## Public docs and private learning are independent

AI may create a complete reader-facing article before the learner studies it. Publishing or polishing docs changes `sharing`, never `learning.status` by itself.

Only demonstrated learner evidence from explanation, reasoning, distinctions, corrected misunderstandings, scenarios, experiments, or application may advance `learning.status`.

Keep the distinction explicit:

`AI generated ≠ learner read ≠ learner understood ≠ learner applied`.

Never expose personal learning state in public docs.

## Topic selection

When the user requests a public topic, inspect the registry and relevant docs first. If the request would create meaningful duplication, poor sequencing, or incorrect hierarchy, recommend one better topic or placement once. The recommendation is advisory. If the user rejects it or repeats the original request, follow the user's requested topic in the best canonical form possible. Never require a private learning checkpoint before generating public knowledge.

## Learning state

When the learner asks what to study next, read `knowledge-progress.yaml` first and recommend one concrete next checkpoint. Use relevant notes only when detail is needed.

When the learner says `chốt` or `chốt kiến thức`, use `.agents/skills/learning-checkpoint/SKILL.md`. Closing one checkpoint does not automatically complete a broad topic.

## Documentation work

Before creating or substantially editing public knowledge:

1. read `docs/AGENTS.md`;
2. read the topic entry in `knowledge-progress.yaml`;
3. inspect nearby canonical articles and search for duplicate teaching jobs;
4. prefer improving the canonical article over creating a semantic duplicate;
5. keep the article understandable for a cold reader;
6. synchronize `sharing` in `knowledge-progress.yaml` when public coverage changes.

Use Vietnamese-first explanation with standard English technical terms. Keep code, APIs, identifiers, paths, commands, and protocol names in their original language.

## Repository edits and validation

Inspect current repository state before editing and preserve unrelated changes. Never claim a commit, push, build, or deployment succeeded unless the corresponding action confirms it.

For docs or registry changes, run the checks required by `docs/AGENTS.md` / `learning-checkpoint`, including `npm run docs:check` and the production build when applicable. For rule-only changes, verify references and consistency; a full build is not required solely because instruction markdown changed.

## Maintenance

Keep one canonical owner per responsibility. Edit that owner instead of appending competing rules elsewhere. Remove obsolete wording from active instructions and keep history in git history, not in current policy.
