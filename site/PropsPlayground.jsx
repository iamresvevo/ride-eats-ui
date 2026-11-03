import React, { useState } from "react";
import * as UI from "../react/index.jsx";
import { implementationCode } from "./implementation-code.js";
const entries = {
  textarea: {
    component: "Textarea",
    defaults: { label: "Description", rows: 3, disabled: false },
    limits: { rows: [1, 8] },
  },
  combobox: {
    component: "Combobox",
    defaults: {
      label: "Assignee",
      placeholder: "Search people…",
      disabled: false,
      multiple: false,
    },
  },
  "time-picker": {
    component: "TimePicker",
    defaults: { label: "Opening time", step: 60, disabled: false },
    limits: { step: [1, 3600] },
  },
  "date-range-picker": {
    component: "DateRangePicker",
    defaults: { label: "Reporting period", disabled: false },
  },
  rating: {
    component: "Rating",
    defaults: { label: "How was your experience?", max: 5, readOnly: false },
    limits: { max: [1, 10] },
  },
  "range-slider": {
    component: "RangeSlider",
    defaults: { label: "Budget", min: 0, max: 100, step: 1, disabled: false },
    limits: { min: [-1000, 1000], max: [-1000, 1000], step: [1, 100] },
  },
  "split-pane": {
    component: "SplitPane",
    defaults: { label: "Resize panels", min: 20, max: 80 },
    limits: { min: [5, 45], max: [55, 95] },
  },
  "data-grid": {
    component: "DataGrid",
    defaults: {
      label: "Team records",
      pageSize: 4,
      height: 240,
      rowHeight: 40,
      virtual: false,
    },
    limits: { pageSize: [1, 20], height: [160, 500], rowHeight: [36, 64] },
  },
  "app-shell": {
    component: "AppShell",
    defaults: { brand: "Studio", collapsed: false },
  },
};
const options = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "support", label: "Support" },
];
export default function PropsPlayground({ id }) {
  const entry = entries[id];
  if (!entry) return null;
  return <Editor key={id} entry={entry} />;
}
function Editor({ entry }) {
  const [expanded, setExpanded] = useState(null);
  const [props, setProps] = useState(entry.defaults),
    [error, setError] = useState(""),
    [value, setValue] = useState(""),
    [values, setValues] = useState([]),
    [number, setNumber] = useState(3),
    [split, setSplit] = useState(40),
    [range, setRange] = useState([20, 80]),
    [dates, setDates] = useState({ start: "", end: "" });
  const Component = UI[entry.component];
  let controlled = {};
  if (entry.component === "Textarea")
    controlled = { value, onChange: (event) => setValue(event.target.value) };
  if (entry.component === "Combobox")
    controlled = props.multiple
      ? { options, value: values, onValueChange: setValues }
      : { options, value, onValueChange: setValue };
  if (entry.component === "TimePicker")
    controlled = { value, onValueChange: setValue };
  if (entry.component === "DateRangePicker")
    controlled = { value: dates, onValueChange: setDates };
  if (entry.component === "Rating")
    controlled = {
      value: Math.min(number, props.max),
      onValueChange: setNumber,
    };
  if (entry.component === "RangeSlider")
    controlled = {
      value: range.map((v) => Math.max(props.min, Math.min(props.max, v))),
      onValueChange: setRange,
    };
  if (entry.component === "SplitPane")
    controlled = {
      value: split,
      onValueChange: setSplit,
      first: "Navigation",
      second: "Workspace",
    };
  if (entry.component === "DataGrid")
    controlled = {
      rows: [
        { id: "1", name: "Alex Rivera", role: "Owner" },
        { id: "2", name: "Sam Chen", role: "Editor" },
        { id: "3", name: "Jordan Lee", role: "Viewer" },
        { id: "4", name: "Casey Morgan", role: "Editor" },
        { id: "5", name: "Drew Parker", role: "Viewer" },
      ],
      columns: [
        { key: "name", label: "Name", width: 220, pinned: true },
        { key: "role", label: "Role", width: 130 },
      ],
    };
  if (entry.component === "AppShell")
    controlled = {
      items: [
        { value: "home", label: "Overview", icon: "house" },
        { value: "team", label: "Team", icon: "users" },
      ],
      value: value || "home",
      onValueChange: setValue,
      children: (
        <UI.Card title={value === "team" ? "Your team" : "Overview"}>
          Compact app shell
        </UI.Card>
      ),
    };
  const code = implementationCode(entry.component, props, controlled);
  const update = (key, value) => {
    const next = { ...props, [key]: value };
    if ("min" in next && next.min >= next.max) {
      setError("min must be less than max.");
      return;
    }
    setError("");
    setProps(next);
  };
  const content = (
    <div className="implementation-workbench">
      <div className="implementation-controls">
        <UI.Card title="Props" padding="sm">
          {Object.entries(entry.defaults).map(([key, initial]) =>
            typeof initial === "boolean" ? (
              <UI.Switch
                key={key}
                label={key}
                checked={props[key]}
                onChange={(value) => update(key, value)}
              />
            ) : typeof initial === "number" ? (
              <UI.NumberInput
                key={key}
                label={key}
                value={props[key]}
                min={entry.limits?.[key]?.[0]}
                max={entry.limits?.[key]?.[1]}
                onValueChange={(value) => update(key, value)}
              />
            ) : (
              <UI.Field key={key} label={key}>
                <input
                  value={props[key]}
                  onChange={(event) => update(key, event.target.value)}
                />
              </UI.Field>
            ),
          )}
          {error && <UI.Alert tone="bad" title={error} />}
          <UI.Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setProps(entry.defaults);
              setError("");
            }}
          >
            Reset props
          </UI.Button>
        </UI.Card>
        <UI.Card
          title="Live component"
          padding="sm"
          className="implementation-live"
        >
          <Component {...props} {...controlled} />
        </UI.Card>
      </div>
      <UI.Card
        title="React implementation"
        description="Includes the data, state and callbacks used above."
        padding="sm"
        action={<UI.CopyButton value={code} label="Copy JSX" />}
      >
        <pre className="implementation-code">
          <code>{code}</code>
        </pre>
      </UI.Card>
    </div>
  );
  return (
    <UI.Accordion
      className="props-playground"
      label="Component implementation"
      value={expanded}
      onValueChange={setExpanded}
      items={[
        {
          value: "props",
          title: "Implementation workbench",
          icon: "code",
          content,
        },
      ]}
    />
  );
}
