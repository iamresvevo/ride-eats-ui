const entry = (
  id,
  name,
  group,
  description,
  code,
  props,
  imports = name === "PIN Input" ? "PinInput" : name.replaceAll(" ", ""),
) => ({
  id,
  name,
  group,
  description,
  detail: description,
  code,
  props,
  imports,
});
export const collectionPages = [
  entry(
    "icons",
    "Icon Library",
    "Display",
    "2,015 canonical Lucide glyphs and 277 compatibility names plus Send’s own glyphs. Search by name or purpose, adjust size and stroke, preview motion, and copy the exact React code.",
    `<Icon name="headset" size={24} strokeWidth={1.7} />
<Icon name="loader-circle" motion="spin" animateOn="always" />
<Icon name="check" motion="draw" />

// Your own brand glyphs fit the same API:
<IconProvider icons={{ brand: <path d="M4 12 12 4l8 8-8 8Z" /> }}>
  <Icon name="brand" size={32} />
</IconProvider>`,
    [
      ["name", "string", "Catalog slug or a registered custom name."],
      [
        "size / strokeWidth / color",
        "number / number / string",
        "SVG size, stroke and color; defaults preserve Send control sizing.",
      ],
      [
        "motion",
        "auto | none | draw",
        "Opt-in movement; honors reduced motion.",
      ],
      ["animateOn", "hover | always", "Hover/focus or continuous animation."],
      [
        "label / title",
        "string",
        "Accessible meaning for nondecorative icons.",
      ],
      [
        "IconProvider.icons",
        "Record<string,ReactNode>",
        "Register custom SVG contents or override catalog names.",
      ],
    ],
    "Icon, IconProvider",
  ),
  entry(
    "data-table",
    "Data Table",
    "Display",
    "A real working table: custom cells, sortable columns, selection, row actions, loading and empty states. Keep data fetching and sorting in your application.",
    `const [sort, setSort] = useState({ key: 'name', direction: 'asc' });\nconst [selected, setSelected] = useState([]);\nconst rows = [...people].sort((a, b) =>\n  String(a[sort.key]).localeCompare(String(b[sort.key])) * (sort.direction === 'asc' ? 1 : -1)\n);\n\n<DataTable\n  caption="Team members" rows={rows} rowKey="id"\n  columns={[\n    { key: 'name', label: 'Name', sortable: true },\n    { key: 'email', label: 'Email' },\n    { key: 'status', label: 'Status', render: value => <Badge tone="good">{value}</Badge> },\n  ]}\n  sort={sort} onSortChange={setSort}\n  selectedKeys={selected} onSelectionChange={setSelected}\n  rowActions={row => <Button size="sm" onClick={() => openProfile(row)}>View</Button>}\n/>`,
    [
      [
        "columns",
        "Column[]",
        "key, label, render(value,row), sortable, width, align.",
      ],
      [
        "rows / rowKey",
        "T[] / key or function",
        "Your records and stable identifiers.",
      ],
      [
        "sort / onSortChange",
        "Sort / callback",
        "Controlled sort; your app orders/fetches rows.",
      ],
      [
        "selectedKeys / onSelectionChange",
        "Key[] / callback",
        "Optional selection with select-all and indeterminate state.",
      ],
      [
        "rowActions / onRowClick",
        "render / callback",
        "Custom actions or accessible first-cell button.",
      ],
      [
        "loading / emptyContent / caption",
        "boolean / ReactNode",
        "Status and semantic table context.",
      ],
      [
        "className / style / density",
        "styling hooks",
        "compact or comfortable rows.",
      ],
    ],
    "DataTable, Badge, Button",
  ),
  entry(
    "stacked-dialogs",
    "Stacked Dialogs",
    "Recipes",
    "Keep the form mounted while a confirmation opens above it. One backdrop, depth transitions, focus restoration and a preserved draft.",
    `const confirm = useConfirm();\nconst [open, setOpen] = useState(false);\nconst [name, setName] = useState('');\nconst requestClose = async () => {\n  const discard = !name || await confirm({\n    title: 'Discard changes?', message: 'Your draft has not been saved.',\n    confirmLabel: 'Discard changes', cancelLabel: 'Keep editing', danger: true,\n  });\n  if (discard) setOpen(false);\n};\n\n<Button onClick={() => setOpen(true)}>Create folder</Button>\n<Dialog open={open} onOpenChange={requestClose} title="Create folder"\n  footer={<Button onClick={requestClose}>Cancel</Button>}>\n  <Field label="Folder name"><input value={name} onChange={e => setName(e.target.value)} /></Field>\n</Dialog>\n// Wrap your app in UIProvider once.`,
    [
      [
        "useConfirm()",
        "(options) => Promise<boolean>",
        "title, message, confirmLabel, cancelLabel and danger.",
      ],
      [
        "Dialog.beforeClose",
        "() => boolean | Promise<boolean>",
        "Optional dismissal guard; external open state remains yours.",
      ],
      [
        "Native stack",
        "automatic",
        "Underlying form is inert, scaled and preserved; only the first backdrop dims.",
      ],
    ],
    "Button, Dialog, Field, useConfirm",
  ),
  entry(
    "accordion",
    "Accordion",
    "Layout",
    "Quiet disclosure rows with an animated height, rotating chevrons and controlled state.",
    `const [open, setOpen] = useState('delivery');\n<Accordion value={open} onValueChange={setOpen} items={[\n  { value: 'delivery', title: 'How does delivery work?', content: 'Your recipient gets a secure download link.' },\n  { value: 'expiry', title: 'Can I change the expiry?', content: 'Choose a date in transfer settings.' },\n]} />`,
    [
      [
        "items",
        "{value,title,content,icon?}[]",
        "Content and optional row icons.",
      ],
      [
        "value / onValueChange",
        "string | null / callback",
        "Open item or null.",
      ],
      ["className / style", "styling hooks", "Customize the outer layout."],
    ],
  ),
  entry(
    "alert",
    "Alert",
    "Feedback",
    "An inline message with a small status mark, optional action and dismissal.",
    `<Alert tone="good" title="Your files are ready"\n  onDismiss={() => setVisible(false)}\n  action={<Button size="sm" onClick={openTransfer}>View transfer</Button>}>\n  A secure link is ready to share with your team.\n</Alert>`,
    [
      [
        "tone",
        "neutral | good | bad",
        "Semantic styling and alert/status role.",
      ],
      [
        "title / children / action",
        "ReactNode",
        "Message, detail and optional action.",
      ],
      ["onDismiss", "() => void", "Optional dismissal control."],
    ],
    "Alert, Button",
  ),
  entry(
    "checkbox",
    "Checkbox",
    "Inputs",
    "A compact check with a soft scale transition, a real native input and indeterminate support.",
    `const files = [{ id: 'brief', name: 'Campaign brief.pdf' }, { id: 'assets', name: 'Brand assets.zip' }];
const [selected, setSelected] = useState(['brief']);
const all = selected.length === files.length;
const mixed = selected.length > 0 && !all;

<Checkbox label="Select all files" checked={all} indeterminate={mixed}
  onCheckedChange={checked => setSelected(checked ? files.map(file => file.id) : [])} />
{files.map(file => <Checkbox key={file.id} label={file.name}
  checked={selected.includes(file.id)}
  onCheckedChange={checked => setSelected(current => checked
    ? [...current, file.id] : current.filter(id => id !== file.id))} />)}`,
    [
      [
        "checked / onCheckedChange",
        "boolean / callback",
        "Controlled native checkbox.",
      ],
      ["label / hint", "ReactNode", "Label and explanation."],
      ["indeterminate / disabled", "boolean", "Mixed state and availability."],
    ],
  ),
  entry(
    "radio-group",
    "Radio Group",
    "Inputs",
    "Selectable option rows with a quiet border, animated dot and supporting text.",
    `const [access, setAccess] = useState('private');\n<RadioGroup label="Who can access this?" value={access} onValueChange={setAccess}\n  options={[\n    { value: 'private', label: 'Only invited people', description: 'A private space for your team.' },\n    { value: 'public', label: 'Anyone with the link', description: 'Easy to share, no account needed.' },\n  ]} />`,
    [
      [
        "options",
        "Option[]",
        "value, label, description, trailing and disabled.",
      ],
      [
        "value / onValueChange",
        "string / callback",
        "Native radio behavior, controlled state.",
      ],
      [
        "label / name / disabled",
        "string / boolean",
        "Group context and form identity.",
      ],
    ],
    "RadioGroup",
  ),
  entry(
    "slider",
    "Slider",
    "Inputs",
    "A smooth value track with a precise native range input and a readable live value.",
    `const [volume, setVolume] = useState(64);\n<Slider label="Volume" value={volume} onValueChange={setVolume}\n  min={0} max={100} step={1} formatValue={value => value + '%'} />`,
    [
      ["value / onValueChange", "number / callback", "Controlled value."],
      ["min / max / step", "number", "Native range bounds."],
      [
        "formatValue",
        "(value) => string",
        "Visible and accessible value text.",
      ],
    ],
  ),
  entry(
    "progress",
    "Progress",
    "Feedback",
    "A measured progress bar with a soft fill transition, or a restrained indeterminate state.",
    `const [progress, setProgress] = useState(64);\n<Progress label="Uploading campaign assets" value={progress} hint="6.4 MB of 10 MB" />\n<Button onClick={() => setProgress(value => Math.min(100, value + 12))}>Advance</Button>`,
    [
      ["value / max", "number", "Current and maximum values."],
      ["label / hint", "string", "Task and supporting context."],
      [
        "indeterminate",
        "boolean",
        "Unknown duration with reduced-motion fallback.",
      ],
    ],
    "Progress, Button",
  ),
  entry(
    "password-input",
    "Password Input",
    "Inputs",
    "A labeled password field with an integrated reveal control and native input props.",
    `<PasswordInput label="Password" placeholder="Enter your password"\n  autoComplete="current-password" value={password}\n  onChange={e => setPassword(e.target.value)}\n  hint="Use at least 12 characters." />`,
    [
      ["label / hint", "ReactNode", "Field context."],
      [
        "...inputProps",
        "native input attributes",
        "value, onChange, name, required, disabled, autoComplete.",
      ],
    ],
    "PasswordInput",
  ),
  entry(
    "number-input",
    "Number Input",
    "Inputs",
    "Increment and decrement controls around a directly editable number.",
    `const [quantity, setQuantity] = useState(2);\n<NumberInput label="Copies" value={quantity} onValueChange={setQuantity} min={1} max={20} />`,
    [
      ["value / onValueChange", "number / callback", "Controlled quantity."],
      ["min / max / step", "number", "Bounds and increment."],
      ["label / disabled", "string / boolean", "Field name and availability."],
    ],
  ),
  entry(
    "breadcrumbs",
    "Breadcrumbs",
    "Navigation",
    "A compact path through the app, with a clear current page and real links.",
    `<Breadcrumbs items={[\n  { label: 'Workspace', href: '/' },\n  { label: 'Transfers', href: '/transfers' },\n  { label: 'Campaign assets' },\n]} />`,
    [
      ["items", "{label,href?}[]", "Last item is the current page."],
      ["label", "string", "Accessible navigation name."],
    ],
  ),
  entry(
    "avatar-group",
    "Avatar Group",
    "Display",
    "Overlapping team identities with a measured hover lift and overflow count.",
    `<AvatarGroup max={4} people={[\n  { id: 'alex', name: 'Alex Rivera', src: '/alex.jpg' },\n  { id: 'sam', name: 'Sam Chen' },\n  { id: 'jordan', name: 'Jordan Lee' },\n]} />`,
    [
      ["people", "{id?,name,src?}[]", "Images fall back to initials."],
      ["max", "number", "Visible identities before +N."],
      ["label", "string", "Group accessible name."],
    ],
  ),
  entry(
    "copy-button",
    "Copy Button",
    "Actions",
    "Copy a value, then show a quiet checked confirmation. Failures stay visible.",
    `<CopyButton value="https://example.com/shared/abc" label="Copy link"\n  copiedLabel="Link copied" onCopy={() => console.log('Copied')} />`,
    [
      ["value", "string", "Clipboard text."],
      ["label / copiedLabel", "string", "Idle and confirmed labels."],
      ["onCopy / onError", "callbacks", "Optional integration events."],
    ],
  ),
  entry(
    "file-dropzone",
    "File Dropzone",
    "Inputs",
    "A compact upload target with drag feedback, keyboard selection, size checks and file-type validation. Your app handles uploading.",
    `<FileDropzone accept="image/*,.pdf" maxSize={10 * 1024 * 1024} multiple\n  onFiles={files => setFiles(files)}\n  label="Drop your files here" description="or browse from your device" />`,
    [
      [
        "onFiles",
        "(files: File[]) => void",
        "Validated files; upload with your own API.",
      ],
      [
        "accept / multiple / maxSize",
        "string / boolean / bytes",
        "Type, count and size constraints.",
      ],
      ["label / description / disabled", "props", "Content and availability."],
    ],
  ),
  entry(
    "timeline",
    "Timeline",
    "Display",
    "A compact activity trail, connected with fine lines and familiar Send icons.",
    `<Timeline items={[\n  { id: 1, title: 'Transfer created', time: 'Just now', icon: 'plus' },\n  { id: 2, title: 'Files uploaded', description: '12 files · 48 MB', time: '2 minutes ago', icon: 'upload' },\n  { id: 3, title: 'Delivered to Alex', time: '5 minutes ago', icon: 'check', tone: 'good' },\n]} />`,
    [
      [
        "items",
        "TimelineItem[]",
        "title, description, time, dateTime, icon and tone.",
      ],
      ["label", "string", "Accessible activity-list name."],
    ],
  ),
  entry(
    "drawer",
    "Drawer",
    "Layout",
    "A side panel built on the same native modal stack: smooth entry, focus management and Escape.",
    `const [open, setOpen] = useState(false);\n<Button onClick={() => setOpen(true)}>View details</Button>\n<Drawer open={open} onOpenChange={setOpen} title="Transfer details"\n  footer={<Button onClick={() => setOpen(false)}>Done</Button>}>\n  <p>Campaign assets · 12 files · 48 MB</p>\n</Drawer>`,
    [
      ["open / onOpenChange", "boolean / callback", "Controlled visibility."],
      ["title / children / footer", "ReactNode", "Panel structure."],
      ["side", "right | left", "Slide-in direction."],
    ],
    "Drawer, Button",
  ),
  entry(
    "stat-cards",
    "Stat Cards",
    "Display",
    "The Tools dashboard metrics, with default, compact, inline and hero layouts. Optional sparklines, trends and progress.",
    `<MetricGrid minWidth={180}>\n  <StatCard label="Payments" value="153" hint="1 open" />\n  <StatCard label="Paid" value="5" hint="Available from Drop 1" tone="good" />\n  <StatCard label="Scenarios passed" value="44 / 48" progress={92} />\n  <StatCard label="Avg. response" value="1400 ms" hint="300 calls · 6 errors" />\n</MetricGrid>\n<StatCard variant="compact" label="Downloads" value="1,284" trend="+12.8%"\n  chart={[12,18,15,30,24,40,48,52]} />`,
    [
      ["label / value / hint", "ReactNode", "Metric hierarchy."],
      [
        "variant",
        "default | compact | inline | hero",
        "Surface and type scale.",
      ],
      [
        "chart / trend / progress",
        "number[] / text / percentage",
        "Optional secondary data.",
      ],
      [
        "tone / icon",
        "semantic tone / icon name",
        "Meaning and visual context.",
      ],
      [
        "className / style / ...props",
        "section attributes",
        "App-specific layout.",
      ],
    ],
    "MetricGrid, StatCard",
  ),
  entry(
    "tiles",
    "Tiles",
    "Layout",
    "The Tools launcher shape: a contained icon, a clear name, a short explanation and a natural next step.",
    `<MetricGrid minWidth={220}>\n  <Tile icon="files" title="My transfers" description="Everything you have shared."\n    meta="24 files" href="/transfers" footer="View transfers" />\n  <Tile icon="team" title="Team workspace" description="Share a space with your people."\n    onClick={() => setTeamOpen(true)} footer="Open workspace" />\n</MetricGrid>`,
    [
      [
        "title / description / meta / footer",
        "ReactNode",
        "Tile content and supporting context.",
      ],
      ["icon / image", "name / image URL", "Visual identity."],
      [
        "href / onClick",
        "link / callback",
        "Choose link, button or static article semantics.",
      ],
      [
        "disabled / className / ...props",
        "customization",
        "Interaction and layout.",
      ],
    ],
    "Tile, MetricGrid",
  ),
  entry(
    "page-header",
    "Page Header",
    "Layout",
    "Tools-style page titles with an app icon, context, description and natural-size actions.",
    `<PageHeader title="Payments" icon="storage" description="Shared across your admin devices."\n  actions={<Button onClick={refresh}>Check connection</Button>} />`,
    [
      ["title / description / eyebrow", "ReactNode", "Page hierarchy."],
      ["icon / image", "icon name / URL", "Optional app identity."],
      [
        "actions / children",
        "ReactNode",
        "Natural-size controls and additional content.",
      ],
    ],
    "PageHeader, Button",
  ),
  entry(
    "dashboard",
    "Dashboard Layout",
    "Recipes",
    "Compose a working screen from page headers, metric cards, tabs, tool tiles and tables. The same building blocks as Tools.",
    `<div className="stack">\n  <PageHeader title="Payments" icon="storage" description="Shared across admin devices." />\n  <MetricGrid>\n    <StatCard label="Payments" value="153" hint="1 open" />\n    <StatCard label="Paid" value="5" tone="good" />\n    <StatCard label="Scenarios passed" value="44 / 48" progress={92} />\n  </MetricGrid>\n  <Tabs value={tab} onValueChange={setTab} items={tabs} />\n  <Card title="Recent payments" description="A shared view of the latest activity.">\n    <DataTable columns={columns} rows={payments} />\n  </Card>\n</div>`,
    [
      [
        "Composition",
        "children and slots",
        "No additional provider or dashboard-specific state.",
      ],
      [
        "MetricGrid.minWidth",
        "number",
        "Responsive minimum card width in pixels.",
      ],
      [
        "Card",
        "title,description,action,footer,variant,padding",
        "High-level API or compound CardHeader/Body/Footer.",
      ],
    ],
    "PageHeader,MetricGrid,StatCard,Tabs,Card,DataTable",
  ),
];
