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

Categories do not collapse. The sidebar scrolls independently on desktop and inside the mobile drawer. A long menu is acceptable when hierarchy remains obvious.

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
