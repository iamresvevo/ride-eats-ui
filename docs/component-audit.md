# Component purpose audit, 0.12

One canonical public API owns each interaction. Convenience wrappers are not separate components. Nonvisual providers, hooks, compound slots and layout primitives are not advertised as additional visual designs.

## Consolidated

MetricGrid moved into Grid's metrics preset. Stack moved into Flex's column direction. AnimatedIcon moved into Icon motion props, and the duplicate icon-name list was removed. MultiSelect moved into Combobox's multiple mode. ActivityFeed moved into Timeline's feed layout. Chips moved into ToggleGroup's chips variant. FeedbackProvider was an exact alias and is replaced by ToastProvider. See the [migration guide](migrations-v0.10.md) for defaults and examples.

The catalog has one Icon page, one Combobox page and one Timeline page. Redirects preserve old bookmarks. Removed public names are asserted absent by regression tests.

## Retained distinctions

| APIs | Reason |
| --- | --- |
| Tabs / SectionNav | Associated content panels versus in-page anchor destinations and scroll tracking |
| RadioGroup / Segmented / ToggleGroup | Native rich form radio choices, compact animated radio choices, and optional/multiple pressed buttons |
| Select / Combobox / SearchSelect | Simple choices, searchable local choices, and remote asynchronous lookup |
| DataTable / DataGrid | Caller-owned table state versus a locally managed search/filter/columns/windowing tool |
| Card / Tile / StatCard | Content grouping, selectable/actionable destination, and metric presentation |
| Dialog / Drawer / BottomSheet | Shared modal engine with different placement and sheet gesture behavior |
| Progress / UploadProgress | Numeric progress versus a caller-owned per-file transfer lifecycle |
| Grid / Flex / Masonry / SplitPane / Workbench | Grid tracks, flex flow, packed columns, draggable division, and bounded editor panes |
| Skeleton / PageLoading | Content-shaped placeholders versus a delayed initial-page loading indicator |
| ShortcutRecorder / TextDiffViewer | Key capture/review/conflict handling versus actual revision matching and comparison |
| ImageCompare / TreeView / SignaturePad / ActivityHeatmap | Paired image inspection, hierarchical navigation, vector strokes, and daily history |

Toolbar owns leading/trailing controls and labelled-field baseline alignment. ScrollArea owns a labelled native scrolling region with persistent control slots. These are layout APIs, not independent themed designs. Compound Card/Menu slots remain compositional APIs rather than extra catalog entries.

## Functionality and motion

SVG geometry, icon triggers/replay/looping, measured tab and segmented motion, menu presence/submenus, dialog stacking, focus handling and reduced-motion rules remain intact. Chips were never removable tokens; that obsolete claim has been corrected. Selection-removal chips belong to Combobox multiple mode.

Workflows remain a separate catalog category. Recipes remain recipes. The source map distinguishes actual Send extractions from independently implemented tools. A build or browser preview is not physical-device or accessibility conformance certification.

## Purpose and motion audit, 0.12

The common foundation is typography, spacing, neutral surfaces, accent tokens, focus and settling. Different purposes keep different visual structures and movement.

| Family | Visual identity and motion |
| --- | --- |
| Button, ButtonGroup, CopyButton, menu and swipe actions | Pill actions, short press and spring release; attached actions keep their shared silhouette. |
| Tabs, Segmented, Header | Measured sliding selection retained, with separate keyboard semantics. |
| SectionNav | Anchor links, selected accent underline and native section scroll; no tab capsule. |
| ToggleGroup | Independent formatting keys; chips mode remains a filter rail. |
| Checkbox, RadioGroup, Switch, Rating | Check, dot, moving thumb and stars remain distinct; state movement follows each control. |
| Text fields, InputGroup, PasswordInput, selectors | Native editing remains stable; focus/color transitions and popup presence provide feedback. |
| NumberInput, PIN, ColorPicker, sliders | Directional numeric changes, digit arrival, shade/swatch changes and direct thumb tracking. No value animation during typing. |
| ShortcutRecorder / FileDropzone | Keyboard capture row and keycaps versus a dashed file landing area; only active recording has a listening pulse. |
| Dialog, Drawer, BottomSheet | Centered dialog presence versus opaque full-edge side/bottom travel; shared stack and focus engine. |
| Popover, Menu, ContextMenu, CommandMenu | Anchored/native top-layer presence and action feedback retained. |
| Accordion, TreeView | Height/disclosure transitions and rotating disclosure arrows; hierarchy has indentation rather than generic card framing. |
| Card, Tile, StatCard | Static content grouping, interactive destination/selection, and numeric summary stay distinct. |
| DataTable, DataGrid and workflow lists | Content and cell geometry stay stable; sort/filter/selection actions carry feedback. |
| ReorderList, SplitPane, ImageCompare, range sliders, SignaturePad | Pointer tracking remains direct. Reorder settlement and split release retain existing transitions. |
| Progress, UploadProgress, Skeleton, PageLoading | Progress/state motion and loading signals retained, rather than decorative idle animation. |
| Grid, Flex, Masonry, ScrollArea, Workbench, Toolbar, PageHeader, compound slots | Structural layout APIs; no idle bounce. Fixed controls, dividers and native scroll owners describe their role. |
| Identity, Badge, Breadcrumbs, ActivityHeatmap, Timeline, TextDiffViewer, EmptyState, Alert | Reading surfaces remain steady; associated actions and context changes own feedback. |
| Providers, hooks, catalogs and recipes | No independent visual animation surface. |

Browser audit: all 81 catalog previews rendered nonempty content without a render-error fallback. Card's missing catalog switch route was restored and protected by a core catalog route regression check. This presence sweep is not a claim that every state of every component was exercised. Focused browser checks cover the redesigned recorder/editor, split re-grabs, stepper, Drawer and panel scrolling. Reduced-motion and directional motion helpers have regression coverage.
