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