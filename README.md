# AI Engineering Knowledge

A personal, practical knowledge base for learning AI engineering. It captures concise mental models, working examples, experiments, mistakes, and self-tests instead of collecting disconnected links.

> **Knowledge learned: 1** — The repository contains knowledge captured from real learning sessions, alongside its infrastructure, category structure, and reusable template.

The site is built with [Docusaurus](https://docusaurus.io/) and TypeScript and is published to GitHub Pages at `https://phanxuanloc.github.io/ai-engineering-knowledge/`.

## Local development

```bash
npm install
npm start
```

Create a production build with:

```bash
npm run build
```

## Repository structure

```text
.
├── .github/workflows/deploy.yml  # GitHub Pages build and deployment
├── AGENTS.md                     # Repository-wide AI agent rules
├── learning-progress.yaml        # Machine-readable learning state
├── docs/                         # All knowledge notes
│   ├── _templates/               # Reusable MDX authoring templates
│   ├── ai-fundamentals/          # Empty until a real learning session
│   ├── ai-coding/                # AI-assisted software development knowledge
│   ├── coding-agents/            # Empty until a real learning session
│   ├── ai-agents/                # Empty until a real learning session
│   ├── rag/                      # Empty until a real learning session
│   └── experiments/              # Empty until a real experiment
├── src/                          # Docusaurus UI and styling
├── static/                       # Static site assets
├── docusaurus.config.ts          # Site and GitHub Pages configuration
└── sidebars.ts                   # Knowledge navigation
```

## How notes are organized

Each note belongs to one topic directory under `docs/`. Start new notes by copying `docs/_templates/learning-note.mdx`; the template separates the takeaway, mental model, concepts, examples, practical guidance, personal understanding, experiments, related ideas, and a self-test.

Use a short, descriptive kebab-case `.mdx` filename and complete the front matter at the top. Category landing pages are named `index.mdx`, and each `_category_.json` controls its sidebar label and order. Write standard Markdown first; use genuine Excalidraw scenes and their optimized exports for conceptual explanations, and the shared read-only React Flow component for structured technical flows. New Mermaid diagrams are not used. The complete visualization policy lives in `AGENTS.md`.

The concise UI authoring and diagram decision rules live in [DESIGN.md](DESIGN.md).

## How AI agents maintain the knowledge base

Repository-wide instructions and the learning workflow live in [AGENTS.md](AGENTS.md), outside the public documentation. Before creating a note, an AI agent must search the existing documentation by topic and synonyms, read likely related notes, and decide whether the new information belongs in a canonical existing article. Updating is preferred when the concept already exists; a new page is appropriate only when it has a distinct mental model or practical purpose.

Agents must not pre-populate topics with generic generated explanations. A knowledge article is created or expanded only from learning, discussion, research, or experiments actually performed by the learner.

Agents use the standard learning-note template, keep each concept in one primary location, and maintain useful relative links between related notes. When files move or concepts are consolidated, agents repair inbound links and add reciprocal links where they improve navigation.

`My Understanding` and `My Experiment` are personal learning records. Agents preserve their existing text and experiment history unless explicitly asked to change them. They may append clearly labeled questions or proposals, but should never replace the owner's perspective with generated prose merely for consistency.

Every knowledge change ends with a duplication review, link check, structure check, and successful `npm run build`.

## Learning progress index

Canonical learning notes under `/docs` contain knowledge actually learned. Structural files under `/docs` do not count as evidence by their presence alone. [learning-progress.yaml](learning-progress.yaml) is the source of truth for the learner's current state for each real topic, including status, confidence, review dates, experiments, prerequisites, and relationships.

Missing topics are intentionally absent from the index—not queued or pre-populated. Agents update the index in the same change whenever a real learning note is created or meaningfully updated, and advance status or confidence only when the learner's understanding, experiments, self-tests, reviews, or application provide evidence.

## Deployment

Every push to `main` runs the GitHub Actions workflow. It installs locked dependencies with `npm ci`, builds Docusaurus, uploads the `build/` artifact, and deploys it to GitHub Pages.
