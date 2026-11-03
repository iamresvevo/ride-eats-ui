import React, { useState } from "react";
import * as UI from "../react/index.jsx";
import before from "./assets/dispatch-before.svg";
import after from "./assets/dispatch-after.svg";
const nodes = [
  {
    id: "seasons",
    label: "Seasons",
    detail: "3 collections",
    children: [
      {
        id: "diwali",
        label: "Diwali",
        children: [
          {
            id: "diwali-logo",
            label: "Main logo.svg",
            detail: "24 KB",
            icon: "image",
          },
          {
            id: "diwali-dark",
            label: "Dark mode.svg",
            detail: "26 KB",
            icon: "image",
          },
        ],
      },
      {
        id: "halloween",
        label: "Halloween",
        children: [
          { id: "scene", label: "Courtyard.scene", detail: "3D", icon: "box" },
        ],
      },
      {
        id: "archive",
        label: "Archive",
        children: [{ id: "spring", label: "Spring collection" }],
      },
    ],
  },
  {
    id: "shared",
    label: "Shared assets",
    children: [
      { id: "brand", label: "Brand guidelines.pdf" },
      { id: "read-only", label: "Protected asset", disabled: true },
    ],
  },
];
export function SpecializedDemo({ id }) {
  const [position, setPosition] = useState(50),
    [selected, setSelected] = useState("diwali-logo"),
    [expanded, setExpanded] = useState(["seasons", "diwali"]),
    [strokes, setStrokes] = useState([]),
    [day, setDay] = useState("2026-09-09");
  if (id === "image-compare")
    return (
      <UI.Flex direction="column" style={{ width: "100%", maxWidth: 640 }}>
        <UI.ImageCompare
          before={{
            src: before,
            alt: "Original route with a long detour",
            label: "Original · 4.8 km",
          }}
          after={{
            src: after,
            alt: "Revised route with a direct connection",
            label: "Revised · 3.1 km",
          }}
          value={position}
          onValueChange={setPosition}
        />
        <UI.Flex>
          <UI.Button onClick={() => setPosition(0)}>Revised route</UI.Button>
          <UI.Button onClick={() => setPosition(50)}>Compare</UI.Button>
          <UI.Button onClick={() => setPosition(100)}>Original route</UI.Button>
          <output
            aria-live="polite"
            style={{
              width: "16ch",
              flex: "0 0 16ch",
              whiteSpace: "nowrap",
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {position.toFixed(1)}% original
          </output>
        </UI.Flex>
      </UI.Flex>
    );
  if (id === "tree-view")
    return (
      <UI.Flex direction="column">
        <UI.TreeView
          label="Season artwork"
          nodes={nodes}
          value={selected}
          onValueChange={setSelected}
          expandedKeys={expanded}
          onExpandedChange={setExpanded}
        />
        <output>Selected: {selected}</output>
      </UI.Flex>
    );
  if (id === "signature-pad")
    return (
      <UI.Flex direction="column">
        <UI.SignaturePad
          value={strokes}
          onValueChange={setStrokes}
          label="Draw a sample mark"
          footer="Demo drawing only · kept in this page’s memory"
        />
        <output aria-live="polite">
          {strokes.length} strokes · {strokes.reduce((n, s) => n + s.length, 0)}{" "}
          points
        </output>
      </UI.Flex>
    );
  if (id === "activity-heatmap") {
    const values = Array.from({ length: 112 }, (_, i) => ({
      date: new Date(Date.UTC(2026, 7, 3) + i * 86400000)
        .toISOString()
        .slice(0, 10),
      value: i % 9 === 0 ? 0 : (i * 17 + (i % 5)) % 22,
    }));
    return (
      <UI.Flex direction="column">
        <UI.ActivityHeatmap
          startDate="2026-08-03"
          weeks={16}
          values={values}
          value={day}
          onValueChange={setDay}
          label="Daily publishing activity"
          formatValue={(n) => `${n} publishes`}
        />
        <output aria-live="polite">
          {day} · {values.find((x) => x.date === day)?.value || 0} publishes
        </output>
      </UI.Flex>
    );
  }
  return null;
}
