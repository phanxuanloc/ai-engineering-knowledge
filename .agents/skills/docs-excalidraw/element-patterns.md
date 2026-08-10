# Educational element and layout patterns

Choose the pattern that mirrors the idea's behavior. Do not turn every role into a rounded box.

## Element vocabulary

- **Source:** free-floating label plus a small simple mark; cluster several sources instead of making equal cards.
- **Process:** a rounded box only when an action is genuinely contained.
- **Important concept:** larger highlighted container or circled phrase with more surrounding whitespace.
- **Warning / noise:** red cross-out, blocked path, faded item, or short annotation. Show rejection rather than writing “rejected.”
- **Group / boundary:** light dashed boundary with 40–60 px padding; use only when membership matters.
- **Capacity:** a finite container such as a backpack, tray, bucket, or window whose occupied and excluded space is visible.
- **Flow:** one clear directional arrow; secondary or rejected movement may be dashed.
- **Endpoint:** small ellipse, cloud, or sketch box; never point to floating endpoint text.

## Layout patterns

- **Container / capacity:** place accepted items inside and rejected items visibly outside. Best for Context Window and budgeting.
- **Funnel / convergence:** many candidates narrow through selection to a few useful items. Best for retrieval and filtering.
- **Before / after:** parallel sides on a shared baseline with one meaningful contrast. Best for noise, redundancy, compression, and freshness.
- **Transformation:** concrete before → one transformation → concrete after. Keep the process smaller than the evidence states.
- **Layers:** aligned stack when containment or abstraction level is the lesson.
- **Hub:** one central concept with a few distinct relationships; use only when centrality, not sequence, matters.
- **Cause / effect:** cause and outcome separated by a clear directional cue, with the consequence made visible.
- **Linear explanation:** only for a genuinely short sequence; if it becomes box → box → box, use MDX, Mermaid for a truly trivial topology, or React Flow for a structured flow.

For comparisons, preserve parallel geometry but use different visual behavior: good context may have a visible signal and spare capacity; bad context may show signal buried by crossed-out clutter. For source-to-context models, make `many sources → selection → limited Context Window → LLM` readable before labels.

## Anti-spaghetti rules

Keep the primary eye path dominant. Group equivalent leaves compactly. Prefer one relationship between groups over many redundant point-to-point arrows. If routing still crosses, reorder or remove elements. More waypoints cannot rescue the wrong topology; hand the diagram to `docs-react-flow` when graph structure is the lesson.
