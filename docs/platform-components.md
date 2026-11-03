# Canonical React component reference, 0.10

See [the migration guide](migrations-v0.10.md) for removed wrappers and preserved defaults. Import styles once and use UIProvider for theme and feedback.

## Shortcut Recorder

Inputs. Capture a shortcut, review it, check conflicts, then save. Escape cancels without changing the saved binding.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#shortcut-recorder)

```jsx
import { ShortcutRecorder } from '@ride-eats/ui';

const [keys,setKeys] = useState(["Control","Shift","K"]);
<ShortcutRecorder value={keys} onValueChange={setKeys} label="Command search" bindings={[{keys:["Alt","M"],label:"Messages"}]} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| value / onValueChange | string[] / callback | Controlled modifier/key names. Only Save or Clear changes the value. |
| bindings / allowConflicts | ShortcutBinding[] / boolean | Normalized matching with conflicts blocked by default. |
| disabled / label | boolean / string | Availability and accessible name. |

## Text Diff Viewer

Display. Compare actual line edits in split or unified views, reveal folded context, and synchronize the scrollable panes.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#text-diff-viewer)

```jsx
import { TextDiffViewer } from '@ride-eats/ui';

const [view,setView] = useState("split");
<TextDiffViewer before={original} after={revision} view={view} onViewChange={setView} contextLines={3} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| before / after | string | Plain text, safely escaped. CRLF and CR use LF for line matching. |
| view / onViewChange | split  /  unified / callback | Controlled layout. Optional callback enables layout buttons. |
| contextLines / collapseUnchanged | number / boolean | Fold long equal runs; buttons reveal all hidden lines. |
| syncScroll / maxHeight | boolean / number  /  string | Paired vertical/horizontal scrolling and a bounded viewport. |

## Image Compare

Display. A direct before/after artwork inspection surface. Drag the divider or use the native range with arrow keys.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#image-compare)

```jsx
import { ImageCompare } from '@ride-eats/ui';

const [position,setPosition] = useState(50);
<ImageCompare before={{src:"/before.jpg",alt:"Original artwork"}} after={{src:"/after.jpg",alt:"Revised artwork"}} value={position} onValueChange={setPosition} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| before / after | {src,alt,label?} | Paired image sources with meaningful alternatives. |
| value / onValueChange | 0–100 / callback | Controlled before-image reveal. |
| aspectRatio / disabled | string / boolean | Surface proportions and input availability. |

## Tree View

Navigation. A compact hierarchy with independent expansion and selection, roving focus, typeahead and the full tree arrow-key model.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#tree-view)

```jsx
import { TreeView } from '@ride-eats/ui';

const [selected,setSelected] = useState("artwork");
const [expanded,setExpanded] = useState(["artwork"]);
<TreeView label="Assets" nodes={[{id:"artwork",label:"Artwork",children:[{id:"logo",label:"Logo.svg"}]}]} value={selected} onValueChange={setSelected} expandedKeys={expanded} onExpandedChange={setExpanded} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| nodes | TreeNode[] | Unique id, text label, optional icon/detail/children/disabled. |
| value / onValueChange | string / callback | Controlled selected item. |
| expandedKeys / onExpandedChange | string[] / callback | Controlled expansion independent of selection. |

## Signature Pad

Inputs. A pointer-captured vector drawing surface with undo and clear. Strokes remain caller-owned; it never uploads or submits a signature.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#signature-pad)

```jsx
import { SignaturePad } from '@ride-eats/ui';

const [strokes,setStrokes] = useState([]);
<SignaturePad value={strokes} onValueChange={setStrokes} label="Delivery acknowledgement" />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| value / onValueChange | SignatureStroke[] / callback | Arrays of points in a 1000 × 400 coordinate space. |
| strokeWidth / disabled | number / boolean | Ink width in screen pixels (1–12) and input availability. |
| label / emptyText / footer | string / string / ReactNode | Accessible name, drawing hint and caller context. |

## Activity Heatmap

Display. A calendar matrix for dense daily history. Neutral levels and a solid accent peak, labelled dates, keyboard day/week navigation and optional selection.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#activity-heatmap)

```jsx
import { ActivityHeatmap } from '@ride-eats/ui';

<ActivityHeatmap startDate="2026-08-03" weeks={12} values={[{date:"2026-08-03",value:8},{date:"2026-08-04",value:3}]} label="Publishing activity" />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| startDate / weeks | YYYY-MM-DD / 1–53 | Starts on the Monday of the supplied week; dates use UTC day keys. |
| values / max | {date,value}[] / number | Daily data and an optional shared intensity ceiling. |
| value / onValueChange | date / callback | Optional selected day; the date labels include counts. |
| locale / formatValue | string / callback | Date formatting locale and caller-owned value descriptions. |

## Section Navigation

Navigation. Flat section links with plain counts, sticky positioning, scroll tracking and responsive horizontal overflow. Use Tabs variant=flat for panels; SectionNav is for in-page sections.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#section-nav)

```jsx
import { SectionNav, Card } from '@ride-eats/ui';

<SectionNav offset={64} items={[{id:"send",label:"Send",count:6},{id:"share",label:"Share",count:6}]} />
<Card id="send" title="Send">...</Card>
<Card id="share" title="Share">...</Card>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| items | {id,label,count?}[] | IDs reference real section elements; counts stay plain. |
| sticky / offset | boolean / number  /  string | Sticky by default; offset matches the main header. |
| value / onValueChange | string / callback | Optional active override and section-click callback. |
| Tabs variant | pill  /  flat | Panel tabs retain keyboard navigation and ARIA associations. |

## Workbench

Layout. Bounded editor panels with independent native scrolling. Panel headers and actions stay visible; narrow screens stack the panels.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#workbench)

```jsx
import { Workbench, ScrollArea, CardHeader, Card, Flex, Button } from '@ride-eats/ui';

<Workbench leadingWidth={240} trailingWidth={260}>
 <ScrollArea label="Catalogue" header={<CardHeader title="Objects" />}><p>Long object catalogue</p></ScrollArea>
 <Flex direction="column"><Card title="Preview">Your canvas</Card><Button>Preview</Button></Flex>
 <ScrollArea label="Options" header={<CardHeader title="Options" />}><p>Long options form</p></ScrollArea>
</Workbench>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| leadingWidth / trailingWidth | number | Preferred side panel widths in pixels. |
| height | string | Bounded desktop height; defaults to min(66dvh, 760px). |
| ScrollArea header / footer | ReactNode | Persistent controls outside the labelled native scroll region. |
| ScrollArea label | string | Accessible name for the keyboard-scrollable content. |

## Masonry

Layout. Variable-height cards flow down responsive columns without splitting a card. Source and keyboard order run down each column.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#masonry)

```jsx
import { Masonry, Card } from '@ride-eats/ui';

<Masonry min={240} columns={3} gap={16}>
 <Card title="Short card">A short note.</Card>
 <Card title="Longer card">More content can take its natural height while the next card packs below it.</Card>
 <Card title="Another card">Content stays intact.</Card>
</Masonry>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| min | number | Preferred minimum column width. Columns shrink to fit narrow containers. |
| columns | number | Maximum columns; actual count adapts to available width. |
| gap | number | Shared horizontal and vertical spacing. |

## Layouts

Layout. Responsive fixed-side, proportional and wrapping layouts, natural-width tabs, compact selectable rows and image uploads.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#layout)

```jsx
import { Grid, Flex, Card, Tile, FileDropzone } from '@ride-eats/ui';

<Grid layout="sidebar" sidebarWidth={280}>
  <Card title="Seasons"><Flex direction="column" gap={4}><Tile variant="row" selected title="Diwali" description="Scheduled" onClick={()=>{}} /></Flex></Card>
  <Card title="Details"><FileDropzone variant="compact" label="Main logo" onFiles={()=>{}} /></Card>
</Grid>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| columns / min / density | number / number / default  /  compact | Responsive maximum columns, minimum width and inherited compact tiles. |
| layout | auto  /  sidebar  /  aside  /  split | Automatic tracks, fixed left or right side, or custom ratios. |
| sidebarWidth / ratio | number / [number, number] | Fixed-side pixels or flexible relative track sizes. |
| Flex.gap | number | Vertical rhythm without outer component margins. |

## Icon Library

Display. 2,015 canonical Lucide glyphs and 277 compatibility names plus Send’s own glyphs. Search by name or purpose, adjust size and stroke, preview motion, and copy the exact React code.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#icons)

```jsx
import { Icon, IconProvider } from '@ride-eats/ui';

<Icon name="headset" size={24} strokeWidth={1.7} />
<Icon name="loader-circle" motion="spin" animateOn="always" />
<Icon name="check" motion="draw" />

// Your own brand glyphs fit the same API:
<IconProvider icons={{ brand: <path d="M4 12 12 4l8 8-8 8Z" /> }}>
  <Icon name="brand" size={32} />
</IconProvider>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| name | string | Catalog slug or a registered custom name. |
| size / strokeWidth / color | number / number / string | SVG size, stroke and color; defaults preserve Send control sizing. |
| motion | auto  /  none  /  draw | Opt-in movement; honors reduced motion. |
| animateOn | hover  /  always | Hover/focus or continuous animation. |
| label / title | string | Accessible meaning for nondecorative icons. |
| IconProvider.icons | Record<string,ReactNode> | Register custom SVG contents or override catalog names. |

## Data Table

Display. A real working table: custom cells, sortable columns, selection, row actions, loading and empty states. Keep data fetching and sorting in your application.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#data-table)

```jsx
import { DataTable, Badge, Button } from '@ride-eats/ui';

const [sort, setSort] = useState({ key: 'name', direction: 'asc' });
const [selected, setSelected] = useState([]);
const rows = [...people].sort((a, b) =>
  String(a[sort.key]).localeCompare(String(b[sort.key])) * (sort.direction === 'asc' ? 1 : -1)
);

<DataTable
  caption="Team members" rows={rows} rowKey="id"
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', render: value => <Badge tone="good">{value}</Badge> },
  ]}
  sort={sort} onSortChange={setSort}
  selectedKeys={selected} onSelectionChange={setSelected}
  rowActions={row => <Button size="sm" onClick={() => openProfile(row)}>View</Button>}
/>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| variant / cellAlign | auto  /  standalone  /  inset / top  /  middle  /  bottom | Avoid duplicate Card surfaces and align multi-line content. |
| columns | Column[] | key, label, render(value,row), sortable, width, wrap, align. |
| rows / rowKey | T[] / key or function | Your records and stable identifiers. |
| sort / onSortChange | Sort / callback | Controlled sort; your app orders/fetches rows. |
| selectedKeys / onSelectionChange | Key[] / callback | Optional selection with select-all and indeterminate state. |
| rowActions / onRowClick | render / callback | Custom actions or accessible first-cell button. |
| loading / emptyContent / caption | boolean / ReactNode | Status and semantic table context. |
| className / style / density | styling hooks | compact or comfortable rows. |

## Stacked Dialogs

Recipes. Keep the form mounted while a confirmation opens above it. One backdrop, depth transitions, focus restoration and a preserved draft.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#stacked-dialogs)

```jsx
import { Button, Dialog, Field, useConfirm } from '@ride-eats/ui';

const confirm = useConfirm();
const [open, setOpen] = useState(false);
const [name, setName] = useState('');
const requestClose = async () => {
  const discard = !name || await confirm({
    title: 'Discard changes?', message: 'Your draft has not been saved.',
    confirmLabel: 'Discard changes', cancelLabel: 'Keep editing', danger: true,
  });
  if (discard) setOpen(false);
};

<Button onClick={() => setOpen(true)}>Create folder</Button>
<Dialog open={open} onOpenChange={requestClose} title="Create folder"
  footer={<Button onClick={requestClose}>Cancel</Button>}>
  <Field label="Folder name"><input value={name} onChange={e => setName(e.target.value)} /></Field>
</Dialog>
// Wrap your app in UIProvider once.
```

| Prop | Type | Purpose |
| --- | --- | --- |
| useConfirm() | (options) => Promise<boolean> | title, message, confirmLabel, cancelLabel and danger. |
| Dialog.beforeClose | () => boolean  /  Promise<boolean> | Optional dismissal guard; external open state remains yours. |
| Native stack | automatic | Underlying form is inert, scaled and preserved; only the first backdrop dims. |

## Accordion

Layout. Quiet disclosure rows with an animated height, rotating chevrons and controlled state.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#accordion)

```jsx
import { Accordion } from '@ride-eats/ui';

const [open, setOpen] = useState('delivery');
<Accordion value={open} onValueChange={setOpen} items={[
  { value: 'delivery', title: 'How does delivery work?', content: 'Your recipient gets a secure download link.' },
  { value: 'expiry', title: 'Can I change the expiry?', content: 'Choose a date in transfer settings.' },
]} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| items | {value,title,content,icon?}[] | Content and optional row icons. |
| value / onValueChange | string  /  null / callback | Open item or null. |
| className / style | styling hooks | Customize the outer layout. |

## Alert

Feedback. An inline message with a small status mark, optional action and dismissal.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#alert)

```jsx
import { Alert, Button } from '@ride-eats/ui';

<Alert tone="good" title="Your files are ready"
  onDismiss={() => setVisible(false)}
  action={<Button size="sm" onClick={openTransfer}>View transfer</Button>}>
  A secure link is ready to share with your team.
</Alert>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| tone | neutral  /  good  /  bad | Semantic styling and alert/status role. |
| title / children / action | ReactNode | Message, detail and optional action. |
| onDismiss | () => void | Optional dismissal control. |

## Checkbox

Inputs. A compact check with a soft scale transition, a real native input and indeterminate support.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#checkbox)

```jsx
import { Checkbox } from '@ride-eats/ui';

const files = [{ id: 'brief', name: 'Campaign brief.pdf' }, { id: 'assets', name: 'Brand assets.zip' }];
const [selected, setSelected] = useState(['brief']);
const all = selected.length === files.length;
const mixed = selected.length > 0 && !all;

<Checkbox label="Select all files" checked={all} indeterminate={mixed}
  onCheckedChange={checked => setSelected(checked ? files.map(file => file.id) : [])} />
{files.map(file => <Checkbox key={file.id} label={file.name}
  checked={selected.includes(file.id)}
  onCheckedChange={checked => setSelected(current => checked
    ? [...current, file.id] : current.filter(id => id !== file.id))} />)}
```

| Prop | Type | Purpose |
| --- | --- | --- |
| checked / onCheckedChange | boolean / callback | Controlled native checkbox. |
| label / hint | ReactNode | Label and explanation. |
| indeterminate / disabled | boolean | Mixed state and availability. |

## Radio Group

Inputs. Selectable option rows with a quiet border, animated dot and supporting text.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#radio-group)

```jsx
import { RadioGroup } from '@ride-eats/ui';

const [access, setAccess] = useState('private');
<RadioGroup label="Who can access this?" value={access} onValueChange={setAccess}
  options={[
    { value: 'private', label: 'Only invited people', description: 'A private space for your team.' },
    { value: 'public', label: 'Anyone with the link', description: 'Easy to share, no account needed.' },
  ]} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| options | Option[] | value, label, description, trailing and disabled. |
| value / onValueChange | string / callback | Native radio behavior, controlled state. |
| label / name / disabled | string / boolean | Group context and form identity. |

## Slider

Inputs. A smooth value track with a precise native range input and a readable live value.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#slider)

```jsx
import { Slider } from '@ride-eats/ui';

const [volume, setVolume] = useState(64);
<Slider label="Volume" value={volume} onValueChange={setVolume}
  min={0} max={100} step={1} formatValue={value => value + '%'} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| value / onValueChange | number / callback | Controlled value. |
| min / max / step | number | Native range bounds. |
| formatValue | (value) => string | Visible and accessible value text. |

## Progress

Feedback. A measured progress bar with a soft fill transition, or a restrained indeterminate state.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#progress)

```jsx
import { Progress, Button } from '@ride-eats/ui';

const [progress, setProgress] = useState(64);
<Progress label="Uploading campaign assets" value={progress} hint="6.4 MB of 10 MB" />
<Button onClick={() => setProgress(value => Math.min(100, value + 12))}>Advance</Button>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| value / max | number | Current and maximum values. |
| label / hint | string | Task and supporting context. |
| indeterminate | boolean | Unknown duration with reduced-motion fallback. |

## Password Input

Inputs. A labeled password field with an integrated reveal control and native input props.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#password-input)

```jsx
import { PasswordInput } from '@ride-eats/ui';

<PasswordInput label="Password" placeholder="Enter your password"
  autoComplete="current-password" value={password}
  onChange={e => setPassword(e.target.value)}
  hint="Use at least 12 characters." />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| label / hint | ReactNode | Field context. |
| ...inputProps | native input attributes | value, onChange, name, required, disabled, autoComplete. |

## Number Input

Inputs. Increment and decrement controls around a directly editable number.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#number-input)

```jsx
import { NumberInput } from '@ride-eats/ui';

const [quantity, setQuantity] = useState(2);
<NumberInput label="Copies" value={quantity} onValueChange={setQuantity} min={1} max={20} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| value / onValueChange | number / callback | Controlled quantity. |
| min / max / step | number | Bounds and increment. |
| label / disabled | string / boolean | Field name and availability. |

## Breadcrumbs

Navigation. A compact path through the app, with a clear current page and real links.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#breadcrumbs)

```jsx
import { Breadcrumbs } from '@ride-eats/ui';

<Breadcrumbs items={[
  { label: 'Workspace', href: '/' },
  { label: 'Transfers', href: '/transfers' },
  { label: 'Campaign assets' },
]} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| items | {label,href?}[] | Last item is the current page. |
| label | string | Accessible navigation name. |

## Avatar Group

Display. Overlapping team identities with a measured hover lift and overflow count.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#avatar-group)

```jsx
import { AvatarGroup } from '@ride-eats/ui';

<AvatarGroup max={4} people={[
  { id: 'alex', name: 'Alex Rivera', src: '/alex.jpg' },
  { id: 'sam', name: 'Sam Chen' },
  { id: 'jordan', name: 'Jordan Lee' },
]} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| people | {id?,name,src?}[] | Images fall back to initials. |
| max | number | Visible identities before +N. |
| label | string | Group accessible name. |

## Copy Button

Actions. Copy a value, then show a quiet checked confirmation. Failures stay visible.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#copy-button)

```jsx
import { CopyButton } from '@ride-eats/ui';

<CopyButton value="https://example.com/shared/abc" label="Copy link"
  copiedLabel="Link copied" onCopy={() => console.log('Copied')} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| value | string | Clipboard text. |
| label / copiedLabel | string | Idle and confirmed labels. |
| onCopy / onError | callbacks | Optional integration events. |

## File Dropzone

Inputs. A compact upload target with drag feedback, keyboard selection, size checks and file-type validation. Your app handles uploading.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#file-dropzone)

```jsx
import { FileDropzone } from '@ride-eats/ui';

<FileDropzone accept="image/*,.pdf" maxSize={10 * 1024 * 1024} multiple
  onFiles={files => setFiles(files)}
  label="Drop your files here" description="or browse from your device" />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| onFiles | (files: File[]) => void | Validated files; upload with your own API. |
| accept / multiple / maxSize | string / boolean / bytes | Type, count and size constraints. |
| label / description / disabled | props | Content and availability. |

## Timeline

Display. A compact activity trail, connected with fine lines and familiar Send icons.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#timeline)

```jsx
import { Timeline } from '@ride-eats/ui';

<Timeline items={[
  { id: 1, title: 'Transfer created', time: 'Just now', icon: 'plus' },
  { id: 2, title: 'Files uploaded', description: '12 files · 48 MB', time: '2 minutes ago', icon: 'upload' },
  { id: 3, title: 'Delivered to Alex', time: '5 minutes ago', icon: 'check', tone: 'good' },
]} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| items | TimelineItem[] | title, description, time, dateTime, icon and tone. |
| label | string | Accessible activity-list name. |

## Drawer

Layout. A side panel built on the same native modal stack: smooth entry, focus management and Escape.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#drawer)

```jsx
import { Drawer, Button } from '@ride-eats/ui';

const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>View details</Button>
<Drawer open={open} onOpenChange={setOpen} title="Transfer details"
  footer={<Button onClick={() => setOpen(false)}>Done</Button>}>
  <p>Campaign assets · 12 files · 48 MB</p>
</Drawer>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| open / onOpenChange | boolean / callback | Controlled visibility. |
| title / children / footer | ReactNode | Panel structure. |
| side | right  /  left | Slide-in direction. |

## Stat Cards

Display. The Tools dashboard metrics, with default, compact, inline and hero layouts. Optional sparklines, trends and progress.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#stat-cards)

```jsx
import { Grid, StatCard } from '@ride-eats/ui';

<Grid preset="metrics" min={180}>
  <StatCard label="Payments" value="153" hint="1 open" />
  <StatCard label="Paid" value="5" hint="Available from Drop 1" tone="good" />
  <StatCard label="Scenarios passed" value="44 / 48" progress={92} />
  <StatCard label="Avg. response" value="1400 ms" hint="300 calls · 6 errors" />
</Grid>
<StatCard variant="compact" label="Downloads" value="1,284" trend="+12.8%"
  chart={[12,18,15,30,24,40,48,52]} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| label / value / hint | ReactNode | Metric hierarchy. |
| variant | default  /  compact  /  inline  /  hero | Surface and type scale. |
| chart / trend / progress | number[] / text / percentage | Optional secondary data. |
| tone / icon | semantic tone / icon name | Meaning and visual context. |
| className / style / ...props | section attributes | App-specific layout. |

## Tiles

Layout. The Tools launcher shape: a contained icon, a clear name, a short explanation and a natural next step.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#tiles)

```jsx
import { Tile, Grid } from '@ride-eats/ui';

<Grid preset="metrics" min={220}>
  <Tile icon="files" title="My transfers" description="Everything you have shared."
    meta="24 files" href="/transfers" footer="View transfers" />
  <Tile icon="team" title="Team workspace" description="Share a space with your people."
    onClick={() => setTeamOpen(true)} footer="Open workspace" />
</Grid>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| title / description / meta / footer | ReactNode | Tile content and supporting context. |
| density / variant | default  /  compact / default  /  row | Compact spacing and selectable row layout. |
| imageSize / imageFit | number / contain  /  cover | Thumbnail dimensions and fitting. |
| titleLines / showFooter | number / boolean | Limit title lines and optionally remove footer chrome. |
| selected | boolean | Controlled pressed state for selectable tiles. |
| icon / image | name / image URL | Visual identity. |
| href / onClick | link / callback | Choose link, button or static article semantics. |
| disabled / className / ...props | customization | Interaction and layout. |

## Page Header

Layout. Tools-style page titles with an app icon, context, description and natural-size actions.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#page-header)

```jsx
import { PageHeader, Button } from '@ride-eats/ui';

<PageHeader title="Payments" icon="storage" description="Shared across your admin devices."
  actions={<Button onClick={refresh}>Check connection</Button>} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| title / description / eyebrow | ReactNode | Page hierarchy. |
| icon / image | icon name / URL | Optional app identity. |
| actions / children | ReactNode | Natural-size controls and additional content. |

## Dashboard Layout

Recipes. Compose a working screen from page headers, metric cards, tabs, tool tiles and tables. The same building blocks as Tools.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#dashboard)

```jsx
import { PageHeader, Grid, StatCard, Tabs, Card, DataTable } from '@ride-eats/ui';

<div className="stack">
  <PageHeader title="Payments" icon="storage" description="Shared across admin devices." />
  <Grid preset="metrics">
    <StatCard label="Payments" value="153" hint="1 open" />
    <StatCard label="Paid" value="5" tone="good" />
    <StatCard label="Scenarios passed" value="44 / 48" progress={92} />
  </Grid>
  <Tabs value={tab} onValueChange={setTab} items={tabs} />
  <Card title="Recent payments" description="A shared view of the latest activity.">
    <DataTable columns={columns} rows={payments} />
  </Card>
</div>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| Composition | children and slots | No additional provider or dashboard-specific state. |
| Grid.minWidth | number | Responsive minimum card width in pixels. |
| Card | title,description,action,footer,variant,padding | High-level API or compound CardHeader/Body/Footer. |

## Reorder List

Layout. Drag handles to reorder rows with animated position changes. Arrow keys on the handle and move buttons provide equivalent controls.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#reorder-list)

```jsx
import { ReorderList } from '@ride-eats/ui';

const [items, setItems] = useState([{id:'a',label:'Design'}, {id:'b',label:'Build'}, {id:'c',label:'Review'}]);
<ReorderList items={items} onReorder={setItems} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| items / onReorder | T[] / callback | Caller-owned ordered items. Stable IDs preserve state. |
| getItemKey / renderItem | (item) => key / (item, index) => ReactNode | Customize identity and row content. Defaults to item.id and item.label. |
| disabled / label | boolean / string | Disable movement or name the list. |

## Swipe Actions

Actions. Drag a row left to reveal actions, or use its action button. Actions only run when explicitly pressed.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#swipe-actions)

```jsx
import { SwipeActions } from '@ride-eats/ui';

<SwipeActions actions={[{value:'archive', label:'Archive', icon:'archive', tone:'info', onSelect:archive}, {value:'delete', label:'Delete', icon:'trash', destructive:true, onSelect:remove}]}><strong>Project files</strong></SwipeActions>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| actions | {value,label,icon?,tone?,destructive?,onSelect?}[] | Up to three visible actions. Revealing never executes them. |
| children / label | ReactNode / string | Row content and action region name. |

## Carousel

Display. Touch scrolling, mouse dragging, keyboard arrows and navigation buttons share one scroll-snap carousel. Reduced motion removes animated scrolling.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#carousel)

```jsx
import { Carousel, Card } from '@ride-eats/ui';

<Carousel items={cards} renderItem={card => <Card title={card.title}>{card.description}</Card>} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| items / renderItem | T[] / (item,index) => ReactNode | Content is yours. Item IDs provide stable keys. |
| label | string | Accessible carousel name. |

## Split Pane

Layout. Drag the divider to resize with elastic resistance at the bounds and a smooth release. Controlled values stay within min/max. Keyboard resizing uses the shared settling curve: arrows adjust by 2%, Shift by 10%, Home/End jump to bounds.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#split-pane)

```jsx
import { SplitPane } from '@ride-eats/ui';

const [split, setSplit] = useState(40);
<SplitPane value={split} onValueChange={setSplit} first={<p>Navigation</p>} second={<p>Workspace</p>} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| value / onValueChange | number / callback | First-panel width as a percentage. |
| min / max | number | Allowed percentages; defaults 20–80. |
| first / second / label | ReactNode / ReactNode / string | Panel content and separator name. |

## Range Slider

Inputs. Two native range handles with a shared accent track. Drag either handle or use keyboard arrows; the bounds cannot cross.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#range-slider)

```jsx
import { RangeSlider } from '@ride-eats/ui';

const [range, setRange] = useState([20,80]);
<RangeSlider label="Budget" value={range} onValueChange={setRange} formatValue={value => '$' + value} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| value / onValueChange | [number,number] / callback | Controlled minimum and maximum. |
| min / max / step | number | Bounds and native stepping. |
| label / formatValue / disabled | string / function / boolean | Label, value formatting and availability. |

## Popover

Feedback. A floating, native top-layer panel for small forms and contextual details. It positions beside its trigger, escapes clipping, and dismisses on outside click or Escape.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#popover)

```jsx
import { Popover, Button } from '@ride-eats/ui';

const [open, setOpen] = useState(false);
<Popover open={open} onOpenChange={setOpen} label="Share settings"
  trigger={props => <Button {...props}>Share settings</Button>}>
  <p>Anyone with the link can view this transfer.</p>
  <Button onClick={() => setOpen(false)}>Done</Button>
</Popover>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| open / onOpenChange | boolean / callback | Controlled native popover. |
| trigger | (buttonProps) => ReactNode | Spread the supplied ref and handlers. |
| label / children / width / align | content and placement | Dialog label, panel body, pixel width, start/end alignment. |

## Command Menu

Navigation. A workspace command palette: grouped ranked search, nested scopes, recent commands, modifier shortcuts, async execution and error recovery. The focused demo creates local drafts and filters transfers.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#command-menu)

```jsx
import { CommandMenu } from '@ride-eats/ui';

<CommandMenu open={open} onOpenChange={setOpen} shortcut items={[{value:'new',label:'New transfer',group:'Create',description:'Create a draft',shortcut:'Alt+N',onSelect:createDraft},{value:'settings',label:'Settings',group:'Navigate',items:settingsCommands}]} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| open / onOpenChange | controlled state | Open with a visible launcher or optional Ctrl/⌘K. |
| items | CommandItem[] | Unique value, label, description, group, icon, keywords, modifier shortcut, disabled, onSelect and nested items. |
| onSelect | void  /  Promise | Successful commands close the palette; rejected commands show an error and stay open. |
| label / placeholder / shortcut | configuration | Accessible scope name, search prompt and global launcher shortcut. Recent IDs stay in memory for the lifetime of this instance. |

## PIN Input

Inputs. One real input with individual visual cells, so pasting, numeric keyboards and one-time-code autofill work naturally.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#pin-input)

```jsx
import { PinInput } from '@ride-eats/ui';

const [code, setCode] = useState('');
<PinInput label="Verification code" value={code} onValueChange={setCode}
  length={6} onComplete={code => verifyCode(code)} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| value / onValueChange | string / callback | Digits only, controlled. |
| length / label / disabled | number / string / boolean | Cell count and field configuration. |
| onComplete | (code) => void | Called when a new complete code is entered. |

## Toggle Group

Inputs. A compact toolbar for one or several independent selections, with native pressed states and soft selection transitions.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#toggle-group)

```jsx
import { ToggleGroup } from '@ride-eats/ui';

const [format, setFormat] = useState(['bold']);
<ToggleGroup label="Text formatting" multiple value={format} onValueChange={setFormat}
  items={[{value:'bold',label:'Bold',icon:'bold'},{value:'italic',label:'Italic',icon:'italic'}]} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| items | {value,label,icon?,disabled?}[] | Toggle controls. |
| value / onValueChange | string / null or string[] / callback | Single or multiple selection. |
| multiple / disabled | boolean | Selection mode and availability. |

## Rating

Inputs. Drag across stars to choose a rating, preview on hover, or use native radio keyboard controls. Touch cancellation restores the previous value.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#rating)

```jsx
import { Rating } from '@ride-eats/ui';

const [rating, setRating] = useState(4);
<Rating label="How was your experience?" value={rating} onValueChange={setRating} max={5} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| value / onValueChange | number / callback | Chosen rating, 1-based. |
| max / label / readOnly | configuration | Star count, group label and display-only mode. |

## Textarea

Inputs. A compact multiline field with associated labels, hints and validation. Native textarea props remain available.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#textarea)

```jsx
import { Textarea } from '@ride-eats/ui';

<Textarea label="Description" value={description} onChange={event => setDescription(event.target.value)} hint="Keep it short and useful." />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| label / hint / error | ReactNode | Accessible label and supporting content. |
| rows / value / onChange / disabled | native textarea props | Defaults to three rows; controlled content stays yours. |

## Form

Inputs. Validation, async submit state, server errors and first-invalid-field focus in one render-prop form. The demo saves local state.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#form)

```jsx
import { Form, Field, Button } from '@ride-eats/ui';

<Form initialValues={{name:''}} validate={values => ({name:values.name ? undefined : 'Required'})} onSubmit={save}>
 {({field,errors,submitting}) => <><Field label="Name" error={errors.name}><input {...field('name')} /></Field><Button type="submit" loading={submitting}>Save</Button></>}
</Form>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| initialValues / validate | object / values => errors | Initial values and synchronous validation. |
| onSubmit | values => void  /  Promise | Errors become a visible alert; duplicate submissions are prevented. |
| children | render function | Receives values, errors, submitting, field(name), setValue(name,value), reset(). |

## Combobox

Inputs. Searchable selection with native top-layer positioning, listbox semantics and keyboard navigation.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#combobox)

```jsx
import { Combobox } from '@ride-eats/ui';

<Combobox label="Assignee" options={people} value={person} onValueChange={setPerson} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| options | {value,label,description?,disabled?}[] | Searchable choices. |
| value / onValueChange | string / callback | Controlled selected option. |
| label / placeholder / error / hint / disabled | configuration | Labels, validation and availability. |

## Date Range Picker

Inputs. Send’s custom calendar for both range endpoints, with linked bounds, circular day controls and animated opening and closing. Values stay local YYYY-MM-DD dates.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#date-range-picker)

```jsx
import { DateRangePicker } from '@ride-eats/ui';

<DateRangePicker value={range} onValueChange={setRange} label="Reporting period" />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| value / onValueChange | {start,end} / callback | ISO dates or empty strings. |
| min / max / disabled / label / locale | configuration | Shared calendar bounds and fieldset label. |

## Time Picker

Inputs. A compact custom time picker with rounded hour and minute choices, solid accent selection and keyboard navigation. Displays local time and returns HH:mm.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#time-picker)

```jsx
import { TimePicker } from '@ride-eats/ui';

<TimePicker label="Opening time" value={time} onValueChange={setTime} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| value / onValueChange | HH:mm string / callback | Controlled HH:mm value. |
| min / max / step / disabled / label | configuration | Step is seconds, rounded to whole minutes (minimum 60); defaults to one minute. |

## Upload Progress

Feedback. Compact per-file progress, status, errors, retry and cancellation. The caller owns file transfer and progress; this demo has explicit simulation controls.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#upload-progress)

```jsx
import { UploadProgress } from '@ride-eats/ui';

<UploadProgress files={uploads} onCancel={cancelUpload} onRetry={retryUpload} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| files | {id,name,status,progress?,error?}[] | Status is queued, uploading, done, error or cancelled; progress is 0–100. |
| onCancel / onRetry | id => void | Caller handles transfer cancellation and retry. |

## DataGrid

Display. A compact table with search, filters, sorting, column visibility and resizing, sticky columns, bulk actions and optional row expansion. Fixed-row virtual scrolling supports larger local datasets.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#data-grid)

```jsx
import { DataGrid } from '@ride-eats/ui';

<DataGrid rows={members} columns={[{key:'name',label:'Name',pinned:true,width:220},{key:'role',label:'Role'}]} filters={[{key:'role',label:'Role',options:roles}]} bulkActions={[{value:'export',label:'Export',onSelect:exportRows}]} renderExpanded={row => <p>{row.email}</p>} />
// For fixed-height rows: <DataGrid rows={records} columns={columns} virtual height={320} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| rows / columns / getRowKey | T[] / DataGridColumn<T>[] / function | Stable row IDs are required. Columns accept key, label, width, pinned, sortable, resizable, align, render, searchValue and sortValue. |
| filters / bulkActions | definition arrays | Exact-value filters and selected-row callbacks. |
| renderExpanded / rowActions | row => ReactNode | Optional row details and actions. |
| virtual / height / rowHeight / pageSize | boolean / number | Defaults: false / 320 / 40 / 8. Expansion disables virtualization. Virtual rows must fit the fixed height. |
| loading / error / onRetry / emptyText / label | configuration | Loading, error, retry and empty states. |

## App Shell

Layout. A reusable compact application frame with collapsible navigation, mobile dialog navigation and slots for workspace, search, notifications and account actions.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#app-shell)

```jsx
import { AppShell, WorkspaceSwitcher, NotificationCenter, Card } from '@ride-eats/ui';

<AppShell brand="Studio" items={navigation} value={view} onValueChange={setView} workspace={<WorkspaceSwitcher items={workspaces} value={workspace} onValueChange={setWorkspace} />} actions={<NotificationCenter items={notifications} />}>
  <Card title="Overview">Your application</Card>
</AppShell>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| items / value / onValueChange | navigation array / string / callback | Navigation items accept value, label, icon, count and disabled. |
| brand / workspace / search / actions / sidebarFooter / children | ReactNode slots | Supply branding, controls and actual screens. |
| collapsed / onCollapsedChange | optional controlled state | Leave unset for internal collapse state. Mobile navigation uses a native modal. |

## Workspace Switcher

Navigation. Compact workspace selection using the shared Send menu, ready for a header or app sidebar.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#workspace-switcher)

```jsx
import { WorkspaceSwitcher } from '@ride-eats/ui';

<WorkspaceSwitcher items={workspaces} value={workspace} onValueChange={setWorkspace} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| items | {value,label,description?,icon?,disabled?}[] | Caller-owned workspaces. |
| value / onValueChange / label | controlled state and label | Selection does not switch a backend session automatically. |

## Notification Center

Feedback. Unread counts, compact notification rows and caller-owned read state. No polling, push or backend is bundled.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#notification-center)

```jsx
import { NotificationCenter } from '@ride-eats/ui';

<NotificationCenter items={notifications} onRead={markRead} onReadAll={markAllRead} onSelect={openNotification} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| items | {id,title,description?,time?,read?,icon?}[] | Notification content and read state. |
| onRead / onReadAll / onSelect / label | callbacks / string | Caller handles persistence and routing. |

## Bottom Sheet

Feedback. A compact native modal sheet. Drag the handle or header down to dismiss; short pulls smoothly return, press the handle, use Close, or press Escape. It keeps the real dialog mounted through exits.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#bottom-sheet)

```jsx
import { BottomSheet, Button } from '@ride-eats/ui';

<BottomSheet open={open} onClose={() => setOpen(false)} title="Transfer settings" footer={<Button variant="primary" onClick={save}>Save changes</Button>}>
  Your settings
</BottomSheet>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| open / onClose | controlled state | Keep mounted for animated exits and focus restoration. |
| title / children / footer | ReactNode | Accessible heading, content and actions. |
| height | number  /  CSS length | Fits content by default. Pass a height for a larger sheet; viewport limits and body scrolling remain active. |

## Context Menu

Actions. Right-click or use Shift+F10 to open compact contextual actions. Nested choices, disabled actions, keyboard movement and Escape are supported.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#context-menu)

```jsx
import { ContextMenu, Card } from '@ride-eats/ui';

<ContextMenu items={[{value:'open',label:'Open',onSelect:openFile},{value:'sort',label:'Sort',items:[{value:'newest',label:'Newest',onSelect:sortNewest}]}]}>
  <Card title="Project files" />
</ContextMenu>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| items | ContextMenuItem[] | value, label, icon, disabled, destructive, separator, onSelect and nested items. |
| children / label | ReactNode / string | Context target and accessible action name. |

## Nested Popovers

Recipes. Native top-layer popovers can hold a second popover without clipping into surrounding cards. Dismissal follows the nested hierarchy.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#nested-popovers)

```jsx
import { Popover, Button } from '@ride-eats/ui';

<Popover open={open} onOpenChange={setOpen} label="Share" trigger={props => <Button {...props}>Share</Button>}>
 <Popover open={details} onOpenChange={setDetails} label="Access" trigger={props => <Button {...props}>Access</Button>}>Access settings</Popover>
</Popover>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| open / onOpenChange / trigger | controlled state / render prop | Each popover owns its open state. |
| label / children / align / width | configuration | Same Popover API; native hierarchy handles outside dismissal. |

## Settings Panel

Layout. Compact settings sections with labels, descriptions, control slots and footer actions. Compose real inputs rather than rebuilding layout CSS.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#settings-panel)

```jsx
import { SettingsPanel, Field, Button } from '@ride-eats/ui';

<SettingsPanel title="Workspace settings" sections={[{id:'general',title:'General',description:'Your workspace identity.',children:<Field label="Name"><input value={name} onChange={event => setName(event.target.value)} /></Field>}]} actions={<Button onClick={save}>Save</Button>} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| title / description | ReactNode | Panel heading. |
| sections | {id,title,icon?,description?,children}[] | Rounded sections, optional icons and caller-owned controls. |
| actions | ReactNode | Compact footer actions. |

## Team Directory

Workflows. A complete member table with optional invitation form, editable roles and confirmed removal. All changes are caller-owned callbacks; this demo stores changes locally.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#team-directory)

```jsx
import { TeamDirectory } from '@ride-eats/ui';

<TeamDirectory members={members} onInvite={inviteMember} onRoleChange={changeRole} onRemove={removeMember} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| members | {id,name,email,role,status?}[] | Caller-owned member records. |
| onInvite / onRoleChange / onRemove | optional async callbacks | Missing callbacks omit those controls. Rejected promises show errors. |
| roles | string[] | Defaults to Owner, Editor, Viewer. Use UIProvider for confirmations and toasts. |

## File Manager

Workflows. A compact file table with native multi-file selection, opening, selected-file download and confirmed deletion. Transfer and storage remain in your application.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#file-manager)

```jsx
import { FileManager } from '@ride-eats/ui';

<FileManager files={files} onUpload={uploadFiles} onOpen={openFile} onDownload={downloadFiles} onDelete={deleteFile} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| files | {id,name,type?,size?,owner?,updated?}[] | type is file or folder. Display sizes and dates are caller formatted. |
| onUpload / onOpen / onDownload / onDelete | optional callbacks | Upload receives native File[]. Download receives selected records. Use UIProvider for confirmations. |

## Support Inbox

Workflows. Conversation list, selected thread and reply composer in one responsive workflow. Reply promises control pending and error states; the caller appends persisted messages.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#support-inbox)

```jsx
import { SupportInbox } from '@ride-eats/ui';

<SupportInbox threads={threads} value={threadId} onValueChange={setThreadId} onReply={sendReply} />
```

| Prop | Type | Purpose |
| --- | --- | --- |
| threads | SupportThread[] | id, name, subject, status, time and messages; messages contain id, author, text, time and own. |
| value / onValueChange | string / callback | Selected conversation ID. |
| onReply / label | (id,text) => Promise  /  void / string | Optional reply callback; controls are omitted without it. Drafts are retained per conversation during the mounted session. Search filters names and subjects. |

## Sticky Bar

Layout. Tools’ automatic floating page controls. Scroll depth progressively fades the content beneath without blur while controls remain sharp. The header offset is measured automatically when used with Header.

[Live example](https://iamresvevo.github.io/ride-eats-ui/#sticky-bar)

```jsx
import { StickyBar, Tabs } from '@ride-eats/ui';

<StickyBar><Tabs items={tabs} value={tab} onValueChange={setTab} /></StickyBar>
```

| Prop | Type | Purpose |
| --- | --- | --- |
| children | ReactNode | Tabs, chips, search or action controls. |
| offset | number  /  CSS length | Defaults to the nearest inherited --header-height. Set 0 for an independent scroll container. |
| fade | boolean | Progressive neutral fade, enabled by default. No blur effects. |
| label / className / style | styling and accessibility | The parent defines the sticky scroll boundary; use a labelled scroll region for keyboard scrolling. |
