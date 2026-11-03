# Component purpose audit, 0.10

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
