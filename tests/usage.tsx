import * as UI from "../react/index.jsx";
import { useState } from "react";
import {
  Header,
  Button,
  Tabs,
  Dropdown,
  Select,
  SearchSelect,
  Switch,
  Dialog,
  DateTimePicker,
  ThemeProvider,
  ToastProvider,
  Field,
  MenuItem,
} from "../react/index.jsx";
export function Example() {
  const [value, setValue] = useState("all");
  return (
    <ThemeProvider>
      <ToastProvider>
        <Header
          brand={{ name: "Studio" }}
          items={[{ value: "all", label: "All", href: "/" }]}
          activeValue={value}
          onNavigate={(item) => setValue(item.value)}
          account={{ name: "Alex" }}
          menuContent={<MenuItem>Settings</MenuItem>}
        />
        <Button variant="primary" icon="plus" ref={() => {}}>
          Create
        </Button>
        <Tabs
          items={[{ value: "all", label: "All" }]}
          value={value}
          onValueChange={setValue}
        />
        <Dropdown
          items={[{ label: "Edit", onSelect() {} }, { type: "separator" }]}
        />
        <Select
          options={[{ value: "all", label: "All" }]}
          value={value}
          onValueChange={setValue}
        />
        <SearchSelect
          load={async () => []}
          value={[]}
          onValueChange={() => {}}
        />
        <Switch label="Enabled" checked onChange={() => {}} />
        <DateTimePicker value={1234} onChange={() => {}} />
        <Dialog open={false} onOpenChange={() => {}} title="Edit">
          <Field label="Name">
            <input />
          </Field>
        </Dialog>
      </ToastProvider>
    </ThemeProvider>
  );
}

import {
  DataTable,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  StatCard,
  Grid,
  Tile,
  Icon,
  IconProvider,
  Accordion,
  Checkbox,
  Slider,
  Progress,
  useConfirm,
} from "../react/index.jsx";
export function PlatformExample() {
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const confirm = useConfirm();
  return (
    <>
      <Grid preset="metrics">
        <StatCard
          label="Payments"
          value="153"
          chart={[1, 3, 2, 7]}
          trend="+12%"
        />
        <Tile title="Files" href="/files" />
      </Grid>
      <Card
        title="Members"
        description="Shared workspace"
        variant="soft"
        footer={<Button>Save</Button>}
      >
        <DataTable
          rows={[{ id: "a", name: "Alex" }]}
          columns={[
            {
              key: "name",
              label: "Name",
              render: (value) => <strong>{value}</strong>,
            },
          ]}
          selectedKeys={selected}
          onSelectionChange={setSelected}
        />
      </Card>
      <Card>
        <CardHeader title="Custom" />
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>
      <Icon name="headset" size={24} motion="draw" />
      <IconProvider icons={{ brand: <path d="M4 4h16v16H4Z" /> }}>
        <Icon name="brand" />
      </IconProvider>
      <Accordion
        items={[{ value: "a", title: "A", content: "Body" }]}
        value={null}
        onValueChange={() => {}}
      />
      <Checkbox label="Select" checked onCheckedChange={() => {}} />
      <Progress value={64} />
      <Slider value={50} onValueChange={() => {}} />
      <Button
        onClick={async () => {
          await confirm({ title: "Discard?", danger: true });
        }}
      >
        Cancel
      </Button>
    </>
  );
}
import {
  Popover,
  CommandMenu,
  PinInput,
  ToggleGroup,
} from "../react/index.jsx";
export function MotionUsage() {
  const [open, setOpen] = useState(false),
    [pin, setPin] = useState(""),
    [format, setFormat] = useState<string[]>([]);
  return (
    <>
      <Icon motion="auto" size={24} name="bell" playing />
      <Popover
        open={open}
        onOpenChange={setOpen}
        trigger={(props) => <Button {...props}>Details</Button>}
      >
        Content
      </Popover>
      <CommandMenu open={open} onOpenChange={setOpen} items={[]} />
      <PinInput value={pin} onValueChange={setPin} />
      <ToggleGroup
        multiple
        value={format}
        onValueChange={setFormat}
        items={[{ value: "bold", label: "Bold" }]}
      />
    </>
  );
}

const gestures = (
  <>
    <UI.ReorderList
      items={[{ id: "a", label: "First" }]}
      onReorder={(items) => items[0].label}
    />
    <UI.SwipeActions actions={[{ value: "a", label: "Archive" }]}>
      File
    </UI.SwipeActions>
    <UI.Carousel
      items={[{ id: "a", title: "One" }]}
      renderItem={(item) => item.title}
    />
    <UI.SplitPane value={40} onValueChange={() => {}} first="A" second="B" />
    <UI.RangeSlider value={[20, 80]} onValueChange={() => {}} />
  </>
);

const platform = (
  <>
    <UI.Form
      initialValues={{ name: "" }}
      validate={(values) => ({ name: values.name ? undefined : "Required" })}
      onSubmit={async (values) => {
        values.name.toUpperCase();
      }}
    >
      {({ field, errors, submitting }) => (
        <>
          <UI.Field label="Name" error={errors.name}>
            <input {...field("name")} />
          </UI.Field>
          <UI.Button type="submit" loading={submitting}>
            Save
          </UI.Button>
        </>
      )}
    </UI.Form>
    <UI.Combobox
      options={[{ value: "a", label: "Alex" }]}
      value="a"
      onValueChange={() => {}}
    />
    <UI.Combobox multiple options={[]} value={["a"]} onValueChange={() => {}} />
    <UI.DateRangePicker
      value={{ start: "", end: "" }}
      onValueChange={() => {}}
    />
    <UI.DataGrid
      rows={[{ id: "a", name: "Alex" }]}
      columns={[{ key: "name", render: (value, row) => row.name }]}
    />
    <UI.AppShell
      items={[{ value: "home", label: "Home" }]}
      value="home"
      onValueChange={() => {}}
    >
      Content
    </UI.AppShell>
    <UI.BottomSheet open={false} onClose={() => {}} title="Settings">
      Fields
    </UI.BottomSheet>
    <UI.SettingsPanel
      sections={[{ id: "a", title: "General", children: "Fields" }]}
    />
    <UI.TeamDirectory
      members={[]}
      onInvite={async (values) => {
        values.email.toLowerCase();
      }}
    />
    <UI.FileManager
      files={[]}
      onUpload={(files) => files.map((file) => file.name)}
    />
    <UI.SupportInbox
      threads={[]}
      value=""
      onValueChange={() => {}}
      onReply={async (id, text) => {
        text.trim();
      }}
    />
  </>
);

export function ConsolidatedUsage() {
  const [people, setPeople] = useState<string[]>([]),
    [choice, setChoice] = useState("a"),
    [keys, setKeys] = useState<string[]>(["Control", "K"]),
    [view, setView] = useState<"split" | "unified">("split");
  return (
    <UI.Flex direction="column">
      <UI.Grid preset="metrics">
        <UI.StatCard label="Total" value={4} />
      </UI.Grid>
      <UI.Combobox
        multiple
        options={[{ value: "a", label: "A" }]}
        value={people}
        onValueChange={setPeople}
      />
      <UI.ToggleGroup
        variant="chips"
        items={[{ value: "a", label: "A" }]}
        value={choice}
        onValueChange={setChoice}
      />
      <UI.Timeline variant="feed" items={[]} />
      <UI.Icon motion="auto" size={24} name="bell" playing loop />
      <UI.ShortcutRecorder value={keys} onValueChange={setKeys} />
      <UI.TextDiffViewer
        before="old"
        after="new"
        view={view}
        onViewChange={setView}
      />
    </UI.Flex>
  );
}
