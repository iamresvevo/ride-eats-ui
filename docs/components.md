# React component reference

[Complete starter and implementation guide](implementation.md) · [Tables, cards, tiles, metrics, icons and all platform additions](platform-components.md)

```jsx
import { Header, Button, Dropdown, Tabs } from "@ride-eats/ui";
import "@ride-eats/ui/styles.css";
```

Use React 19+. Components ship as JSX for a bundler. All callbacks and state are owned by your app. Providers are optional unless you use their theme/toast hooks.

## Header and account

```jsx
<Header
  brand={{
    name: "Studio",
    href: "/",
    logoLight: "/dark.svg",
    logoDark: "/light.svg",
  }}
  items={[{ value: "home", label: "Home", href: "/", icon: "files" }]}
  activeValue="home"
  account={{
    name: "Alex",
    email: "alex@example.com",
    avatar: "/alex.jpg",
    verified: true,
  }}
  onSignOut={signOut}
  loading={false}
  signingOut={false}
  menuContent={
    <MenuItem icon="settings" onSelect={openSettings}>
      Settings
    </MenuItem>
  }
  guestContent={<Button onClick={signIn}>Sign in</Button>}
  extras={
    <Button
      icon="bell"
      aria-label="Notifications"
      onClick={openNotifications}
    />
  }
/>
```

`onNavigate(item)` optionally handles SPA routing. Without it links navigate normally. Header retains Send’s measured navigation pill and account shell. `AccountMenu` can also be used independently with `account`, `ready`, `onSignOut`, `menuContent`, `signingOut`, `guestContent`.

## Button

```jsx
<Button variant="primary" icon="plus">Create</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="brand" loading={saving} loadingLabel="Saving…">Save</Button>
```

Variants: `primary`, `brand`, `secondary` (default), `ghost`, `danger`, `surface`. Sizes: default, `sm`, `lg`. Accepts standard button attributes, `ref`, `icon`, `loading`, `loadingLabel`. Primary uses Send’s ink pill; brand uses the accent. Use `aria-label` for icon-only buttons. Set `type="submit"` inside a form when appropriate.

## Dropdown / compound Menu

```jsx
<Dropdown trigger="Actions" align="end" label="File actions" items={[
  { label: 'Edit', icon: 'edit', onSelect: edit },
  { type: 'separator' },
  { label: 'Delete', danger: true, disabled: false, onSelect: remove },
]} />

<Menu trigger={props => <Button {...props}>Appearance</Button>}>
  <MenuLabel>Preferences</MenuLabel>
  <MenuSub id="theme" label="Appearance" icon="sun" value={theme}>
    <MenuItem checked={theme === 'light'} onSelect={() => setTheme('light')}>Light</MenuItem>
    <MenuItem checked={theme === 'dark'} onSelect={() => setTheme('dark')}>Dark</MenuItem>
  </MenuSub>
  <MenuSeparator />
  <MenuItem closesMenu onSelect={openSettings}>More settings</MenuItem>
</Menu>
```

Dropdown array rows: `{label, icon?, checked?, disabled?, danger?, closesMenu?, onSelect?}`; `{type:'separator'}`; `{type:'label',label}`; nested `{id,label,icon?,value?,items:[...]}`. Compound Menu preserves Send’s API. Choosing a subgroup option collapses the group while keeping the menu open. `closesMenu` closes the entire menu. Arrow keys move between rows; Escape collapses a group first, then closes and returns focus. Align start/end; the menu flips above its trigger when needed.

## Tabs and ToggleGroup

```jsx
<Tabs label="File views" value={tab} onValueChange={setTab} items={[
  { value:'all', label:'All', count:24, id:'tab-all', panelId:'panel-all' },
  { value:'shared', label:'Shared', count:8, id:'tab-shared', panelId:'panel-shared' },
]} />
<div id="panel-all" role="tabpanel" aria-labelledby="tab-all" hidden={tab !== 'all'}>…</div>
<div id="panel-shared" role="tabpanel" aria-labelledby="tab-shared" hidden={tab !== 'shared'}>…</div>

<ToggleGroup variant="chips" value={filter} onValueChange={setFilter}
  items={[{value:'all',label:'All'},{value:'mine',label:'Mine'}]} />
```

Tabs owns arrow/Home/End keyboard navigation. Supply the panel content, IDs, and visibility. ToggleGroup are pressed filter buttons, not tab panels.

## Select and SearchSelect

```jsx
<Select
  label="Status"
  value={status}
  onValueChange={setStatus}
  disabled={false}
  options={[
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
  ]}
/>;

const load = useCallback(async (query) => {
  const response = await fetch("/api/people?q=" + encodeURIComponent(query));
  if (!response.ok) throw new Error("Could not load people");
  return response.json(); // [{value, label, detail?}]
}, []);
<SearchSelect
  label="People"
  placeholder="Search people"
  load={load}
  value={people}
  onValueChange={setPeople}
  max={3}
/>;
```

Select uses Send’s menu and a check mark for the selected option. SearchSelect is a generic addition with debouncing, stale-response protection, selected chips and keyboard navigation. Keep `load` stable with `useCallback`; max defaults to 50. Treat server-returned text as labels; no HTML is inserted. Your application must implement and authorize the endpoint.

## Switch, settings and date/time

```jsx
<Switch icon="bell" label="Notifications" hint="A quiet update."
  checked={enabled} onChange={setEnabled} disabled={false} />
<SettingRow icon="globe" label="Visibility" hint="Who can open this?" wide={false}>
  <Select label="Visibility" value={visibility} onValueChange={setVisibility} options={options} />
</SettingRow>
<DateTimePicker value={unixSeconds} onChange={setUnixSeconds} future />
```

These retain Send’s original props. DateTimePicker uses Unix **seconds**, local dates, quarter-hour choices and the document’s language; `future` blocks past choices. Its portal stays inside an enclosing dialog. `dateOnly` reuses that calendar without the time columns; `min`/`max` are Unix seconds, and `locale` controls formatting. DateRangePicker composes this same calendar for both local ISO date endpoints. Switch accepts `className`; setting rows accept arbitrary controls through children.

## Dialog

```jsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Create folder"
  size="md"
  dismissible={!saving}
  footer={
    <Button variant="primary" loading={saving} onClick={save}>
      Create
    </Button>
  }
>
  <Field label="Folder name">
    <input placeholder="Untitled folder" />
  </Field>
</Dialog>
```

Sizes: `sm`, `md`, `lg`. Uses Send’s native dialog with focus management, scroll lock, backdrop, Escape and exit animation. The parent updates `open` in `onOpenChange`.

Keep Dialog mounted and change `open` for its animated exit. Use `onOpenChange`, `dismissible`, `label`, `labelledBy`, `onAfterClose` and `closeOnBackdrop` as needed. The native modal engine is internal; see [v0.8 migration](migrations-v0.8.md).

## Skeleton and identity

```jsx
<Skeleton label="Loading account">
  <Bone className="bone-avatar-lg" />
  <strong><BoneText ch={16} /></strong>
</Skeleton>
<Avatar name="Alex Rivera" src={avatarUrl} />
<VerifiedName name="Alex Rivera" verified />
<VerificationBadge verified={isVerified} />
<Icon name="files" />
```

Skeleton accepts `label`, `className`, `children`. Bone shapes include `bone-avatar`, `bone-avatar-lg`, `bone-tile`, `bone-btn`, `bone-input`, `bone-switch`. BoneText supports `ch` 3/6/10/16/24/36. Avatar shows initials if an image fails. Icon names come from `react/send/Icon.jsx`.

## Feedback, display and layout

```jsx
<Card title="Overview" className="my-layout">
  <Badge tone="good">Delivered</Badge>
  <StatCard variant="inline" label="Transfers" value="1,284" hint="This month" tone="good" />
</Card>
<EmptyState icon="files" title="No files yet" description="Start with an upload."
  action={<Button onClick={upload}>Upload</Button>} />
<Pagination page={page} pageSize={10} total={42} onPageChange={setPage} disabled={loading} />
<Field label="Email" hint="Receipt destination" error={error}>
  <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
</Field>
```

Badge tones: neutral/good/wait/bad. Pagination is 1-based and hidden when only one page exists. Field expects one input/textarea/select child and links label, hint and error IDs. Card renders a section and accepts section attributes.

## Providers

```jsx
<ThemeProvider defaultTheme="system" storageKey="my-app.theme">
  <ToastProvider>
    <App />
  </ToastProvider>
</ThemeProvider>
```

`useTheme()` returns `{theme,setTheme}`. Theme values: system/light/dark. `useToast()` returns `toast(message,{tone:'good',duration:3200})`. Toast timers clean up on unmount. Providers require client rendering; with server rendering, use a stable initial theme to avoid mismatched markup.

[Customization](customization.md) · [Source mapping](source-map.md)

## One-step setup and tooltips

`<UIProvider defaultTheme="system"><App /></UIProvider>` combines ThemeProvider, ToastProvider and Send’s Tooltips. Use either UIProvider or the individual providers, not both.

`<Tooltips />` may also be mounted once at app root. It reads `data-tooltip` and icon-only `aria-label` values, including inside menu portals. Button’s `title` prop supplies its tooltip text. `<PageLoading label="Loading files" />` is Send’s delayed first-load spinner.

## Animated segmented controls

Tabs uses Send’s single moving selection surface, including its directional stretch and 400ms settle. It remeasures labels on resize and skips movement for reduced motion. For radio-style choices, use the extracted Send component directly:

```jsx
<Segmented
  name="visibility"
  value={visibility}
  onChange={setVisibility}
  fit
  options={[
    { value: "private", label: "Private" },
    { value: "public", label: "Public" },
  ]}
/>
```

Segmented accepts label, icon, name, options, value, onChange, disabled and fit. It retains radiogroup semantics; use Tabs for content panels.

## Compact responsive layouts

`Grid` and `Flex` own page, form and sidebar geometry. `Grid layout="sidebar" sidebarWidth={280}` gives a narrow left side and a flexible right side; `layout="aside"` reverses it. `layout="split" ratio={[2,3]}` uses proportional tracks. These split modes stack below 800px. Automatic grids retain the `min` minimum item width. Both expose `gap`; Grid also exposes `align`.

Tabs fit their content inside vertical stacks by default; opt into `width="full"` when the full-width rail is intentional. Tabs have no outer margin. CardHeader centers actions with its title and wraps on narrow surfaces. Use `Field labelHidden` to retain an accessible label without adding a visible label above header search controls.

For compact selection lists, use `Tile variant="row" selected={selected}` with optional image, description and meta. It renders one selectable row, without the default tile footer. `FileDropzone variant="compact" preview={imageUrl}` places an existing image beside its upload label and hint; the default dropzone remains available. Uploads fill their parent width.

`Flex` provides wrapping action rows with `direction`, `align`, `justify`, `gap` and `wrap`. Use `Masonry min={240} columns={3} gap={16}` for varying-height cards; it adapts the number of columns and keeps each card intact. Masonry source/keyboard order runs down columns; use Grid when content needs row alignment. Use the existing SplitPane when users need drag-resizable panels.

### Persistent modal controls and editor panels

`Dialog` now defaults to `scroll="body"`: its title/Close, optional `toolbar` slot and footer stay visible while the body scrolls. Use `scroll="dialog"` for legacy whole-surface scrolling. Put primary actions in `footer`, not at the bottom of long body content. Existing native dialog focus, Escape, stacking and close animations are preserved.

`Workbench` arranges three bounded desktop panels with `leadingWidth`, `trailingWidth`, `height` and `gap`; it stacks below 1000px. Use `ScrollArea label="..." header={...} footer={...}` for independently scrolling catalogues and option forms. Its header/footer stay outside the native keyboard-scrollable content. Give standalone ScrollArea a bounded height via its style or parent layout. Keep canvas input in the middle panel; the library owns its flexible available height. Menus and selects continue to use their own popup positioning.

Tile customization: `density="compact"`, `imageSize={32}`, `imageFit="contain" | "cover"`, `titleLines={2}`, `showFooter={false}` and `selected` work with card and row variants. Grid accepts `density="compact"` (8px default gap and inherited compact tiles), `columns={3}` (responsive maximum), `min={120}` and `gap={8}`. Full titles remain in the DOM when visually clamped.

NumberInput supports `buttonStep` independently of native `step`: use `step={0.01} buttonStep={1}` for monetary entry with cent precision and whole-unit −/+ buttons. Buttons preserve existing cents and clamp to min/max.

Flat navigation: `Tabs variant="flat" width="full"` keeps controlled panel/tab semantics with a bottom divider and plain counts. Compose with StickyBar for pinned panel controls. `SectionNav` provides actual anchor links for sectioned pages, automatic active-section tracking and `sticky`/`offset` props; target IDs belong to the consuming page. It scrolls horizontally on narrow screens and respects reduced motion. No pill container is added.

`SplitPane variant="plain"` composes existing Cards without duplicate backgrounds/padding. `collapseAt={800}` stacks the panels and hides the resize handle below the supplied container width. Desktop handles support pointer dragging and arrow/Home/End keys. The Seasons page uses a wider 36% leading panel, adjustable between 30% and 48%.

Toolbar defaults to `align="end"` so labelled fields, hidden-label search inputs and buttons share a control baseline; `start` and `center` remain available. For a table panel, use `<Card padding="none" footer={pagination}><DataTable variant="inset" ... /></Card>` to keep one surface. DataTable column `wrap: true` with `width` allows long identifiers and secondary text to wrap instead of pushing actions off screen. Badges retain intrinsic width inside Flex.

DataTable defaults to `variant="auto"`: standalone outside Cards, inset inside them. Choose `standalone` to explicitly retain the table border. `cellAlign="top"` aligns multi-line row content at its first line; the default is `middle`.

### Independent inspection, hierarchy, drawing and history tools

- **ImageCompare** takes `before`/`after` image descriptors and controlled `value` (0–100). A native range supports pointer, touch and keyboard reveal; paired sources use the same cover-fit area. Supply matching aspect ratios and meaningful alternative text. Neither source is edited.
- **TreeView** takes uniquely identified recursive `nodes`, independent controlled `value` and `expandedKeys`. Arrow keys navigate/open/close, Home/End jump, Enter/Space select, and typing finds visible names. Disabled nodes are inspectable but cannot be selected. Expansion is independent of selection; lazy data fetching belongs to the app.
- **SignaturePad** takes controlled arrays of `{x,y}` stroke points in a 1000×400 space. Pointer capture keeps a stroke intact outside the surface; cancellation discards the unfinished stroke. Undo/Clear modify only caller-owned vectors. Drawing requires a pointer or touch; provide a separate typed acknowledgement or other alternative where your flow needs keyboard-only completion. The component performs no signing transaction, image upload or storage.
- **ActivityHeatmap** takes a UTC `startDate`, 1–53 `weeks`, and daily `{date,value}` records. The first column starts on the Monday of the supplied week. `max` can share an intensity scale across datasets. Every day exposes its full localized date and formatted value; arrow keys move by day/week. Use `value`/`onValueChange` for day selection. Labels and tooltips carry values without relying on color.

These are independent library-owned designs in `react/specialized.jsx` and `css/specialized.css`, not renamed controls or application screens. Live examples use local assets and in-memory state. Flat Tabs now retain the existing measured selection motion as an underline; documentation previews no longer paint a background over the component.

Header supports `fade={true}` (default) and `fadeSize={72}` for the neutral gradient beneath sticky controls. The fade now tracks the nearest native scrolling ancestor as well as document scrolling and the existing page layout. It uses no backdrop blur. Match the header’s containing surface with the shared `--bg` token.

ImageCompare uses pointer capture and a fixed drag-start rectangle for direct, subpixel reveal. It keeps a native range for assistive technology, Arrow keys (1%), Shift+Arrow (10%), and Home/End. The example reserves percentage-output width so changing digits cannot resize the comparison surface.

## Shortcut Recorder and Text Diff Viewer

Both tools use controlled caller values. ShortcutRecorder changes a binding only on explicit Save or Clear, blocks known reserved combinations and supplied conflicts, and cancels with Escape. TextDiffViewer preserves revision text, folds equal runs, supports split/unified views and synchronizes scrolling. Large replacements have a documented bounded matching fallback. See [the migration guide](migrations-v0.10.md) and [live API reference](platform-components.md).

## Color Picker

```jsx
const [color, setColor] = useState('#1fa476');
<ColorPicker value={color} onValueChange={setColor} label="Accent" />
```

The default is a compact popover; `variant="inline"` embeds the same editor. `alpha` enables opacity and eight-digit HEX output. All changes return canonical lowercase `#rrggbb` or `#rrggbbaa`, regardless of the displayed format. `formats={['hex','rgb','hsl']}` controls the format choices. The editor accepts HEX (3/4/6/8 digits), comma-separated RGB/RGBA and HSL/HSLA. It does not parse named colors, CSS variables or other CSS color spaces. Invalid text shows an error without changing the saved value. Enter commits valid text; Escape first discards a text draft, then closes the popover. Pointer shade selection and native Hue, Saturation and Brightness sliders provide equivalent controls; native sliders support keyboard arrows, Home and End. Hue is retained when a shade becomes gray or black.

`swatches` accepts color strings or `{value,label}` objects. Pass `[]` to hide them, and `formats={['hex']}` for a simpler editor. `eyedropper={false}` hides screen picking; otherwise it appears only when the browser exposes EyeDropper. That browser feature requires a secure context and user activation. Cancellation leaves the color unchanged. `disabled` disables the entire editor and cancels screen picking. The caller owns persistence and may replace `value` externally. Invalid controlled values display the default green until replaced.

Use a unique `label` for each picker. A popover picker works inside Field, including hint/error associations. Inline pickers have their own fieldset label. Colors are live updates; Done dismisses the editor rather than staging a separate save. Swatches replace the complete color, including opacity. Disabling `alpha` hides opacity and strips alpha from subsequent emitted changes, without mutating the caller's existing value.

## Input Group

```jsx
<Field label="Amount" hint="Per item">
  <InputGroup prefix="SRD" suffix="each" type="number"
    value={amount} onChange={e => setAmount(e.target.value)} />
</Field>
```

`prefix` and `suffix` accept text, icons or buttons. Native input props, including `id`, `name`, `ref`, validation and event handlers, go directly to the input. `className` and `style` customize the group wrapper. Field labels and validation reach the real input. `disabled` uses a native disabled fieldset so adjacent actions are disabled too. Give icon-only actions accessible names. This component owns no parsing, numeric stepping, password state or search behavior; pass existing controls and caller callbacks as needed. PasswordInput and NumberInput retain their specialized behavior.

## Button Group

```jsx
<ButtonGroup label="Save actions" attached>
  <Button variant="primary" onClick={save}>Save</Button>
  <Dropdown variant="primary" label="More save options" trigger="More"
    items={[{label:'Save a copy', onSelect:saveCopy}]} />
</ButtonGroup>
```

Compose existing Button and Dropdown children. Separate pills wrap by default; `attached` joins controls into one surface and keeps them on one line. Keep attached labels concise on narrow screens. `orientation="vertical"` stacks actions. Every action keeps native Tab navigation, callbacks, loading and disabled states. This is an action group, not a selection component; use ToggleGroup or Segmented for selection. Dropdown now accepts the same `variant` and `size` as Button for consistent composition.

## Section headings and navigation

Compose a heading and its content with `Flex direction="column" gap={12}`. Use another column with `gap={24}` between sections. CardHeader works without a Card wrapper and accepts `headingLevel={2 | 3 | 4}` (default 2), with shared 15px bold titles and reset browser margins.

```jsx
<Flex direction="column" gap={24}>
  <Flex direction="column" gap={12}>
    <CardHeader title="Related actions" headingLevel={3} />
    <ButtonGroup label="Related actions">{actions}</ButtonGroup>
  </Flex>
</Flex>
```

SectionNav marks the current anchor with `aria-current="location"`, a bold accent label and accent underline. Hover and keyboard focus remain distinct. Counts inherit the selected label color. Scroll tracking and native anchor behavior are retained.

## Motion and editor updates in 0.12

The shared action family animates painted labels and icons on press and release while native hitboxes stay fixed. Tabs and Segmented retain measured sliding selection; independent formatting toggles use separate pill controls. NumberInput animates changed values in their direction, skips initial placement and active typing, and cancels interrupted animations. ShortcutRecorder uses a compact keyboard capture row with key arrival and recording-only feedback, rather than an upload-style dropzone. PIN entries and tree disclosures have local state motion. All added movement respects reduced motion. Static reading surfaces remain stable.

Drawer and BottomSheet use full-edge travel with opaque panels: 420ms entry and 300ms exit. Drawer follows `side`; BottomSheet follows its bottom edge. Reduced motion removes that travel without introducing a panel fade. Backdrop dimming remains separate from panel movement.

Workbench adds `dividers={true}` (default) for subtle structural boundaries between desktop panels; stacked layouts remove the side dividers. ScrollArea separates fixed headers/footers from scroll content, and shares slim native scrollbars with contained modal bodies. Compact row Tiles now use approximately 44px height for two short lines, with 28px default icon/image slots; an explicit `imageSize` still wins. Modal footers share the neutral top divider.

The editor demo uses caller-owned SVG artwork and real in-memory selection, filters, transforms, colors, reset and draft/cancel callbacks. None of those product behaviors are built into Workbench itself.

Menus use intrinsic option width, with the trigger as a minimum and a viewport-safe maximum. Long labels wrap rather than competing with trailing checkmarks. Select triggers remain constrained to their layout width. The catalog includes compact-trigger and long-option cases for checking this behavior.

TextDiffViewer uses a quiet toolbar, plain pane headings and text-style context disclosure controls. It keeps line alignment and bounded matching without an enclosing card frame or animated code rows.


SupportInbox keeps direct, group and channel conversations in one component. Choose `template="bubbles"` or `template="channel"`, set `density`, `showAvatars`, `sidebarWidth`, `height` and `showSidebar`, and supply participants and message avatars. Consecutive messages group by author and chronology; system entries interrupt grouping. Conversation rows have 8px separation, or 4px in compact mode, and message text has a separate gap beneath the author.

Use `renderThread`, `renderHeader`, `renderMessage`, `renderMessageActions` and `renderComposer` for application content. The custom composer receives its per-thread draft, pending/error state and `onSend`. `onReply` remains caller-owned; the library performs no network requests. Drafts survive thread switching, failed sends preserve text, and new text typed during a pending send is preserved.

Header and AppShell navigation items accept `count` (including zero) or a custom React `badge`. Custom badge content takes precedence.
