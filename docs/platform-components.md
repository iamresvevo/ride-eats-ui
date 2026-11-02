# Platform component reference

See [implementation](implementation.md) for a complete starter and integration rules. Every component is exported from `@ride-eats/ui`.

## Animated Icons

Ten purpose-built SVG motions: a ringing bell, beating heart, drawing check, moving upload/download arrows, searching lens, refreshing arrows, adjusting sliders, opening folder and flying send glyph. Hover, click, or replay the collection.

```jsx
import { AnimatedIcon, Button } from '@ride-eats/ui';

<AnimatedIcon name="bell" size={28} />
<AnimatedIcon name="check" playing />
<AnimatedIcon name="refresh" playing loop />
// Hover/focus on a parent button also triggers the icon.
<Button><AnimatedIcon name="send" /> Send files</Button>
```

| Prop                       | Type                                                                                   | Purpose                                            |
| -------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------- |
| name                       | bell / heart / check / upload / download / search / refresh / settings / folder / send | A motion designed for that glyph.                  |
| playing / loop             | boolean                                                                                | Play explicitly or repeat. Hover/focus also plays. |
| size / strokeWidth / label | number / number / string                                                               | SVG appearance and accessibility.                  |

## Popover

A floating, native top-layer panel for small forms and contextual details. It positions beside its trigger, escapes clipping, and dismisses on outside click or Escape.

```jsx
import { useState } from "react";
import { Popover, Button } from "@ride-eats/ui";

const [open, setOpen] = useState(false);
<Popover
  open={open}
  onOpenChange={setOpen}
  label="Share settings"
  trigger={(props) => <Button {...props}>Share settings</Button>}
>
  <p>Anyone with the link can view this transfer.</p>
  <Button onClick={() => setOpen(false)}>Done</Button>
</Popover>;
```

| Prop                             | Type                       | Purpose                                                     |
| -------------------------------- | -------------------------- | ----------------------------------------------------------- |
| open / onOpenChange              | boolean / callback         | Controlled native popover.                                  |
| trigger                          | (buttonProps) => ReactNode | Spread the supplied ref and handlers.                       |
| label / children / width / align | content and placement      | Dialog label, panel body, pixel width, start/end alignment. |

## Command Menu

Keyboard-first actions with filtering, arrow navigation and a native dialog. Enable the optional Ctrl/⌘K shortcut for a global launcher.

```jsx
import { useState } from 'react';
import { CommandMenu, Button } from '@ride-eats/ui';

const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Quick actions</Button>
<CommandMenu open={open} onOpenChange={setOpen} shortcut
  items={[
    { value:'new',label:'New transfer',icon:'plus',onSelect:createTransfer },
    { value:'team',label:'Open team',icon:'team',keywords:'people members',onSelect:openTeam },
  ]} />
```

| Prop                | Type               | Purpose                                                        |
| ------------------- | ------------------ | -------------------------------------------------------------- |
| open / onOpenChange | boolean / callback | Controlled launcher.                                           |
| items               | CommandItem[]      | value, label, icon, keywords, shortcut, disabled and onSelect. |
| shortcut            | boolean            | Optionally register Ctrl/⌘K.                                   |

## Collapsible

One expandable section, with a rotating chevron and animated content height. Use it for optional settings and extra details.

```jsx
import { useState } from "react";
import { Collapsible } from "@ride-eats/ui";

const [open, setOpen] = useState(false);
<Collapsible title="Advanced settings" open={open} onOpenChange={setOpen}>
  <YourSettings />
</Collapsible>;
```

| Prop                | Type               | Purpose              |
| ------------------- | ------------------ | -------------------- |
| open / onOpenChange | boolean / callback | Expanded state.      |
| title / children    | ReactNode          | Trigger and content. |

## Steps

A compact wizard progress rail with completed, current and upcoming steps. Supports horizontal or vertical layouts and optional step navigation.

```jsx
import { useState } from "react";
import { Steps } from "@ride-eats/ui";

const [step, setStep] = useState("details");
<Steps
  value={step}
  onValueChange={setStep}
  items={[
    { value: "details", label: "Details", description: "Name your transfer" },
    { value: "files", label: "Files", description: "Choose what to share" },
    { value: "review", label: "Review", description: "Ready to send" },
  ]}
/>;
```

| Prop                  | Type                         | Purpose                               |
| --------------------- | ---------------------------- | ------------------------------------- |
| items                 | {value,label,description?}[] | Ordered steps.                        |
| value / onValueChange | string / optional callback   | Current step and optional navigation. |
| orientation           | horizontal / vertical        | Layout direction.                     |

## PIN Input

One real input with individual visual cells, so pasting, numeric keyboards and one-time-code autofill work naturally.

```jsx
import { useState } from "react";
import { PinInput } from "@ride-eats/ui";

const [code, setCode] = useState("");
<PinInput
  label="Verification code"
  value={code}
  onValueChange={setCode}
  length={6}
  onComplete={(code) => verifyCode(code)}
/>;
```

| Prop                      | Type                      | Purpose                                     |
| ------------------------- | ------------------------- | ------------------------------------------- |
| value / onValueChange     | string / callback         | Digits only, controlled.                    |
| length / label / disabled | number / string / boolean | Cell count and field configuration.         |
| onComplete                | (code) => void            | Called when a new complete code is entered. |

## Toggle Group

A compact toolbar for one or several independent selections, with native pressed states and soft selection transitions.

```jsx
import { useState } from "react";
import { ToggleGroup } from "@ride-eats/ui";

const [format, setFormat] = useState(["bold"]);
<ToggleGroup
  label="Text formatting"
  multiple
  value={format}
  onValueChange={setFormat}
  items={[
    { value: "bold", label: "Bold", icon: "bold" },
    { value: "italic", label: "Italic", icon: "italic" },
  ]}
/>;
```

| Prop                  | Type                                 | Purpose                          |
| --------------------- | ------------------------------------ | -------------------------------- |
| items                 | {value,label,icon?,disabled?}[]      | Toggle controls.                 |
| value / onValueChange | string / null or string[] / callback | Single or multiple selection.    |
| multiple / disabled   | boolean                              | Selection mode and availability. |

## Rating

A small, keyboard-accessible star rating with native radio behavior and a restrained hover lift.

```jsx
import { useState } from "react";
import { Rating } from "@ride-eats/ui";

const [rating, setRating] = useState(4);
<Rating
  label="How was your experience?"
  value={rating}
  onValueChange={setRating}
  max={5}
/>;
```

| Prop                   | Type              | Purpose                                        |
| ---------------------- | ----------------- | ---------------------------------------------- |
| value / onValueChange  | number / callback | Chosen rating, 1-based.                        |
| max / label / readOnly | configuration     | Star count, group label and display-only mode. |

## Scroll Area

A contained, keyboard-scrollable region with a sticky header for search, filters or section labels.

```jsx
import { ScrollArea } from "@ride-eats/ui";

<ScrollArea
  height={240}
  label="Team members"
  header={
    <input
      type="search"
      placeholder="Find a member…"
      aria-label="Find a member"
    />
  }
>
  {members.map((member) => (
    <YourRow key={member.id} member={member} />
  ))}
</ScrollArea>;
```

| Prop                      | Type                      | Purpose                              |
| ------------------------- | ------------------------- | ------------------------------------ |
| height                    | number or CSS length      | Maximum region height.               |
| header / children         | ReactNode                 | Sticky header and scrolling content. |
| label / className / style | accessibility and styling | Region name and appearance.          |

## Separator

A quiet dividing line with an optional label, in horizontal or vertical layouts.

```jsx
import { Separator } from '@ride-eats/ui';

<Separator label="or continue with" />
<Separator orientation="vertical" />
```

| Prop        | Type                  | Purpose              |
| ----------- | --------------------- | -------------------- |
| label       | ReactNode             | Optional line label. |
| orientation | horizontal / vertical | Divider direction.   |

## Icon Library

2,015 bundled Lucide icons plus Send’s own glyphs. Search by name or purpose, adjust size and stroke, preview motion, and copy the exact React code.

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

| Prop                       | Type                                         | Purpose                                                            |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| name                       | string                                       | Catalog slug or a registered custom name.                          |
| size / strokeWidth / color | number / number / string                     | SVG size, stroke and color; defaults preserve Send control sizing. |
| motion                     | none / draw / spin / pulse / bounce / rotate | Opt-in movement; honors reduced motion.                            |
| animateOn                  | hover / always                               | Hover/focus or continuous animation.                               |
| label / title              | string                                       | Accessible meaning for nondecorative icons.                        |
| IconProvider.icons         | Record<string,ReactNode>                     | Register custom SVG contents or override catalog names.            |

## Data Table

A real working table: custom cells, sortable columns, selection, row actions, loading and empty states. Keep data fetching and sorting in your application.

```jsx
import { useState } from "react";
import { DataTable, Badge, Button } from "@ride-eats/ui";

const [sort, setSort] = useState({ key: "name", direction: "asc" });
const [selected, setSelected] = useState([]);
const rows = [...people].sort(
  (a, b) =>
    String(a[sort.key]).localeCompare(String(b[sort.key])) *
    (sort.direction === "asc" ? 1 : -1),
);

<DataTable
  caption="Team members"
  rows={rows}
  rowKey="id"
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
    {
      key: "status",
      label: "Status",
      render: (value) => <Badge tone="good">{value}</Badge>,
    },
  ]}
  sort={sort}
  onSortChange={setSort}
  selectedKeys={selected}
  onSelectionChange={setSelected}
  rowActions={(row) => (
    <Button size="sm" onClick={() => openProfile(row)}>
      View
    </Button>
  )}
/>;
```

| Prop                             | Type                  | Purpose                                                     |
| -------------------------------- | --------------------- | ----------------------------------------------------------- |
| columns                          | Column[]              | key, label, render(value,row), sortable, width, align.      |
| rows / rowKey                    | T[] / key or function | Your records and stable identifiers.                        |
| sort / onSortChange              | Sort / callback       | Controlled sort; your app orders/fetches rows.              |
| selectedKeys / onSelectionChange | Key[] / callback      | Optional selection with select-all and indeterminate state. |
| rowActions / onRowClick          | render / callback     | Custom actions or accessible first-cell button.             |
| loading / emptyContent / caption | boolean / ReactNode   | Status and semantic table context.                          |
| className / style / density      | styling hooks         | compact or comfortable rows.                                |

## Stacked Dialogs

Keep the form mounted while a confirmation opens above it. One backdrop, depth transitions, focus restoration and a preserved draft.

```jsx
import { useState } from 'react';
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

| Prop               | Type                             | Purpose                                                                       |
| ------------------ | -------------------------------- | ----------------------------------------------------------------------------- |
| useConfirm()       | (options) => Promise<boolean>    | title, message, confirmLabel, cancelLabel and danger.                         |
| Dialog.beforeClose | () => boolean / Promise<boolean> | Optional dismissal guard; external open state remains yours.                  |
| Native stack       | automatic                        | Underlying form is inert, scaled and preserved; only the first backdrop dims. |

## Accordion

Quiet disclosure rows with an animated height, rotating chevrons and controlled state.

```jsx
import { useState } from "react";
import { Accordion } from "@ride-eats/ui";

const [open, setOpen] = useState("delivery");
<Accordion
  value={open}
  onValueChange={setOpen}
  items={[
    {
      value: "delivery",
      title: "How does delivery work?",
      content: "Your recipient gets a secure download link.",
    },
    {
      value: "expiry",
      title: "Can I change the expiry?",
      content: "Choose a date in transfer settings.",
    },
  ]}
/>;
```

| Prop                  | Type                          | Purpose                         |
| --------------------- | ----------------------------- | ------------------------------- |
| items                 | {value,title,content,icon?}[] | Content and optional row icons. |
| value / onValueChange | string / null / callback      | Open item or null.              |
| className / style     | styling hooks                 | Customize the outer layout.     |

## Alert

An inline message with a small status mark, optional action and dismissal.

```jsx
import { Alert, Button } from "@ride-eats/ui";

<Alert
  tone="good"
  title="Your files are ready"
  onDismiss={() => setVisible(false)}
  action={
    <Button size="sm" onClick={openTransfer}>
      View transfer
    </Button>
  }
>
  A secure link is ready to share with your team.
</Alert>;
```

| Prop                      | Type                 | Purpose                                 |
| ------------------------- | -------------------- | --------------------------------------- |
| tone                      | neutral / good / bad | Semantic styling and alert/status role. |
| title / children / action | ReactNode            | Message, detail and optional action.    |
| onDismiss                 | () => void           | Optional dismissal control.             |

## Checkbox

A compact check with a soft scale transition, a real native input and indeterminate support.

```jsx
import { useState } from "react";
import { Checkbox } from "@ride-eats/ui";

const files = [
  { id: "brief", name: "Campaign brief.pdf" },
  { id: "assets", name: "Brand assets.zip" },
];
const [selected, setSelected] = useState(["brief"]);
const all = selected.length === files.length;
const mixed = selected.length > 0 && !all;

<Checkbox
  label="Select all files"
  checked={all}
  indeterminate={mixed}
  onCheckedChange={(checked) =>
    setSelected(checked ? files.map((file) => file.id) : [])
  }
/>;
{
  files.map((file) => (
    <Checkbox
      key={file.id}
      label={file.name}
      checked={selected.includes(file.id)}
      onCheckedChange={(checked) =>
        setSelected((current) =>
          checked
            ? [...current, file.id]
            : current.filter((id) => id !== file.id),
        )
      }
    />
  ));
}
```

| Prop                      | Type               | Purpose                       |
| ------------------------- | ------------------ | ----------------------------- |
| checked / onCheckedChange | boolean / callback | Controlled native checkbox.   |
| label / hint              | ReactNode          | Label and explanation.        |
| indeterminate / disabled  | boolean            | Mixed state and availability. |

## Radio Group

Selectable option rows with a quiet border, animated dot and supporting text.

```jsx
import { useState } from "react";
import { RadioGroup } from "@ride-eats/ui";

const [access, setAccess] = useState("private");
<RadioGroup
  label="Who can access this?"
  value={access}
  onValueChange={setAccess}
  options={[
    {
      value: "private",
      label: "Only invited people",
      description: "A private space for your team.",
    },
    {
      value: "public",
      label: "Anyone with the link",
      description: "Easy to share, no account needed.",
    },
  ]}
/>;
```

| Prop                    | Type              | Purpose                                           |
| ----------------------- | ----------------- | ------------------------------------------------- |
| options                 | Option[]          | value, label, description, trailing and disabled. |
| value / onValueChange   | string / callback | Native radio behavior, controlled state.          |
| label / name / disabled | string / boolean  | Group context and form identity.                  |

## Slider

A smooth value track with a precise native range input and a readable live value.

```jsx
import { useState } from "react";
import { Slider } from "@ride-eats/ui";

const [volume, setVolume] = useState(64);
<Slider
  label="Volume"
  value={volume}
  onValueChange={setVolume}
  min={0}
  max={100}
  step={1}
  formatValue={(value) => value + "%"}
/>;
```

| Prop                  | Type              | Purpose                            |
| --------------------- | ----------------- | ---------------------------------- |
| value / onValueChange | number / callback | Controlled value.                  |
| min / max / step      | number            | Native range bounds.               |
| formatValue           | (value) => string | Visible and accessible value text. |

## Progress

A measured progress bar with a soft fill transition, or a restrained indeterminate state.

```jsx
import { useState } from 'react';
import { Progress, Button } from '@ride-eats/ui';

const [progress, setProgress] = useState(64);
<Progress label="Uploading campaign assets" value={progress} hint="6.4 MB of 10 MB" />
<Button onClick={() => setProgress(value => Math.min(100, value + 12))}>Advance</Button>
```

| Prop          | Type    | Purpose                                        |
| ------------- | ------- | ---------------------------------------------- |
| value / max   | number  | Current and maximum values.                    |
| label / hint  | string  | Task and supporting context.                   |
| indeterminate | boolean | Unknown duration with reduced-motion fallback. |

## Password Input

A labeled password field with an integrated reveal control and native input props.

```jsx
import { PasswordInput } from "@ride-eats/ui";

<PasswordInput
  label="Password"
  placeholder="Enter your password"
  autoComplete="current-password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  hint="Use at least 12 characters."
/>;
```

| Prop          | Type                    | Purpose                                                  |
| ------------- | ----------------------- | -------------------------------------------------------- |
| label / hint  | ReactNode               | Field context.                                           |
| ...inputProps | native input attributes | value, onChange, name, required, disabled, autoComplete. |

## Number Input

Increment and decrement controls around a directly editable number.

```jsx
import { useState } from "react";
import { NumberInput } from "@ride-eats/ui";

const [quantity, setQuantity] = useState(2);
<NumberInput
  label="Copies"
  value={quantity}
  onValueChange={setQuantity}
  min={1}
  max={20}
/>;
```

| Prop                  | Type              | Purpose                      |
| --------------------- | ----------------- | ---------------------------- |
| value / onValueChange | number / callback | Controlled quantity.         |
| min / max / step      | number            | Bounds and increment.        |
| label / disabled      | string / boolean  | Field name and availability. |

## Breadcrumbs

A compact path through the app, with a clear current page and real links.

```jsx
import { Breadcrumbs } from "@ride-eats/ui";

<Breadcrumbs
  items={[
    { label: "Workspace", href: "/" },
    { label: "Transfers", href: "/transfers" },
    { label: "Campaign assets" },
  ]}
/>;
```

| Prop  | Type            | Purpose                        |
| ----- | --------------- | ------------------------------ |
| items | {label,href?}[] | Last item is the current page. |
| label | string          | Accessible navigation name.    |

## Avatar Group

Overlapping team identities with a measured hover lift and overflow count.

```jsx
import { AvatarGroup } from "@ride-eats/ui";

<AvatarGroup
  max={4}
  people={[
    { id: "alex", name: "Alex Rivera", src: "/alex.jpg" },
    { id: "sam", name: "Sam Chen" },
    { id: "jordan", name: "Jordan Lee" },
  ]}
/>;
```

| Prop   | Type              | Purpose                       |
| ------ | ----------------- | ----------------------------- |
| people | {id?,name,src?}[] | Images fall back to initials. |
| max    | number            | Visible identities before +N. |
| label  | string            | Group accessible name.        |

## Copy Button

Copy a value, then show a quiet checked confirmation. Failures stay visible.

```jsx
import { CopyButton } from "@ride-eats/ui";

<CopyButton
  value="https://example.com/shared/abc"
  label="Copy link"
  copiedLabel="Link copied"
  onCopy={() => console.log("Copied")}
/>;
```

| Prop                | Type      | Purpose                      |
| ------------------- | --------- | ---------------------------- |
| value               | string    | Clipboard text.              |
| label / copiedLabel | string    | Idle and confirmed labels.   |
| onCopy / onError    | callbacks | Optional integration events. |

## File Dropzone

A compact upload target with drag feedback, keyboard selection, size checks and file-type validation. Your app handles uploading.

```jsx
import { FileDropzone } from "@ride-eats/ui";

<FileDropzone
  accept="image/*,.pdf"
  maxSize={10 * 1024 * 1024}
  multiple
  onFiles={(files) => setFiles(files)}
  label="Drop your files here"
  description="or browse from your device"
/>;
```

| Prop                           | Type                     | Purpose                                    |
| ------------------------------ | ------------------------ | ------------------------------------------ |
| onFiles                        | (files: File[]) => void  | Validated files; upload with your own API. |
| accept / multiple / maxSize    | string / boolean / bytes | Type, count and size constraints.          |
| label / description / disabled | props                    | Content and availability.                  |

## Timeline

A compact activity trail, connected with fine lines and familiar Send icons.

```jsx
import { Timeline } from "@ride-eats/ui";

<Timeline
  items={[
    { id: 1, title: "Transfer created", time: "Just now", icon: "plus" },
    {
      id: 2,
      title: "Files uploaded",
      description: "12 files · 48 MB",
      time: "2 minutes ago",
      icon: "upload",
    },
    {
      id: 3,
      title: "Delivered to Alex",
      time: "5 minutes ago",
      icon: "check",
      tone: "good",
    },
  ]}
/>;
```

| Prop  | Type           | Purpose                                            |
| ----- | -------------- | -------------------------------------------------- |
| items | TimelineItem[] | title, description, time, dateTime, icon and tone. |
| label | string         | Accessible activity-list name.                     |

## Drawer

A side panel built on the same native modal stack: smooth entry, focus management and Escape.

```jsx
import { useState } from 'react';
import { Drawer, Button } from '@ride-eats/ui';

const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>View details</Button>
<Drawer open={open} onOpenChange={setOpen} title="Transfer details"
  footer={<Button onClick={() => setOpen(false)}>Done</Button>}>
  <p>Campaign assets · 12 files · 48 MB</p>
</Drawer>
```

| Prop                      | Type               | Purpose                |
| ------------------------- | ------------------ | ---------------------- |
| open / onOpenChange       | boolean / callback | Controlled visibility. |
| title / children / footer | ReactNode          | Panel structure.       |
| side                      | right / left       | Slide-in direction.    |

## Stat Cards

The Tools dashboard metrics, with default, compact, inline and hero layouts. Optional sparklines, trends and progress.

```jsx
import { MetricGrid, StatCard } from '@ride-eats/ui';

<MetricGrid minWidth={180}>
  <StatCard label="Payments" value="153" hint="1 open" />
  <StatCard label="Paid" value="5" hint="Available from Drop 1" tone="good" />
  <StatCard label="Scenarios passed" value="44 / 48" progress={92} />
  <StatCard label="Avg. response" value="1400 ms" hint="300 calls · 6 errors" />
</MetricGrid>
<StatCard variant="compact" label="Downloads" value="1,284" trend="+12.8%"
  chart={[12,18,15,30,24,40,48,52]} />
```

| Prop                         | Type                              | Purpose                     |
| ---------------------------- | --------------------------------- | --------------------------- |
| label / value / hint         | ReactNode                         | Metric hierarchy.           |
| variant                      | default / compact / inline / hero | Surface and type scale.     |
| chart / trend / progress     | number[] / text / percentage      | Optional secondary data.    |
| tone / icon                  | semantic tone / icon name         | Meaning and visual context. |
| className / style / ...props | section attributes                | App-specific layout.        |

## Tiles

The Tools launcher shape: a contained icon, a clear name, a short explanation and a natural next step.

```jsx
import { Tile, MetricGrid } from "@ride-eats/ui";

<MetricGrid minWidth={220}>
  <Tile
    icon="files"
    title="My transfers"
    description="Everything you have shared."
    meta="24 files"
    href="/transfers"
    footer="View transfers"
  />
  <Tile
    icon="team"
    title="Team workspace"
    description="Share a space with your people."
    onClick={() => setTeamOpen(true)}
    footer="Open workspace"
  />
</MetricGrid>;
```

| Prop                                | Type             | Purpose                                          |
| ----------------------------------- | ---------------- | ------------------------------------------------ |
| title / description / meta / footer | ReactNode        | Tile content and supporting context.             |
| icon / image                        | name / image URL | Visual identity.                                 |
| href / onClick                      | link / callback  | Choose link, button or static article semantics. |
| disabled / className / ...props     | customization    | Interaction and layout.                          |

## Page Header

Tools-style page titles with an app icon, context, description and natural-size actions.

```jsx
import { PageHeader, Button } from "@ride-eats/ui";

<PageHeader
  title="Payments"
  icon="storage"
  description="Shared across your admin devices."
  actions={<Button onClick={refresh}>Check connection</Button>}
/>;
```

| Prop                          | Type            | Purpose                                       |
| ----------------------------- | --------------- | --------------------------------------------- |
| title / description / eyebrow | ReactNode       | Page hierarchy.                               |
| icon / image                  | icon name / URL | Optional app identity.                        |
| actions / children            | ReactNode       | Natural-size controls and additional content. |

## Dashboard Layout

Compose a working screen from page headers, metric cards, tabs, tool tiles and tables. The same building blocks as Tools.

```jsx
import {
  PageHeader,
  MetricGrid,
  StatCard,
  Tabs,
  Card,
  DataTable,
} from "@ride-eats/ui";

<div className="stack">
  <PageHeader
    title="Payments"
    icon="storage"
    description="Shared across admin devices."
  />
  <MetricGrid>
    <StatCard label="Payments" value="153" hint="1 open" />
    <StatCard label="Paid" value="5" tone="good" />
    <StatCard label="Scenarios passed" value="44 / 48" progress={92} />
  </MetricGrid>
  <Tabs value={tab} onValueChange={setTab} items={tabs} />
  <Card
    title="Recent payments"
    description="A shared view of the latest activity."
  >
    <DataTable columns={columns} rows={payments} />
  </Card>
</div>;
```

| Prop                | Type                                            | Purpose                                             |
| ------------------- | ----------------------------------------------- | --------------------------------------------------- |
| Composition         | children and slots                              | No additional provider or dashboard-specific state. |
| MetricGrid.minWidth | number                                          | Responsive minimum card width in pixels.            |
| Card                | title,description,action,footer,variant,padding | High-level API or compound CardHeader/Body/Footer.  |
