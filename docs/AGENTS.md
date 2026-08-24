# Docs Authoring Policy — Reader-First Public Knowledge

These instructions apply to everything under `docs/` and override any broader repository rule that restricts public documentation to knowledge the learner has already demonstrated.

## Separate public knowledge from private learning state

Treat these as two independent systems:

- **Public knowledge (`docs/`)** answers: what should a reader know, and how should this topic be explained so a Software Engineer can understand and apply it?
- **Private learning progress (`learning-progress.yaml`)** answers: what has the learner actually demonstrated, understood, applied, or mastered?

A public article may be complete even when the learner has not started learning that topic. The existence, quality, or completeness of an article is never learning evidence.

Never expose personal learning status, confidence, checkpoints, remaining gaps, evidence, review dates, or next learning steps in public docs.

## AI may generate complete articles before learning

When the user asks to create a new topic/article, prepare docs for sharing, or expand a knowledge area, AI may create or substantially expand the canonical public article before the learner studies it.

For a new topic:

1. inspect the repository, category, canonical notes, nearby concepts, and duplicate risk;
2. research or use reliable technical knowledge as needed;
3. define the canonical scope and teaching job;
4. create a complete reader-facing article rather than a checkpoint summary;
5. add the explanation depth, examples, distinctions, trade-offs, practical scenarios, and visuals required for genuine understanding;
6. connect related knowledge when it improves navigation and comprehension;
7. validate the documentation normally.

Do not create or update `learning-progress.yaml` merely because an article was generated, expanded, reorganized, or made public-ready.

## Topic selection: advise once, then respect the user's choice

Public knowledge generation is not blocked by the learner's private learning sequence.

When the user asks to add or share a specific topic:

1. inspect the current public knowledge structure and nearby canonical articles first;
2. if the requested topic would create a meaningful sequencing problem, duplicate an existing teaching job, sit at the wrong hierarchy level, or skip a public prerequisite that would make the resulting knowledge map confusing, explain the issue briefly and recommend **one** more appropriate topic or placement before editing;
3. treat that recommendation as advice, not a gate;
4. if the user accepts the recommendation, follow it;
5. if the user rejects it or explicitly repeats the original request, **stop blocking on sequencing and generate the requested public knowledge** in the best canonical form possible;
6. never require a private learning checkpoint to be completed before a public article can be created.

Do not repeatedly challenge the same explicit topic choice. After one clear recommendation, the user's confirmed sharing intent wins unless the request is technically impossible, unsafe, or would corrupt the repository.

## Sharing coverage and duplicate detection

Use the **current repository**, not `learning-progress.yaml`, as the source of truth for what knowledge is already shared publicly.

Before deciding whether a topic is missing, duplicated, or a sensible next public topic, inspect:

1. `sidebars.ts` for the reader-visible knowledge hierarchy and currently published canonical articles;
2. the relevant Level 1 / Level 2 landing page for the category's intended scope and neighboring topics;
3. the actual relevant Level 3 knowledge articles for their teaching jobs and content coverage;
4. repository search for the proposed concept and close synonyms, because a concept may already be covered inside an article with a different title;
5. `docs/AGENTS.md` and relevant docs architecture skills when deciding ownership, splitting, merging, or placement.

`sidebars.ts` is the primary navigation inventory, but it is **not sufficient by itself for semantic duplicate detection**. An article title may differ while its teaching job overlaps another article. Always inspect nearby article content before creating a new canonical page.

Use `learning-progress.yaml` only to answer private questions such as what the learner has demonstrated, what remains to learn, or which learning checkpoint is next. Do not use it as the inventory of public sharing coverage.

When asked **"đã share gì?"**, **"còn thiếu gì để share?"**, **"share gì tiếp?"**, or equivalent, reason from the public docs inventory and knowledge architecture first. Learning progress may be reported separately when relevant, but must not silently constrain the sharing recommendation.

## Reader-first quality bar

Optimize articles for a **cold reader** who did not participate in the learning conversation.

A technically correct article is not sufficient if it assumes missing reasoning steps. The article should provide enough teaching depth for a new reader to understand:

1. the problem or motivation behind the concept;
2. the mental model or intuition;
3. the important core concepts;
4. how the parts relate or operate;
5. at least one concrete example or scenario when useful;
6. important distinctions that are easy to confuse;
7. trade-offs and engineering decisions when relevant;
8. practical application in Software Engineering, Coding Agents, AI Agents, RAG, or production systems when relevant;
9. common failure modes or mistakes.

These do not need to become separate headings when a more natural teaching structure is clearer.

## Canonical knowledge article contract

Public knowledge docs are **teaching artifacts, not learning summaries**. A strong article should take a cold reader through the reasoning path, not merely list correct definitions.

Use this as the default content contract for substantial Level 3 knowledge articles:

1. **Why it matters / problem pressure** — establish the real engineering problem and consequence before introducing a pattern or abstraction.
2. **Mental model** — give one memorable intuition that organizes the topic.
3. **Core concepts and distinctions** — define the important terms and explicitly separate concepts that readers commonly confuse.
4. **Concrete scenario** — prefer one realistic scenario that can evolve through the article instead of unrelated toy examples.
5. **Progressive problem evolution** — when appropriate, show `simple state → requirement changes → naive solution → pain appears` so the reader can see why the problem exists.
6. **Root-cause reasoning** — explain which responsibility, dependency, state, contract, or system property actually creates the problem.
7. **Better design / mechanism** — introduce the improved design only after the reader can see the problem it solves.
8. **Why it works** — connect the solution back to change impact, runtime behavior, data flow, failure isolation, correctness, or the relevant engineering consequence. Do not stop at cleaner-looking code.
9. **Trade-offs and decision guide** — explain costs, when the technique is justified, when a simpler design is acceptable, and which questions should drive the decision.
10. **Common mistakes / failure modes** — cover cargo-cult usage, over-engineering, misleading heuristics, and important edge cases.
11. **Practical takeaway** — end with reusable engineering heuristics or review questions that help the reader apply the concept.
12. **Related knowledge** — link only to canonical concepts that materially extend or clarify the article.

This is a **content contract, not a mandatory heading template**. Merge, rename, reorder, or omit headings when the topic teaches more naturally another way, but do not omit an important reasoning layer merely to make the article shorter.

### Navigation contract and topic ownership

For substantial Level 3 knowledge articles, prefer a stable reader-facing H2 navigation contract when those sections are relevant:

`TL;DR → Why It Matters → Mental Model → Core Concepts → Example → When to Use → Common Mistakes → Decision Guide → Practical Takeaway → Self-test → Related Knowledge`

This is a **navigation contract, not a content-fill template**:

- keep these canonical H2 names and order when the article contains the corresponding material, so readers can predict where to find motivation, application guidance, mistakes, and review questions;
- topic-specific deep dives such as `Leaky Abstraction`, `Blast Radius`, `Cache Stampede`, or `Dependency Direction` may appear as additional sections where the teaching flow needs them;
- scenario-specific stages such as `Starting Point`, `Requirement Changes`, `Root Cause`, `Better Design`, and `Why It Works` should usually be H3 subsections inside `Example` rather than universal top-level sections;
- do not invent empty or weak sections merely to satisfy the navigation contract;
- visuals are evidence-driven: add a diagram, flow, table, or code block only when it materially improves understanding, not to satisfy a per-section quota.

Before writing adjacent articles, define **one central question / teaching job per article**. Related articles may reuse the same domain scenario, but they must not repeat the same reasoning journey.

Example distinction:

- `Coupling & Cohesion` owns diagnosis: **where does change propagate, and why is the blast radius too large?**
- `Abstraction & Encapsulation` owns boundary design: **what should the caller know, and which HOW details must stay behind the boundary?**

When two articles overlap, keep enough shared context for each article to remain understandable in isolation, then link to the canonical owner instead of re-teaching the full neighboring concept. Reuse a scenario to build continuity, not to duplicate explanation.

### Teaching progression rules

Prefer this reasoning arc when it fits the topic:

`Problem → Mental Model → Concrete Evolution → Root Cause → Better Design → Why It Works → Trade-offs → Application`

Follow these rules:

- **Show why before showing the pattern.** Do not introduce `Factory`, `Repository`, `Strategy`, Dependency Injection, an interface, an agent architecture, or another abstraction as a best practice before establishing the problem it solves.
- **Prefer progressive examples.** When one scenario can carry the article, evolve it through requirement changes instead of switching examples for every concept.
- **Do not label the initial simple design as wrong without pressure.** A direct dependency or concrete implementation can be appropriate before meaningful variability or complexity exists.
- **Explain the delta.** When showing before/after code or architecture, state exactly what changed in dependencies, responsibilities, behavior, blast radius, failure handling, or operational characteristics.
- **Teach trade-offs, not dogma.** More interfaces, layers, patterns, services, agents, caches, or abstractions are not automatically better.
- **Prefer engineering judgment over memorization.** The reader should finish knowing what signals to inspect and what decision to make, not only how to repeat a definition.

A compact `TL;DR` may remain at the top, but its compression must not become the depth of the whole article. Self-tests are optional; do not use learner-progress-style quizzes as a substitute for a strong reader-facing conclusion.

### MDX block safety

When authoring or rewriting `.mdx`, do not compact nested block tags onto one physical line when Docusaurus/MDX parsing depends on block boundaries.

In particular, always write collapsible answers as separate block tags with blank lines around Markdown content:

```mdx
<details>
<summary>Answers</summary>

Markdown content here.

</details>
```

Treat **every same-line variant** as unsafe, not only the exact literal `<details><summary>Answers</summary>`. These are also forbidden:

```mdx
<details> <summary>Answers</summary>
<details>    <summary>Answers</summary>
<summary>Answers</summary> Markdown content
Markdown content </details>
```

The invariant is based on **physical line boundaries**, not the amount of whitespace between tags. `<details>`, `<summary>...</summary>`, Markdown body content, and `</details>` must remain block-safe and must never be compressed by an editor, formatter, or AI rewrite.

Before committing any docs change that creates, rewrites, or touches disclosure blocks:

1. run `npm run docs:format-mdx` to normalize known unsafe compact forms;
2. inspect the resulting diff and commit any normalization that belongs to the change;
3. run `npm run docs:check`;
4. run the required production build for the touched area.

`npm run build` also runs the normalizer before docs validation as a CI safety net. That safety net exists to prevent deployment from failing on a whitespace-only MDX regression; it is **not** permission to leave malformed source in the repository. Source files should be committed in canonical block-safe form.

When touching files that contain `<details>` blocks, preserve or normalize this safe form before committing. A build or docs rewrite is not complete until this invariant has been checked.

## Do not over-compress at capture time

Do not turn a rich learning/discussion session into a public article containing only the learner's demonstrated bullet points.

Learning evidence defines what may be recorded as progress. It does **not** cap the explanatory depth of public documentation.

Prefer the minimum explanation required for genuine understanding, not the minimum text required to record facts.

When a concept would otherwise jump too quickly from definition to conclusion, add the missing reasoning bridge, for example:

`Problem → Intuition → Mental Model → Concrete Example → Technical Explanation → Engineering Consequence`.

Do not copy the learning transcript into docs. Synthesize the best reusable explanation that emerged from discussion.

## Docs-first learning workflow

A normal workflow may be:

`Topic selected → AI generates public docs → learner reads → discuss/question/challenge → docs improve → learner applies/reasons → private evidence is recorded`.

During discussion, treat reader confusion as documentation feedback. If a clarification, better example, corrected distinction, or improved diagram would help future readers, update the canonical public article rather than leaving the improvement only in chat.

## Knowledge articles are not progress records

Use the term **knowledge article** for reader-facing files under `docs/`. Existing filenames/templates may retain historical names until changed deliberately, but authoring decisions must follow the public-knowledge model.

Do not infer any of the following:

- article exists → learner understands it;
- article is comprehensive → learner has learned it;
- category coverage is complete → learner completed the category;
- AI generated an example → learner demonstrated that reasoning.

Documentation coverage and learning progress are independent axes.

## Related knowledge may include not-yet-learned topics

A public article must remain self-contained enough for its reader. It may explain and link to other canonical public knowledge even if the learner has not personally studied those targets yet.

Do not create links merely to fill a graph. Link when the target materially improves understanding. Avoid placeholders and broken links.

## Preserve private evidence discipline

AI-generated content, reading, understanding, and application are different states:

`AI generated ≠ learner read ≠ learner understood ≠ learner applied`.

Only `learning-progress.yaml` records personal learning state, and only real evidence may change it. Valid evidence may include demonstrated explanation, correct reasoning, distinctions, corrected misunderstanding, scenario decisions, experiments, or practical application.

## Checkpoint behavior

When the learner says `chốt kiến thức`:

1. inspect the canonical article and the session;
2. identify whether the discussion revealed a reusable correction or teaching improvement;
3. update public docs when that improves the reader-facing article, even if the added explanation is broader than the exact words the learner demonstrated;
4. separately inventory only real learner evidence;
5. update `learning-progress.yaml` only from that evidence;
6. never reduce or constrain the article to match the learner's current evidence;
7. if the article is already public-ready, the checkpoint may update only private progress.

## Existing documentation rules still apply

Continue following the repository's existing rules for canonical-note selection, duplicate prevention, MDX structure, Docusaurus behavior, diagrams, visual routing, accessibility, language, links, validation, and design.

Where a parent rule says public docs may only contain learned knowledge, only learned topics may be linked, or docs creation must automatically create progress entries, this file supersedes that restriction for work under `docs/`.