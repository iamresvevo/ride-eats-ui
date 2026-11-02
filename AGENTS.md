# Ride Eats UI — instructions for AI developers

This is a **React 19+ library extracted from Ride Eats Send**. Start with README.md, docs/components.md and docs/source-map.md. Use `<Header {...props} />`, `<Button />`, `<Dropdown />`, `<Tabs />`, `<Dialog />` and the other exports from `@ride-eats/ui`. Import `@ride-eats/ui/styles.css` once. Do not start a new integration with DOM mounting helpers.

## Structure

- react/index.jsx: public React API, generic primitives and friendly adapters.
- react/send/: extracted Send components, with app-specific imports removed.
- css/: shared tokens, components and extracted Send control styles.
- site/: React component browser with live previews, copyable usage, and prop tables.
- src/: legacy vanilla implementation, exposed only as @ride-eats/ui/vanilla.

## Rules

Preserve Send’s interaction and motion where components were extracted. Prefer props, children, render props and CSS tokens over hardcoded brands, routes or services. Keep auth, network endpoints, notification integration, billing and workspace logic in consuming apps. Never import credentials or private service configuration.

Use controlled value/onValueChange for library selection components. Send’s Switch and DateTimePicker preserve onChange. Header accepts navigation items, brand, account, loading/signingOut flags and menuContent/extras/guestContent slots. Compound Menu APIs remain available when a Dropdown array is insufficient.

Keep light/dark, keyboard, focus restoration, reduced motion and narrow layouts working. The CSS includes global rules: document integration limits candidly. No physical-device or accessibility conformance claim follows from a build.

Run npm ci, npm run check, npm run build, npm test. Validate changed interactions in the component browser with the available supported browser tools. Update README and component reference if the public API changes. Publish docs through the repository’s GitHub Pages workflow. Keep the source map current when re-extracting from Send. Do not edit Send itself as part of library work. Do not spawn agents unless explicitly requested.

## Implementation is the priority

Use docs/implementation.md and examples/starter for the complete working integration. Build screens with Card, MetricGrid, StatCard, Tile, PageHeader, Toolbar and DataTable instead of reproducing their CSS. DataTable uses caller-owned sorting, selection and rows, with render functions for cells/actions. Wrap the app once in UIProvider; useConfirm supplies Promise-based confirmations that stack over existing dialogs while preserving drafts. Toasts are bounded and deduplicated.

The icon API supports 2,015 vendored Lucide glyphs plus Send paths and custom IconProvider entries. Art remains attributed upstream. Icons load in letter chunks and use optional reduced-motion-aware animation. Regenerate with npm run icons:generate; include the upstream license. Do not claim vendor artwork as original hand-drawn Ride Eats artwork.

## Compact platform components

Use solid accent fills without translucent green variants. Use circular compact controls, rounded surfaces and pill actions throughout; never introduce square-corner cards or preview targets. Default controls are 36px, DataGrid rows 40px and panels 16px. Prefer these defaults. `data-density="comfortable"` opts into larger controls/panels; coarse-pointer menus retain 44px targets. Static content should not animate without purpose. Use css/interaction-motion.css for shared native-popover enter/exit transitions; submenu content stays mounted and inert while collapsed. See docs/component-audit.md and docs/migrations-v0.8.md for canonical APIs.

Use Form/Field/Textarea/Combobox/MultiSelect/DateRangePicker/TimePicker for forms. DataGrid owns local table view state; rows and backend mutations remain caller-owned. It supports search, exact filters, stable sorting, column visibility/resizing, pinned columns, bulk selection, expansion and optional fixed-height virtualization. `renderExpanded` disables virtualization. Do not put variable-height content in virtual rows.

AppShell, WorkspaceSwitcher, NotificationCenter, BottomSheet and ContextMenu compose platform navigation and overlays. SettingsPanel, TeamDirectory, FileManager, ActivityFeed and SupportInbox are reusable workflows. Use UIProvider for confirmations/toasts. Examples never perform real backend operations. See examples/platform for the complete starter and docs/platform-system.md for API composition.

Visual baselines and the comparison command are described in tests/visual/README.md. Capture candidates with supported browser tooling; automated candidate capture is not configured. Run comparison-engine tests and inspect visual changes before updating baselines.
