---
name: docs-ui
description: Implement or review the canonical Docusaurus interface for this repository. Use for site-wide theme work, article shells, navigation/sidebar behavior, typography, learning-component styling, responsive layout, light/dark modes, accessibility, or any UI change under src/theme, src/css, src/components/Learning, or docs presentation markup.
---

# Docs UI System

Treat `DESIGN.md` as the canonical visual specification. Read it completely before editing UI, then inspect the rendered page and the shared implementation being changed.

## Workflow

1. Identify whether the change belongs to global tokens, the shared docs shell, a reusable learning/diagram component, or article content.
2. Prefer shared tokens and components. Do not create article-scoped CSS unless the article has a genuinely unique teaching surface.
3. Preserve the canonical navigation hierarchy: all sidebar categories visible, independently scrollable, and visually differentiated by domain, group, and article.
4. Preserve the palette contract: neutral high-contrast light mode; deep navy dark mode; cyan/teal as the single primary accent. Do not reintroduce purple, rainbow neon, heavy glow, or decorative glass stacks.
5. Keep prose readable before making it futuristic: bounded line length, clear H1/H2/H3 hierarchy, restrained cards, calm inactive states, and no light text on pale surfaces.
6. Route educational visual changes through `docs-diagram` and the selected renderer skill. UI styling must not change diagram semantics.
7. Recompose at mobile breakpoints; do not merely shrink desktop UI. Keep touch targets, menu scrolling, and visible focus states.

## Acceptance

- Inspect at least one representative article, one visual-heavy article, one category page, and the homepage.
- Test light and dark themes plus desktop and mobile widths.
- Verify sidebar categories have no collapse controls and remain usable when long.
- Check text/background contrast, inline code, links, active navigation, TOC, cards, code blocks, and diagram surfaces.
- Run `npm run docs:check`, `npm run typecheck`, `npm run build`, and `git diff --check`.
- Never claim visual QA without inspecting actual renders.
