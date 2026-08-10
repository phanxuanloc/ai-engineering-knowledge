# Excalidraw semantic palette

Use two to four semantic colors in a typical diagram and let neutral ink and whitespace do most of the work. Color reinforces meaning; shape, placement, labels, or marks must carry the same meaning without color.

| Role | Meaning | Fill | Stroke / text | Shared preset |
| --- | --- | --- | --- | --- |
| Primary | Main concept or decision | `#dbe4ff` | `#4c6ef5` | `importantConcept`, `conceptHighlight` |
| Secondary | Supporting concept or boundary | `#e5dbff` | `#5f3dc4` | `conceptContainer`, `annotation` |
| Success | Useful, relevant, accepted, desired | `#d3f9d8` | `#2b8a3e` | `llmNode` or a semantic extension |
| Warning | Limited capacity, caution, uncertainty | `#fff3bf` | `#343a40` | `conceptBox`, `sketchNote` |
| Danger | Noise, rejected, incorrect, harmful | transparent or pale red | `#c92a2a` | `rejectedNoise` |
| Neutral | Infrastructure, ordinary relation, background | transparent | `#343a40` / `#868e96` | `sketchDefaults`, `secondaryArrow` |
| Highlight | The one thing to notice now | `#dbe4ff` cross-hatch | `#4c6ef5` | `conceptHighlight` |
| Background | Reading surface | `#fffdfa` | n/a | scene `viewBackgroundColor` |

Green always means useful/accepted; red always means rejected/risky. Purple supports boundaries or annotations. Yellow signals capacity or attention, not success. Do not invent rainbow categories when neutral treatment works.

Exports sit on the site's neutral diagram surface in both themes. Keep fills pale, strokes dark enough to survive the dark-theme container, and verify the actual rendered page rather than assuming hex values are accessible.
