# Component purpose audit — v0.8

The goal is one implementation per interaction, with clear composition APIs. A popup shell alone does not make a useful component. This audit covers the public React exports, browser examples, types and interaction styles; it is not a claim of physical-device or accessibility conformance testing.

## Removed duplication

Autocomplete duplicated Combobox with allowCustom; Collapsible duplicated one-item Accordion; Stat duplicated StatCard's inline variant; raw Modal exposed a second API over Dialog's internal engine. These four public exports and their duplicate documentation were removed. See [migration examples](migrations-v0.8.md).

## Retained distinctions

| Family | Why the APIs differ |
| --- | --- |
| Dropdown / compound Menu | Same Send implementation; array convenience API versus custom composition. Nested options unfold in place. |
| ContextMenu | Pointer-context or Shift+F10 actions, viewport positioning, nested choices and keyboard navigation. Shares menu motion, not global search behavior. |
| CommandMenu | Global ranked search, groups, nested scopes, recent actions, modifier shortcuts, async pending/error recovery. The demo edits real local workspace state. |
| Popover | Anchored rich content with caller-owned controls, rather than command selection. Nested Popovers is a composition recipe. |
| Dialog / Drawer / BottomSheet | One native focus/stack engine, with centered decision, side workspace, or mobile bottom-sheet presentation and gesture behavior. Stacked Dialogs is a recipe. |
| Tabs / Segmented / Chips / ToggleGroup | Panels, single form choice, removable filters, and one/multiple toggle choices respectively. Shared styling does not imply identical semantics. |
| Select / Combobox / SearchSelect / MultiSelect | Simple native choice, searchable local choice with optional custom text, async remote search, and array selection. |
| Form / Field / Textarea | Form state and validation, field association, and multiline input. Input primitives retain native props. |
| DataTable / DataGrid | Caller-controlled table primitive for server state versus local search/filter/sort/selection/columns/windowing. DataGrid composes DataTable conventions. |
| Card / Tile / StatCard / SettingRow | Content grouping, navigable destination, metric presentation, and setting/action alignment. MetricGrid supplies responsive layout. |
| Skeleton / Progress / UploadProgress | Unknown content, bounded progress, and caller-owned transfer lifecycle with retry/cancel slots. |
| Icon / AnimatedIcon | Static/custom glyph rendering versus explicit SVG motion. Catalog glyphs use a shared stroke trace; curated glyphs have tailored motion. Vendor artwork remains attributed. |
| ReorderList / SwipeActions / Carousel / SplitPane | Different drag constraints and keyboard alternatives. Gestures never trigger destructive actions by merely revealing them. |
| SettingsPanel / TeamDirectory / FileManager / SupportInbox | Reusable task workflows over caller-owned data and callbacks. No library network endpoints or simulated backend persistence. |

Dashboard Layout, Nested Popovers and Stacked Dialogs live under Recipes. Workflows have their own navigation category. They are excluded from the component-reference count.

## Motion contract

Controls animate meaningful state changes. Send menus retain entry/exit presence and unfolding submenus. Native Popover, ContextMenu and Combobox lists use top-layer-preserving discrete display/overlay transitions so closing does not vanish instantly. Context submenu rows remain mounted, inert and hidden from assistive technology while collapsed. Dialog stacking uses one native engine; swipe content slides smoothly beside compact pill actions. Selection/focus/hover colors transition without animating static reading content.

Selected icon previews run once immediately, with Replay and opt-in Loop. SVG paths animate internally; the SVG viewport stays steady. Reduced-motion preferences suppress nonessential movement. CSS native-popover exit transitions depend on modern discrete-transition support; unsupported browsers retain functional immediate dismissal.

## Integration priorities

Import styles once. Use controlled values and callbacks, stable IDs and native props. Theme through CSS tokens, then className/style and render slots. Keep network requests and permissions in the consuming application. Prefer the canonical primitive before adding another export with the same behavior.
