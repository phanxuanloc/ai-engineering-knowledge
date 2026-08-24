# AI Engineering Knowledge — Design System

This site is a calm, future-facing AI Engineering knowledge environment. It should feel technical and alive without becoming a gaming dashboard. Learning clarity always wins over decoration.

## Canonical interface

- **Light mode:** near-white neutral background, white surfaces, dark slate text, cyan/teal accents, crisp borders, restrained shadows.
- **Dark mode:** deep navy background, slightly lighter navy surfaces, cool gray text, cyan/teal accents, minimal glow only for active state.
- **Never use:** purple as a primary accent, rainbow neon, low-contrast pale text, ambient particles, heavy glass stacks, constant animation, or decorative cards around ordinary prose.
- The logo, links, focus state, active navigation, diagram emphasis, and controls share the cyan/teal family.

Canonical tokens live in `src/css/custom.css`. Reuse semantic variables such as `--learning-active`, `--learning-border`, `--learning-surface`, and `--diagram-surface`; do not scatter one-off colors.

## Navigation

The docs sidebar is an always-open knowledge map:

1. domain headings are uppercase, compact, and accented;
2. knowledge groups are stronger mixed-case labels with a vertical marker;
3. article links are quieter and optimized for scanning;
4. the current article gets the only strong sidebar emphasis.

Use progressive disclosure for hierarchy depth: domain-level categories stay expanded so all level-2 knowledge groups remain visible, while level-3 article lists are collapsed by default. Readers expose level-3 articles by expanding the relevant knowledge group; the active descendant path should remain visible while reading inside that group. The sidebar scrolls independently on desktop and inside the mobile drawer.

## Landing-page hierarchy

- **Level 1 — Domain Landing Page:** H1 + short domain positioning + `Learning Areas` + shared linked cards to Level-2 topics. Keep it short and navigational; never use a long bullet directory as the primary interface.
- **Level 2 — Topic Landing Page / Learning Map:** H1 + short scope + `Topic Overview` + shared linked cards to Level-3 lessons + optional recommended order. Add a diagram only when lifecycle, dependency, sequence, layering or concept relationship is materially clearer visually.
- **Level 3 — Learning Content:** detailed knowledge, examples, distinctions, mistakes, self-tests and experiments.
- Level 1 and Level 2 always use explicit MDX landing pages controlled by the repository. Docusaurus `generated-index` is not part of the canonical hierarchy.
- Landing navigation uses `LandingCardGrid` and `LandingCard`; page-specific card systems are not created unless the shared abstraction cannot represent a genuine teaching need.
- Landing pages orient and route. They do not duplicate the full teaching content of their child lessons.

### Level-2 Topic Overview contract

`Topic Overview` is the visual orientation surface for a Level-2 topic. It must let a cold reader understand the topic's major parts and relationship within roughly five seconds.

- Do not publish a raw prose mental map such as `A → B → C` or a sentence whose only visual structure is bold text and arrow characters when a real relationship exists.
- For a compact sequence, dependency chain, set of conceptual layers, or diagnostic progression, use the shared `KnowledgeMap` surface so hierarchy, connectors, stage indices and responsive behavior are consistent across topics.
- Use React Flow, FlowExplainer, Excalidraw, or another routed visual instead when the topic has branching topology, runtime behavior, lifecycle state, or a conceptual relationship that `KnowledgeMap` would oversimplify.
- Keep overview labels concise. Detailed explanation belongs in Level 3; the Level-2 visual should orient, not teach every mechanism.
- A specialized existing overview visual may remain if it already satisfies the semantic and readability bar. Consistency means a shared visual language, not forcing every topic into the same geometry.
- On mobile, recompose the map vertically before shrinking text. The overview must remain readable without zooming or horizontal panning.

## Article hierarchy

- H1 establishes the topic with generous whitespace and compact supporting metadata.
- H2 starts a major learning section with a cyan-to-blue marker and divider.
- H3 introduces a local concept without competing with H2.
- Prose is approximately `68ch` wide with comfortable line height.
- Inline code uses a low-contrast tinted surface, never a bright white fragment inside dark prose.
- The desktop TOC shows major sections only; nested H3 entries stay out of the default scan path.
- Use `TLDR`, `KeyInsight`, `Remember`, `ImportantDistinction`, `Comparison`, `ExperimentCard`, `TopicPath`, and `SelfTest` only for their semantic roles. Ordinary prose stays prose.

## Visual routing

Run `.agents/skills/docs-visual-density/SKILL.md`, then `.agents/skills/docs-diagram/SKILL.md` for educational visuals.

- Mental model or conceptual boundary → Excalidraw.
- Static topology or structured flow → React Flow.
- Runtime behavior over time → FlowExplainer.
- Quantitative relationship → chart or focused interactive visualization.
- Genuine comparison → Comparison or semantic table.
- Two to four short lines already explain it → normal MDX.

Animation must encode state, causality, transport, or reveal. Inactive content remains calm. Shared components own geometry, theme, responsive behavior, and controls; MDX owns semantic data.

## Responsive and accessibility

- Recompose before shrinking.
- Keep text at normal reading size and touch targets at least 44px where interactive.
- Preserve visible focus, meaningful alt text, keyboard access, and reduced-motion behavior.
- Light and dark modes must both retain readable text, borders, controls, inline code, and diagram labels.
- Validate representative pages at desktop and narrow mobile widths.

## Change workflow

Use `.agents/skills/docs-ui/SKILL.md` for site UI work. Prefer global tokens and shared abstractions; article-scoped styling requires a unique teaching reason. Finish with rendered light/dark and desktop/mobile inspection plus `npm run docs:check`, `npm run typecheck`, `npm run build`, and `git diff --check`.
