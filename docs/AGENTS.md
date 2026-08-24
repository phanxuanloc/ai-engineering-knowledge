# Docs Authoring Policy — Reader-First Public Knowledge

These instructions apply to everything under `docs/`.

## Public knowledge and private learning are separate

Treat these as two independent systems:

- public knowledge under `docs/` answers what a reader should know and how to understand/apply it;
- `knowledge-progress.yaml` records the fast sharing inventory plus the learner's private learning status.

A public article may be complete before the learner studies it. Article existence, quality, reading, or publication is never learning evidence.

Never expose private learning status, remaining gaps, checkpoint state, or next learning steps in public docs.

## Registry-first sharing workflow

Use `knowledge-progress.yaml` first when answering:

- what is already shared;
- what public topic is missing;
- what might be sensible to share next;
- whether a broad topic already has canonical public articles.

Do not reconstruct the sharing inventory from `sidebars.ts` on every request. `sidebars.ts` remains the navigation implementation, not the progress database.

The registry is not sufficient for semantic duplicate detection. Before creating or substantially expanding an article:

1. read the topic entry in `knowledge-progress.yaml`;
2. inspect the relevant Level 1 / Level 2 landing page and nearby Level 3 articles;
3. search the proposed concept and close synonyms across docs;
4. define one central teaching job for the article;
5. prefer improving an existing canonical article when it already owns that teaching job;
6. synchronize the registry when public coverage changes.

## Topic selection: advise once, then follow the user

When the user asks to add/share a specific topic, first inspect the registry and relevant docs. If the requested topic would materially duplicate another teaching job, sit at the wrong hierarchy level, or create a confusing public sequence, explain the issue briefly and recommend one better topic or placement.

That recommendation is advice, not a gate. If the user rejects it or repeats the original request, generate the requested public knowledge in the best canonical form possible. Never require a private learning checkpoint before creating public docs.

## Reader-first quality bar

Optimize for a cold reader who did not participate in the learning conversation. A strong substantial Level 3 article should normally cover:

1. why the problem matters;
2. a memorable mental model;
3. core concepts and important distinctions;
4. one concrete scenario when useful;
5. progressive problem evolution when the topic benefits from it;
6. root-cause reasoning;
7. the better design/mechanism only after the problem is visible;
8. why the solution works in engineering terms;
9. trade-offs and decision guidance;
10. common mistakes/failure modes;
11. practical takeaways;
12. related canonical knowledge.

This is a content contract, not a rigid heading-fill template.

## Navigation contract for substantial Level 3 articles

Prefer this reader-facing H2 order when the sections are relevant:

`TL;DR → Why It Matters → Mental Model → Core Concepts → Example → When to Use → Common Mistakes → Decision Guide → Practical Takeaway → Self-test → Related Knowledge`

Topic-specific deep dives may be inserted where the teaching flow requires them. Scenario stages such as `Starting Point`, `Requirement Changes`, `Root Cause`, `Better Design`, and `Why It Works` should usually be H3 subsections inside `Example`.

Do not create empty or weak sections just to satisfy the contract.

## Teaching progression

Prefer:

`Problem → Mental Model → Concrete Evolution → Root Cause → Better Design → Why It Works → Trade-offs → Application`

Rules:

- show why before introducing a pattern;
- prefer one progressive scenario over unrelated toy examples;
- do not call the simple starting design wrong before real pressure exists;
- explain exactly what changed in dependency direction, responsibility, blast radius, behavior, failure handling, or operational properties;
- teach trade-offs instead of dogma;
- optimize for engineering judgment, not memorization.

## Topic ownership and duplicate prevention

Adjacent articles may reuse the same domain scenario, but they must not repeat the same reasoning journey. Keep one primary home for each definition, distinction, decision rule, or detailed mechanism, then summarize/link from neighboring articles.

Example ownership:

- `Coupling & Cohesion`: where change propagates and why blast radius is large;
- `Abstraction & Encapsulation`: what the caller should know and which implementation details stay behind a boundary.

## Visual routing

Add a visual only when it materially improves understanding. Use the canonical visual routing from root `AGENTS.md` and the relevant project-local skill:

- conceptual relationship / intuition → Excalidraw;
- structured pipeline / topology / architecture → React Flow;
- progressive animated explanation → Visual Explainer.

Do not depict the same lesson with multiple redundant renderers.

## MDX block safety

For `<details>` blocks, keep physical line boundaries safe:

```mdx
<details>
<summary>Answers</summary>

Markdown content here.

</details>
```

Never compact `<details>`, `<summary>`, Markdown body content, or `</details>` onto the same physical line.

Before committing docs changes that touch disclosure blocks:

1. run `npm run docs:format-mdx`;
2. inspect the normalization diff;
3. run `npm run docs:check`;
4. run the required production build.

## Docs-first learning workflow

A normal workflow is:

`Topic selected → AI generates public docs → learner reads → discuss/challenge → docs improve → learner applies/reasons → private learning state may advance`

Treat learner confusion as documentation feedback when the clarification would help future readers.

Publishing docs changes `sharing` in `knowledge-progress.yaml`; it never changes `learning.status` by itself.

## Checkpoint behavior

When the learner says `chốt kiến thức`:

1. inspect the canonical article and the session;
2. improve the public article if discussion exposed a reusable teaching improvement;
3. separately determine whether actual learner evidence supports a private learning-state change;
4. update only `learning.status` / `next_checkpoint` when justified;
5. synchronize `sharing` only if public coverage changed.

Keep the distinction explicit:

`AI generated ≠ learner read ≠ learner understood ≠ learner applied`.
