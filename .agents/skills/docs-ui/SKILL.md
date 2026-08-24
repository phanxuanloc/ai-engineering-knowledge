---
name: docs-ui
description: Implement or review the canonical Docusaurus interface for this repository. Use for site-wide theme work, article shells, navigation/sidebar behavior, typography, learning-component styling, responsive layout, light/dark modes, accessibility, or any UI change under src/theme, src/css, src/components/Learning, or docs presentation markup.
---

# Docs UI System

Treat `DESIGN.md` as the canonical visual specification. Read it completely before editing UI, then inspect the rendered page and the shared implementation being changed.

## Workflow

1. Identify whether the change belongs to global tokens, the shared docs shell, a reusable learning/diagram component, or article content.
2. Prefer shared tokens and components. Do not create article-scoped CSS unless the article has a genuinely unique teaching surface.
3. Preserve the canonical navigation hierarchy: domain categories stay expanded, all level-2 knowledge groups remain visible, and level-3 article links use progressive disclosure (collapsed by default and expanded for the relevant group/active descendant). Keep the sidebar independently scrollable and visually differentiated by domain, group, and article.
4. Preserve the palette contract: neutral high-contrast light mode; deep navy dark mode; cyan/teal as the single primary accent. Do not reintroduce purple, rainbow neon, heavy glow, or decorative glass stacks.
5. Keep prose readable before making it futuristic: bounded line length, clear H1/H2/H3 hierarchy, restrained cards, calm inactive states, and no light text on pale surfaces.
6. Route educational visual changes through `docs-diagram` and the selected renderer skill. UI styling must not change diagram semantics.
7. Recompose at mobile breakpoints; do not merely shrink desktop UI. Keep touch targets, menu scrolling, and visible focus states.
8. For mobile text inputs, search fields, and textareas that can receive focus, keep the effective font size at least `16px`. iOS Safari automatically zooms focused form controls below `16px`, which can make fixed overlays appear oversized, push adjacent controls off-screen, and create apparent horizontal overflow. Do not work around that zoom with `overflow-x: hidden`; prevent it at the input typography boundary.

## Canonical landing-page hierarchy

- **Level 1 = Domain Landing Page.** Use a short positioning statement followed by `## Learning Areas` and the shared landing-card grid linking to Level-2 topics. Do not turn the domain page into a long article or a bullet-list directory.
- **Level 2 = Topic Landing Page / Learning Map.** Use a short scope statement, `## Topic Overview`, canonical lesson cards under `## Lessons`, and `## Recommended Order` only when order adds real guidance. A concise mental-model or lifecycle visual is allowed only when it improves orientation.
- **Level 3 = Learning Content.** Detailed explanations, examples, mistakes, self-tests, experiments and checkpointed knowledge belong here.
- Level 1 and Level 2 must use explicit MDX docs. **Never use Docusaurus `generated-index` for Level 1 or Level 2.**
- Use `LandingCardGrid` + `LandingCard` as the canonical navigation pattern for Level-1 topics and Level-2 lessons. Do not invent page-specific navigation patterns when the shared landing components are sufficient.
- Landing cards contain a title, one concise description and a link; avoid paragraphs, nested lists or decorative metadata inside cards.
- Do not duplicate Level-3 teaching content on landing pages. Keep only enough mental map to answer: what is this topic, what are its parts, how are they related, and what should I open next?
- Topic-specific variation is limited to truthful orientation visuals or a genuinely useful recommended order. Skeleton, spacing and navigation language stay consistent.

## Acceptance

- Inspect all Level-1 pages affected by a landing-system change and representative Level-2 pages spanning navigation-only and visual-orientation topics.
- Test light and dark themes plus desktop and mobile widths.
- Verify domain categories stay expanded, level-2 groups remain visible, level-3 article lists collapse/expand predictably, and long sidebars remain usable.
- Check text/background contrast, inline code, links, active navigation, TOC, cards, code blocks, and diagram surfaces.
- On iOS/Safari-targeted UI, verify focused inputs do not trigger browser auto-zoom and fixed overlays remain within the visible viewport.
- Run `npm run docs:check`, `npm run typecheck`, `npm run build`, and `git diff --check`.
- Never claim visual QA without inspecting actual renders.
