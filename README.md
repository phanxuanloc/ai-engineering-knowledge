# AI Engineering Knowledge

A practical knowledge base for learning and sharing AI Engineering and Software Engineering foundations.

Public documentation and personal learning state are intentionally separate: a complete article may be published before it is personally learned.

The site is built with Docusaurus + TypeScript and published to GitHub Pages at `https://phanxuanloc.github.io/ai-engineering-knowledge/`.

## Local development

```bash
npm install
npm start
```

Production validation:

```bash
npm run docs:check
npm run build
```

## Repository structure

```text
.
├── AGENTS.md                     # Repository-wide AI agent rules
├── knowledge-progress.yaml       # Canonical sharing + learning registry
├── learning-progress.yaml        # Deprecated compatibility pointer only
├── docs/                         # Reader-facing public knowledge
├── agents/                       # Agent roles and routing
├── .agents/skills/               # Project-local reusable skills
├── scripts/                      # Documentation/diagram validation
├── src/                          # Docusaurus UI and styling
├── static/                       # Static assets
├── docusaurus.config.ts          # Site configuration
└── sidebars.ts                   # Navigation implementation
```

## Knowledge registry

`knowledge-progress.yaml` is the canonical fast index.

Each broad topic records two independent axes:

- `sharing` — the landing page and canonical articles currently published;
- `learning.status` — `not_started`, `learning`, or `understood` based on actual learner evidence.

Use the registry to answer what is already shared or learned without rebuilding state from `sidebars.ts`. The sidebar remains the navigation implementation and is checked when navigation itself changes.

Before creating a new article, agents still inspect relevant docs and search synonyms because a registry cannot by itself detect semantic overlap between differently named articles.

Publishing or expanding docs never advances `learning.status`. Learning state changes only after demonstrated explanation, reasoning, distinctions, scenarios, experiments, or application.

## Public documentation

`docs/AGENTS.md` owns reader-first authoring policy. Public docs are complete teaching artifacts for cold readers, not personal progress records. They must never expose private status or checkpoint metadata.

When public coverage changes, update `sharing` in `knowledge-progress.yaml` in the same coherent change.

## Learning workflow

The learning loop is `Map → Read → Challenge → Apply → Capture`.

When choosing what to learn next, read `knowledge-progress.yaml` first. When closing a checkpoint, use `.agents/skills/learning-checkpoint/SKILL.md` and advance learning state only when the learner actually demonstrated the required understanding.

## Deployment

Every push to `main` runs the GitHub Actions workflow, builds Docusaurus, and deploys the site when CI succeeds.
