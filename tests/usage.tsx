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
