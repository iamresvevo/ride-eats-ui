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
  MetricGrid,
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
      <MetricGrid>
        <StatCard
          label="Payments"
          value="153"
          chart={[1, 3, 2, 7]}
          trend="+12%"
        />
        <Tile title="Files" href="/files" />
      </MetricGrid>
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
