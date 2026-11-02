import React, { useState } from "react";
import * as UI from "../react/index.jsx";
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
    },
  },
  "multi-select": {
    component: "MultiSelect",
    defaults: { label: "Teams", placeholder: "Choose teams…", disabled: false },
  },
  autocomplete: {
    component: "Autocomplete",
    defaults: {
      label: "Tag",
      placeholder: "Choose or create…",
      disabled: false,
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
  const [source, setSource] = useState(JSON.stringify(entry.defaults, null, 2)),
    [props, setProps] = useState(entry.defaults),
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
  if (["Combobox", "Autocomplete"].includes(entry.component))
    controlled = { options, value, onValueChange: setValue };
  if (entry.component === "MultiSelect")
    controlled = { options, value: values, onValueChange: setValues };
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
  return (
    <details className="props-playground">
      <summary>
        <UI.Icon name="sliders-horizontal" />
        Editable props playground<small>JSON · live preview</small>
      </summary>
      <div>
        <div>
          <label htmlFor={`props-${entry.component}`}>Props</label>
          <textarea
            id={`props-${entry.component}`}
            spellCheck={false}
            value={source}
            onChange={(event) => {
              const text = event.target.value;
              setSource(text);
              try {
                if (text.length > 3000)
                  throw Error("Keep props under 3,000 characters.");
                const next = JSON.parse(text);
                if (!next || Array.isArray(next) || typeof next !== "object")
                  throw Error("Enter a JSON object.");
                for (const [key, defaultValue] of Object.entries(
                  entry.defaults,
                )) {
                  if (typeof next[key] !== typeof defaultValue)
                    throw Error(`${key} must be ${typeof defaultValue}.`);
                  const bounds = entry.limits?.[key];
                  if (
                    bounds &&
                    (!Number.isFinite(next[key]) ||
                      next[key] < bounds[0] ||
                      next[key] > bounds[1])
                  )
                    throw Error(`${key} must be ${bounds[0]}–${bounds[1]}.`);
                }
                if (Object.keys(next).some((key) => !(key in entry.defaults)))
                  throw Error("Use the listed props.");
                if ("min" in next && next.min >= next.max)
                  throw Error("min must be less than max.");
                setProps(next);
                setError("");
              } catch (reason) {
                setError(reason.message);
              }
            }}
          />
          {error && <p role="alert">{error}</p>}
          <code>{`<${entry.component} {...${JSON.stringify(props)}} />`}</code>
          <small>
            Connect value and change callbacks as shown in Usage. This editor
            applies props without evaluating JavaScript.
          </small>
        </div>
        <div className="props-playground-preview">
          <Component {...props} {...controlled} />
        </div>
      </div>
    </details>
  );
}
