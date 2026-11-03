# Send / Tools audit. v0.12

This audit covers every public React API and documentation page, including workflows and composition recipes. The machine-readable inventory is [design-audit.json](design-audit.json); family ownership is in [design/contract.json](../design/contract.json). Nonvisual hooks, providers and icon-name lists are counted as APIs, not additional visual components.

## Owning references

| Reference                                                                                        | Evidence used                                                                                                                                  |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Ride Eats Send `src/styles/style.css`                                                            | Current neutral palette; ink pill selection; 36px menu rows; 38×22 switch; inline submenu expansion; 28px large corners; soft settling motion. |
| Ride Eats Send `Header`, `AccountMenu`, `Menu`, `Modal`, `Segmented`, `Switch`, `DateTimePicker` | Actual component structure, focus handling, measured account/selection geometry, presence and stacking.                                        |
| Ride Eats Tools `public/css/style.css`                                                           | Compact cards/stats/tables, 20px product panels, pill tabs/chips/search, quiet separators.                                                     |
| Ride Eats Tools `public/css/site-header.css`, `public/js/core/ui.js`                             | Automatic sticky sentinel, header measurement and progressive header fade; floating filters.                                                   |

The inventory records SHA-256 fingerprints of the inspected source stylesheets. Send's current supporting colors are neutral. Older Tools alpha-tinted semantic fills were deliberately not copied: the user's current direction is solid accents, neutral supporting surfaces and circular/pill controls. This release extends pills to single-line fields and option rows while retaining each component's behavior; it does not claim every added platform component already existed in Send.

## Findings and systemic resolution

| Finding                                                                            | Resolution / owning layer                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Palette and geometry defined in multiple CSS files                                 | One foundation in `css/tokens.css`; public density/theme/customization tokens retained.                                                                                                                                                     |
| Stacked late patches competed with component rules                                 | Component-specific swipe, grid, workspace, sheet and floater styling moved into owning modules. Superseded duplicate declarations removed without reordering unique cascade properties. Shared lifecycle stays in `interaction-motion.css`. |
| ToggleGroup used a green rounded rectangle while Segmented used an ink pill        | Same pill corners and ink/on-ink selection; independent pressed semantics remain distinct from radio selection.                                                                                                                             |
| Fields, PIN cells, menus, chips and workflow controls used unrelated corner values | Shared pill/circle/inner/panel/dialog tokens across families; no local numeric CSS radii. Text-only triggers also receive rounded focus shapes.                                                                                             |
| Secondary text and docs typography drifted                                         | Send's readable dark secondary text, 30px bold component headings, compact spacing and consistent section hierarchy.                                                                                                                        |
| Previews changed component surface colors                                          | Removed demo-only recoloring so the actual component renders with its own tokens.                                                                                                                                                           |
| Some chips/triggers and workflow controls had no state feedback                    | Shared scoped control transitions, plus family-owned gesture/presence/selection motion.                                                                                                                                                     |
| WAAPI motion used several independent curves                                       | Account resizing, reordering, selection deformation and dialog exits read `--motion-ease` through one helper.                                                                                                                               |
| Closing menu/picker depended only on animationend                                  | Presence cleanup reads computed CSS duration, with cancellation-safe cleanup; closing picker content is inert.                                                                                                                              |
| Empty animated-icon loading state                                                  | Uses the real PageLoading state rather than unsupported Skeleton size props.                                                                                                                                                                |
| Bold rendered as a question mark                                                   | Generator now includes upstream's 277 compatibility SVG names as well as 2,015 canonical glyph names; regression test checks actual Bold geometry. Literal icon names in all demos are checked.                                             |
| One narrow DataTable page overflowed                                               | Shared hidden-label utility now anchors its tiny off-screen box, keeping horizontal scrolling inside the table.                                                                                                                             |

## Family contract

Every API belongs to one family below. Recipes use the same primitives rather than adding another design language.

### navigation

Send Header/AccountMenu/Segmented/Menu and Tools tabs/chips/stickyBar.

`Header`, `AccountMenu`, `Menu`, `MenuItem`, `MenuSub`, `MenuLabel`, `MenuSeparator`, `Dropdown`, `Tabs`, `Segmented`, `ToggleGroup`, `Pagination`, `Breadcrumbs`, `WorkspaceSwitcher`, `AppShell`, `StickyBar`, `CommandMenu`.

### actions

Send ActionButton and Tools pill actions; derivative controls use the same tokens.

`Button`, `ButtonGroup`, `CopyButton`, `ToggleGroup`, `ContextMenu`.

### forms

Send Field/Switch/DateTimePicker; local and remote selectors retain their distinct data semantics.

`ColorPicker`, `InputGroup`, `Field`, `Switch`, `Select`, `SearchSelect`, `DateTimePicker`, `Checkbox`, `RadioGroup`, `Slider`, `PasswordInput`, `NumberInput`, `FileDropzone`, `PinInput`, `Rating`, `Textarea`, `Form`, `Combobox`, `DateRangePicker`, `TimePicker`, `RangeSlider`.

### feedback

Send native Modal, feedback depth stack, skeletons, empty states; shared presence lifecycle.

`Dialog`, `Drawer`, `BottomSheet`, `Popover`, `NotificationCenter`, `ToastProvider`, `useToast`, `useConfirm`, `Skeleton`, `Bone`, `BoneText`, `EmptyState`, `Alert`, `Progress`, `UploadProgress`.

### display

Tools Cards/stats/table structure, Send identity and vendored icon geometry.

`Card`, `CardHeader`, `CardBody`, `CardFooter`, `Grid`, `StatCard`, `Tile`, `PageHeader`, `Toolbar`, `SettingRow`, `DataTable`, `DataGrid`, `Avatar`, `AvatarGroup`, `VerificationBadge`, `VerifiedName`, `Badge`, `Timeline`, `Icon`, `IconProvider`, `Accordion`, `PageLoading`, `Tooltips`.

### gestures

Extensions inherit Send/Tools density, pill actions, neutral surfaces and shared easing.

`ReorderList`, `SwipeActions`, `Carousel`, `SplitPane`.

### workflows

Compositions of the audited controls; caller data/callbacks remain application-owned.

`SettingsPanel`, `TeamDirectory`, `FileManager`, `SupportInbox`.

### providers

Nonvisual integration APIs; no independent design surface.

`UIProvider`, `ThemeProvider`, `useTheme`, `useDebounce`, `ToastProvider`, `useFeedback`, `iconNames`, `iconNames`.

## Documentation coverage

Each page was loaded in light and dark desktop layouts and in a 390px narrow layout. Initial render, page overflow, shared control geometry and runtime errors were checked; representative open/close/selection/gesture states were checked separately. This is not an exhaustive test of every permutation of every prop.

| Page | Collection | Implementation |
| --- | --- | --- |
| [Segmented](https://iamresvevo.github.io/ride-eats-ui/#segmented) | Inputs | [react/send/Segmented.jsx](../react/send/Segmented.jsx) |
| [Header](https://iamresvevo.github.io/ride-eats-ui/#header) | Navigation | [react/send/Header.jsx](../react/send/Header.jsx) |
| [Dropdown](https://iamresvevo.github.io/ride-eats-ui/#dropdown) | Navigation | [react/send/ui/Menu.jsx](../react/send/ui/Menu.jsx) |
| [Tabs](https://iamresvevo.github.io/ride-eats-ui/#tabs) | Navigation | [react/index.jsx](../react/index.jsx) |
| [Button](https://iamresvevo.github.io/ride-eats-ui/#button) | Actions | [react/index.jsx](../react/index.jsx) |
| [Select](https://iamresvevo.github.io/ride-eats-ui/#select) | Inputs | [react/index.jsx](../react/index.jsx) |
| [Search Select](https://iamresvevo.github.io/ride-eats-ui/#search-select) | Inputs | [react/index.jsx](../react/index.jsx) |
| [Switch](https://iamresvevo.github.io/ride-eats-ui/#switch) | Inputs | [react/send/ui/Switch.jsx](../react/send/ui/Switch.jsx) |
| [Date & Time](https://iamresvevo.github.io/ride-eats-ui/#date-time) | Inputs | [react/send/ui/DateTimePicker.jsx](../react/send/ui/DateTimePicker.jsx) |
| [Dialog](https://iamresvevo.github.io/ride-eats-ui/#dialog) | Feedback | [react/index.jsx](../react/index.jsx) |
| [Skeleton](https://iamresvevo.github.io/ride-eats-ui/#skeleton) | Feedback | [react/send/ui/Skeleton.jsx](../react/send/ui/Skeleton.jsx) |
| [Identity](https://iamresvevo.github.io/ride-eats-ui/#identity) | Display | [react/index.jsx](../react/index.jsx) |
| [Setting Row](https://iamresvevo.github.io/ride-eats-ui/#settings) | Layout | [react/send/ui/SettingRow.jsx](../react/send/ui/SettingRow.jsx) |
| [Pagination](https://iamresvevo.github.io/ride-eats-ui/#pagination) | Navigation | [react/send/ui/Pagination.jsx](../react/send/ui/Pagination.jsx) |
| [Toast](https://iamresvevo.github.io/ride-eats-ui/#toast) | Feedback | [react/Feedback.jsx](../react/Feedback.jsx) |
| [Field](https://iamresvevo.github.io/ride-eats-ui/#field) | Inputs | [react/index.jsx](../react/index.jsx) |
| [Badge](https://iamresvevo.github.io/ride-eats-ui/#badge) | Display | [react/index.jsx](../react/index.jsx) |
| [Empty State](https://iamresvevo.github.io/ride-eats-ui/#empty) | Feedback | [react/send/ui/EmptyState.jsx](../react/send/ui/EmptyState.jsx) |
| [ToggleGroup](https://iamresvevo.github.io/ride-eats-ui/#chips) | Navigation | [react/index.jsx](../react/index.jsx) |
| [Card](https://iamresvevo.github.io/ride-eats-ui/#card) | Layout | [react/index.jsx](../react/index.jsx) |
| [Icon Library](https://iamresvevo.github.io/ride-eats-ui/#icons) | Display | [react/send/Icon.jsx](../react/send/Icon.jsx) |
| [Data Table](https://iamresvevo.github.io/ride-eats-ui/#data-table) | Display | [react/collection.jsx](../react/collection.jsx) |
| [Stacked Dialogs](https://iamresvevo.github.io/ride-eats-ui/#stacked-dialogs) | Recipes | [react/Feedback.jsx](../react/Feedback.jsx) |
| [Accordion](https://iamresvevo.github.io/ride-eats-ui/#accordion) | Layout | [react/collection.jsx](../react/collection.jsx) |
| [Alert](https://iamresvevo.github.io/ride-eats-ui/#alert) | Feedback | [react/collection.jsx](../react/collection.jsx) |
| [Checkbox](https://iamresvevo.github.io/ride-eats-ui/#checkbox) | Inputs | [react/collection.jsx](../react/collection.jsx) |
| [Radio Group](https://iamresvevo.github.io/ride-eats-ui/#radio-group) | Inputs | [react/collection.jsx](../react/collection.jsx) |
| [Slider](https://iamresvevo.github.io/ride-eats-ui/#slider) | Inputs | [react/collection.jsx](../react/collection.jsx) |
| [Progress](https://iamresvevo.github.io/ride-eats-ui/#progress) | Feedback | [react/collection.jsx](../react/collection.jsx) |
| [Password Input](https://iamresvevo.github.io/ride-eats-ui/#password-input) | Inputs | [react/collection.jsx](../react/collection.jsx) |
| [Number Input](https://iamresvevo.github.io/ride-eats-ui/#number-input) | Inputs | [react/collection.jsx](../react/collection.jsx) |
| [Breadcrumbs](https://iamresvevo.github.io/ride-eats-ui/#breadcrumbs) | Navigation | [react/collection.jsx](../react/collection.jsx) |
| [Avatar Group](https://iamresvevo.github.io/ride-eats-ui/#avatar-group) | Display | [react/collection.jsx](../react/collection.jsx) |
| [Copy Button](https://iamresvevo.github.io/ride-eats-ui/#copy-button) | Actions | [react/collection.jsx](../react/collection.jsx) |
| [File Dropzone](https://iamresvevo.github.io/ride-eats-ui/#file-dropzone) | Inputs | [react/collection.jsx](../react/collection.jsx) |
| [Timeline](https://iamresvevo.github.io/ride-eats-ui/#timeline) | Display | [react/collection.jsx](../react/collection.jsx) |
| [Drawer](https://iamresvevo.github.io/ride-eats-ui/#drawer) | Layout | [react/collection.jsx](../react/collection.jsx) |
| [Stat Cards](https://iamresvevo.github.io/ride-eats-ui/#stat-cards) | Display | [react/collection.jsx](../react/collection.jsx) |
| [Tiles](https://iamresvevo.github.io/ride-eats-ui/#tiles) | Layout | [react/collection.jsx](../react/collection.jsx) |
| [Page Header](https://iamresvevo.github.io/ride-eats-ui/#page-header) | Layout | [react/collection.jsx](../react/collection.jsx) |
| [Dashboard Layout](https://iamresvevo.github.io/ride-eats-ui/#dashboard) | Recipes | [react/collection.jsx](../react/collection.jsx) |
| [Reorder List](https://iamresvevo.github.io/ride-eats-ui/#reorder-list) | Layout | [react/gestures.jsx](../react/gestures.jsx) |
| [Swipe Actions](https://iamresvevo.github.io/ride-eats-ui/#swipe-actions) | Actions | [react/gestures.jsx](../react/gestures.jsx) |
| [Carousel](https://iamresvevo.github.io/ride-eats-ui/#carousel) | Display | [react/gestures.jsx](../react/gestures.jsx) |
| [Split Pane](https://iamresvevo.github.io/ride-eats-ui/#split-pane) | Layout | [react/gestures.jsx](../react/gestures.jsx) |
| [Range Slider](https://iamresvevo.github.io/ride-eats-ui/#range-slider) | Inputs | [react/gestures.jsx](../react/gestures.jsx) |
| [Animated Icons](https://iamresvevo.github.io/ride-eats-ui/#animated-icons) | Motion | [react/send/Icon.jsx](../react/send/Icon.jsx) |
| [Popover](https://iamresvevo.github.io/ride-eats-ui/#popover) | Feedback | [react/motion.jsx](../react/motion.jsx) |
| [Command Menu](https://iamresvevo.github.io/ride-eats-ui/#command-menu) | Navigation | [react/CommandMenu.jsx](../react/CommandMenu.jsx) |
| [PIN Input](https://iamresvevo.github.io/ride-eats-ui/#pin-input) | Inputs | [react/motion.jsx](../react/motion.jsx) |
| [Toggle Group](https://iamresvevo.github.io/ride-eats-ui/#toggle-group) | Inputs | [react/motion.jsx](../react/motion.jsx) |
| [Rating](https://iamresvevo.github.io/ride-eats-ui/#rating) | Inputs | [react/motion.jsx](../react/motion.jsx) |
| [Textarea](https://iamresvevo.github.io/ride-eats-ui/#textarea) | Inputs | [react/forms.jsx](../react/forms.jsx) |
| [Form](https://iamresvevo.github.io/ride-eats-ui/#form) | Inputs | [react/forms.jsx](../react/forms.jsx) |
| [Combobox](https://iamresvevo.github.io/ride-eats-ui/#combobox) | Inputs | [react/forms.jsx](../react/forms.jsx) |
| [Multi Select](https://iamresvevo.github.io/ride-eats-ui/#multi-select) | Inputs | [react/forms.jsx](../react/forms.jsx) |
| [Date Range Picker](https://iamresvevo.github.io/ride-eats-ui/#date-range-picker) | Inputs | [react/forms.jsx](../react/forms.jsx) |
| [Time Picker](https://iamresvevo.github.io/ride-eats-ui/#time-picker) | Inputs | [react/forms.jsx](../react/forms.jsx) |
| [Upload Progress](https://iamresvevo.github.io/ride-eats-ui/#upload-progress) | Feedback | [react/forms.jsx](../react/forms.jsx) |
| [DataGrid](https://iamresvevo.github.io/ride-eats-ui/#data-grid) | Display | [react/DataGrid.jsx](../react/DataGrid.jsx) |
| [App Shell](https://iamresvevo.github.io/ride-eats-ui/#app-shell) | Layout | [react/platform.jsx](../react/platform.jsx) |
| [Workspace Switcher](https://iamresvevo.github.io/ride-eats-ui/#workspace-switcher) | Navigation | [react/platform.jsx](../react/platform.jsx) |
| [Notification Center](https://iamresvevo.github.io/ride-eats-ui/#notification-center) | Feedback | [react/platform.jsx](../react/platform.jsx) |
| [Bottom Sheet](https://iamresvevo.github.io/ride-eats-ui/#bottom-sheet) | Feedback | [react/platform.jsx](../react/platform.jsx) |
| [Context Menu](https://iamresvevo.github.io/ride-eats-ui/#context-menu) | Actions | [react/platform.jsx](../react/platform.jsx) |
| [Nested Popovers](https://iamresvevo.github.io/ride-eats-ui/#nested-popovers) | Recipes | [react/platform.jsx](../react/platform.jsx) |
| [Settings Panel](https://iamresvevo.github.io/ride-eats-ui/#settings-panel) | Layout | [react/workflows.jsx](../react/workflows.jsx) |
| [Team Directory](https://iamresvevo.github.io/ride-eats-ui/#team-directory) | Workflows | [react/workflows.jsx](../react/workflows.jsx) |
| [File Manager](https://iamresvevo.github.io/ride-eats-ui/#file-manager) | Workflows | [react/workflows.jsx](../react/workflows.jsx) |
| [Activity Feed](https://iamresvevo.github.io/ride-eats-ui/#activity-feed) | Display | [react/workflows.jsx](../react/workflows.jsx) |
| [Support Inbox](https://iamresvevo.github.io/ride-eats-ui/#support-inbox) | Workflows | [react/workflows.jsx](../react/workflows.jsx) |
| [Sticky Bar](https://iamresvevo.github.io/ride-eats-ui/#sticky-bar) | Layout | [react/StickyBar.jsx](../react/StickyBar.jsx) |

## Verification and limits

See the release validation report for exact checks and outcomes. Desktop screenshots and computed styles do not prove physical touch feel, screen-reader conformance, every browser engine, or backend delivery. Examples use caller-owned local data. Native popover exit transitions and backdrop blur require browser support; functional dismissal and neutral fade remain available without those effects.

## Removed after usefulness review

Steps, ScrollArea and Separator were removed from exports, types, examples and navigation. They did not provide enough reusable behavior. The command-menu example now focuses on commands and local transfer actions, without a full settings screen. See [migration notes](migrations-v0.9.md).

## 0.9.2 refinements

Primary actions and calendar Done/Clear buttons now use the solid accent. UIProvider can set `accent` and optional `accentForeground` at the document root, so portaled overlays share the palette. Solid accent foregrounds default to white; custom palettes may override accentForeground. Neutral navigation pills and semantic statuses retain their roles.

SupportInbox has compact searchable thread rows, shared avatars/textarea/buttons, separate incoming/outgoing surfaces and per-thread drafts. SettingsPanel uses bounded rounded section cards. DataGrid reserves actual control-column widths rather than stretching them; FileManager puts upload inside its single toolbar. StickyBar measures the top cover needed by a padded scroll container and renders fade/blur independently.

## 0.9.3 motion correction

Blur effects are removed across overlays, headers and floaters. CI rejects CSS blur functions. StickyBar retains a neutral fade; its legacy blur prop is ignored. BottomSheet accepts dragging from its grip or header, tracks pointer displacement without a transition while held, and settles short pulls or dismisses deliberate pulls/flicks. Pointer cancellation returns it to position.

SplitPane now has bounded visual resistance and shared easing on release, keyboard and external changes; controlled values remain within min/max. The design check rejects unconfigured CSS transition/animation easing, alongside local curves and blur effects.

In 0.9.14, ScrollArea returns with substantive panel behavior: independently bounded native scrolling, persistent header/footer slots, accessible region naming and Workbench integration. The previous simple overflow wrapper remains retired.

## Composable controls in 0.11

ColorPicker owns color conversion, editable drafts, swatches and pointer shade selection. It composes the existing Segmented and Popover controls, retaining shared motion, focus restoration and reduced-motion handling. Its native ranges provide keyboard equivalents. InputGroup preserves native form and Field associations, with a disabled fieldset covering adjacent actions. ButtonGroup composes existing Button and Dropdown children without creating a second selection or action system. All three use foundation tokens; no extra package, service or product workflow is introduced.

The 0.12 purpose/motion pass is recorded in [component-audit.md](component-audit.md#purpose-and-motion-audit-012). Source geometry and key/pointer editing stay direct; press feedback is independent of existing transforms. Full-edge surfaces remain opaque throughout travel.
