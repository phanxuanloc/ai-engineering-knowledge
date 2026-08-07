# AI Engineering Knowledge

A personal, practical knowledge base for learning AI engineering. It captures concise mental models, working examples, experiments, mistakes, and self-tests instead of collecting disconnected links.

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
├── docs/                         # All knowledge notes
│   ├── _templates/               # Reusable authoring templates
│   ├── ai-fundamentals/
│   ├── ai-coding/
│   ├── coding-agents/
│   ├── ai-agents/
│   ├── rag/
│   └── experiments/
├── src/                          # Docusaurus UI and styling
├── static/                       # Static site assets
├── docusaurus.config.ts          # Site and GitHub Pages configuration
└── sidebars.ts                   # Knowledge navigation
```

## How notes are organized

Each note belongs to one topic directory under `docs/`. Start new notes by copying `docs/_templates/learning-note.md`; the template separates the takeaway, mental model, concepts, examples, practical guidance, personal understanding, experiments, related ideas, and a self-test.

Use a short, descriptive kebab-case filename and complete the front matter at the top. Category landing pages are named `index.md`, and each `_category_.json` controls its sidebar label and order.

## Deployment

Every push to `main` runs the GitHub Actions workflow. It installs locked dependencies with `npm ci`, builds Docusaurus, uploads the `build/` artifact, and deploys it to GitHub Pages.
