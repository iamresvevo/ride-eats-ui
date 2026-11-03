# Migrating to 0.10

This release removes redundant public names, not their functionality. Update imports and call sites using this table. No compatibility aliases are exported. Old catalog URLs redirect to canonical entries.

| Removed API | Canonical usage | Preserved behavior |
| --- | --- | --- |
| MetricGrid | `Grid preset="metrics"`, `min={oldMinWidth}` | 170px minimum, 12px gaps, 10px gaps on narrow screens |
| Stack | `Flex direction="column"` | Stretch alignment, no wrapping, 12px gap |
| AnimatedIcon | `Icon motion="auto" size={24}` | The same SVG motion, replay, loop, hover/focus triggers and reduced motion |
| animatedIconNames | `iconNames` | The same supported name catalog; animation availability is shown by the browser filter |
| MultiSelect | `Combobox multiple` | Array selection, removal chips, search, keyboard controls and disabled options |
| ActivityFeed | `Timeline variant="feed"` | Heading, empty text, activity icon, description and trailing timestamp |
| Chips | `ToggleGroup variant="chips"` | Existing chip visuals and required single selection; no empty toggle unless requested |
| FeedbackProvider | `ToastProvider` | The same shared confirmation/toast context and stacking engine |

`ToggleGroup` still supports optional single toggles and multiple independent pressed choices. `allowEmpty={false}` requires a selection in the normal toggle style too. RadioGroup and Segmented keep radio semantics. Tabs keep panel associations; SectionNav keeps anchor navigation.

Grid with no preset retains its general layout defaults. Flex rows still wrap and center by default; column direction defaults to stretch and no wrap. Use explicit props to override either behavior.

Icon's general default size is unchanged. Pass `size={24}` when migrating the old animated wrapper's default. No motion implementation or choreography was removed.

The Icon browser now contains static/motion controls, replay, looping and an animated-only filter in one page. The Combobox page demonstrates single and multiple selection. Timeline demonstrates chronological and feed layouts. The old separate pages are gone.

## New distinct tools

ShortcutRecorder captures a candidate locally, normalizes modifier order, checks caller-supplied bindings and commonly reserved shortcuts, and changes its controlled value only on Save or Clear. Escape cancels. Browser and operating-system shortcuts that never reach the page cannot be recorded. Conflict checks cover the supplied binding list, not other applications.

TextDiffViewer compares plain text at line granularity using bounded LCS matching after trimming common ends. It preserves every line, escapes content, supports split and unified layouts, folds unchanged runs, and synchronizes pane scroll positions. Line endings are normalized to LF for comparison. Large replacements use complete removed/added blocks when the matching budget would be exceeded. Copy revision returns the original `after` string, including its line endings.

No service endpoints, persistence or actual application shortcut registrations are included in either tool. Consuming apps own that integration.
