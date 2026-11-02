# Implementation first

## Start a working app

```sh
git clone https://github.com/iamresvevo/ride-eats-ui.git
cp -R ride-eats-ui/examples/starter my-platform
cd my-platform
npm install
npm run dev
```

The starter is a complete React/Vite app. Search, sorting, row selection, folder creation, stacked discard confirmation and toasts all work with local state. Replace its callbacks with your own API; you do not need a UI-specific backend.

## Install in an existing app

```sh
npm install github:iamresvevo/ride-eats-ui#v0.9.0
```

```jsx
import { UIProvider } from "@ride-eats/ui";
import "@ride-eats/ui/styles.css";
import "./your-overrides.css";

export default function App() {
  return (
    <UIProvider defaultTheme="system" accent="#1fa476">
      <YourApp />
    </UIProvider>
  );
}
```

React 19+ and a JSX-capable bundler are required. For Next.js use a client wrapper and `transpilePackages: ['@ride-eats/ui']`. Native `<dialog>` and modern SVG/CSS are browser features used by this kit.

## The common API rules

- **State is yours.** Tabs, Select, Slider and RadioGroup use `value` / `onValueChange`; Checkbox uses `checked` / `onCheckedChange`. Send's Switch and DateTimePicker preserve `onChange`.
- **Content is composition.** Card, Dialog, Drawer, Alert, Tile and PageHeader accept children or explicit slots. Use the compound card parts when you need a different structure.
- **Styling is yours.** Use tokens, `className`, and `style` where exposed. Native Button props pass through. Fields accept your actual input element rather than another form-state system.
- **Tables take your rows.** DataTable does not fetch or reorder data. `columns[].render(value,row)` supplies custom cells, `rowActions(row)` supplies actions, and selection/sort callbacks connect to client or server state. Compose Toolbar and Pagination around it.
- **Feedback is one provider.** UIProvider combines theme, toasts, async confirmations and tooltips. Do not nest another ToastProvider unless you intentionally want an isolated feedback scope.
- **Cancel is a workflow.** Keep the original Dialog open while awaiting `useConfirm()`. Close the original only after confirmation returns true. The lower sheet stays mounted and inert, preserving fields and focus.
- **Icons are one API.** Use `<Icon name="headset" />`, with optional size, stroke, color and motion. IconProvider registers your custom SVG contents under your own names. Large icon groups load on demand.

## Card composition

```jsx
<Card title="Storage" description="A shared view of your workspace."
  action={<Button size="sm">Manage</Button>}
  footer={<Button variant="primary">Save changes</Button>}>
  <YourContent />
</Card>

<Card variant="soft" padding="sm">
  <CardHeader title="Storage" />
  <CardBody><YourContent /></CardBody>
  <CardFooter><YourActions /></CardFooter>
</Card>
```

## Dashboard metrics and tiles

```jsx
<MetricGrid minWidth={180}>
  <StatCard label="Payments" value="153" hint="1 open" />
  <StatCard label="Paid" value="5" tone="good" />
  <StatCard label="Downloads" value="1,284" trend="+12.8%"
    chart={[12,18,15,30,24,40,48,52]} />
</MetricGrid>
<Tile icon="files" title="Transfers" description="Everything you have shared."
  href="/transfers" meta="24 files" footer="View transfers" />
```

## Stacked discard confirmation

```jsx
const confirm = useConfirm();
const [open, setOpen] = useState(false);
const [name, setName] = useState("");
const requestClose = async () => {
  if (
    !name ||
    (await confirm({
      title: "Discard changes?",
      message: "Your draft has not been saved.",
      cancelLabel: "Keep editing",
      confirmLabel: "Discard changes",
      danger: true,
    }))
  )
    setOpen(false);
};

<Dialog
  open={open}
  onOpenChange={requestClose}
  title="Create folder"
  footer={<Button onClick={requestClose}>Cancel</Button>}
>
  <Field label="Name">
    <input value={name} onChange={(e) => setName(e.target.value)} />
  </Field>
</Dialog>;
```

Alternatively, use `beforeClose={async () => await confirm(options)}` to guard built-in Escape/backdrop/close-button dismissal. Changes to the external `open` prop are always controlled by your application; no component can intercept your own `setOpen(false)` call.

## Motion and limits

Tabs and Segmented use Send's measured moving selection surface. Menus retain inline subgroup motion. Dialogs use a shared first backdrop and depth transitions; drawers use the same native stack. Toasts use Send's bounded depth stack, with repeated string messages merged and at most three visible by default. `maxVisible` is configurable on ToastProvider, and `duration`/`id` are per message. Reduced motion is honored.

This is a substantial **web application UI foundation**, not every possible platform feature. Rich text editing, maps, full calendar scheduling, virtualization and domain-specific workflows are not included. Extend the components through props, slots, native elements and your own application code instead of assuming those systems exist.

## Swipe action tones

Use `tone: "info"` for blue, `warning` for amber, `accent` for the brand green, or `neutral` for a quiet action. Set `destructive: true` for red destructive actions. For example: `<SwipeActions actions={[{value:'archive',label:'Archive',icon:'archive',tone:'info',onSelect:archive}]}>{row}</SwipeActions>`. Action colors use the overridable `--action-info`, `--action-warning`, `--action-danger`, and `--action-on-color` tokens. Neutral surfaces retain the shared rounded shape tokens.

## Design and motion

The library follows Send/Tools: pill actions, circular compact controls, rounded content panels and solid accents. Supporting surfaces are neutral rather than translucent green. `--motion-ease` uses Send's soft settling curve `cubic-bezier(.25,1,.3,1)`; transitions share it, while spinners remain linear. BottomSheet enters from the bottom edge over 420ms and exits downward over 300ms. Reduced motion uses a short fade.

The implementation workbench follows the primary example and uses Accordion, Card, Field, NumberInput, Switch, Button and CopyButton from the kit. Its copyable JSX includes data, state and callbacks matching the preview.

## Automatic floating controls

```jsx
<Header brand={brand} items={navigation} activeValue={page} onNavigate={setPage} />
<main>
  <PageHeader title="Payments" />
  <StickyBar>
    <Tabs items={tabs} value={tab} onValueChange={setTab} />
  </StickyBar>
  <DataGrid rows={rows} columns={columns} />
</main>
```

StickyBar follows Tools' sentinel behavior, discovers the nearest scroll container, and inherits Header's measured `--header-height` from their shared ancestor. Content scrolls beneath sharp controls with a scroll-driven neutral fade and layered 2/6/12px backdrop blur. Use `offset={0}` inside an independent scroll area, `blur={false}` for fade only, or `fade={false}` for no overlay. Keep it in the content parent whose boundary should stop it. Header also applies its progressive neutral fade/blur as scrolling begins. Blur support depends on the browser; the neutral gradient is the fallback.

### One accent, including overlays

Use `<UIProvider accent="#1fa476">` once at the application root. The root tokens reach body-level popovers, calendars and feedback. Hex values get a contrasting black/white foreground; `accentForeground` overrides it. Primary actions use the solid accent, navigation retains neutral selection pills, and semantic danger/status colors stay separate.

SettingsPanel supports optional section `icon` values. SupportInbox retains drafts per thread for its mounted session and filters conversations locally by name/subject. DataGrid accepts `toolbarActions` for upload/create controls and reserves 36px selection/expansion columns.
