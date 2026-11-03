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

## Tabs and Chips

```jsx
<Tabs label="File views" value={tab} onValueChange={setTab} items={[
  { value:'all', label:'All', count:24, id:'tab-all', panelId:'panel-all' },
  { value:'shared', label:'Shared', count:8, id:'tab-shared', panelId:'panel-shared' },
]} />
<div id="panel-all" role="tabpanel" aria-labelledby="tab-all" hidden={tab !== 'all'}>…</div>
<div id="panel-shared" role="tabpanel" aria-labelledby="tab-shared" hidden={tab !== 'shared'}>…</div>

<Chips value={filter} onValueChange={setFilter}
  items={[{value:'all',label:'All'},{value:'mine',label:'Mine'}]} />
```

Tabs owns arrow/Home/End keyboard navigation. Supply the panel content, IDs, and visibility. Chips are pressed filter buttons, not tab panels.

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

`Grid` and `Stack` own page, form and sidebar geometry. `Grid layout="sidebar" sidebarWidth={280}` gives a narrow left side and a flexible right side; `layout="aside"` reverses it. `layout="split" ratio={[2,3]}` uses proportional tracks. These split modes stack below 800px. Automatic grids retain the `min` minimum item width. Both expose `gap`; Grid also exposes `align`.

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
