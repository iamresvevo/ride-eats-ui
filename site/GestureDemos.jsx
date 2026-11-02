import React, { useState } from "react";
import * as UI from "../react/index.jsx";
export default function GestureDemos({ id }) {
  const [items, setItems] = useState([
      { id: "design", label: "Design the experience" },
      { id: "build", label: "Build the components" },
      { id: "review", label: "Review with the team" },
      { id: "ship", label: "Ship it" },
    ]),
    [split, setSplit] = useState(40),
    [range, setRange] = useState([20, 80]);
  const toast = UI.useToast();
  if (id === "reorder-list")
    return (
      <div className="gesture-demo">
        <p>Drag a handle, or use its arrow buttons.</p>
        <UI.ReorderList
          items={items}
          onReorder={setItems}
          renderItem={(item, index) => (
            <div>
              <strong>{item.label}</strong>
              <small>Step {index + 1} · Ready when you are</small>
            </div>
          )}
        />
      </div>
    );
  if (id === "swipe-actions")
    return (
      <div className="gesture-demo">
        <p>Swipe left to reveal actions. Nothing runs until you press one.</p>
        <UI.SwipeActions
          actions={[
            {
              value: "archive",
              label: "Archive",
              icon: "archive",
              onSelect: () => toast("Archived in this demo"),
            },
            {
              value: "star",
              label: "Favorite",
              icon: "star",
              onSelect: () => toast("Added to favorites", { tone: "good" }),
            },
          ]}
        >
          <UI.Icon name="folder" size={20} />
          <div>
            <strong>Brand assets</strong>
            <small>12 files · Updated today</small>
          </div>
        </UI.SwipeActions>
      </div>
    );
  if (id === "carousel")
    return (
      <UI.Carousel
        label="Workspace highlights"
        items={[
          {
            id: "a",
            title: "A place for your next idea",
            description:
              "Bring the work together. Everything starts with one small step.",
            icon: "sparkles",
          },
          {
            id: "b",
            title: "Built to share",
            description:
              "Keep your team moving with shared files and simple controls.",
            icon: "users",
          },
          {
            id: "c",
            title: "Ready for what comes next",
            description: "A familiar system that grows with your platform.",
            icon: "rocket",
          },
        ]}
        renderItem={(item) => (
          <div className="gesture-slide">
            <UI.Icon name={item.icon} size={38} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        )}
      />
    );
  if (id === "split-pane")
    return (
      <UI.SplitPane
        value={split}
        onValueChange={setSplit}
        first={
          <div className="gesture-panel">
            <UI.Icon name="panel-left" size={24} />
            <strong>Library</strong>
            <p>Your navigation, files or filters.</p>
          </div>
        }
        second={
          <div className="gesture-panel">
            <UI.Icon name="layout-dashboard" size={24} />
            <strong>Workspace</strong>
            <p>Drag the divider to find your balance.</p>
            <UI.Badge>
              {Math.round(split)}% / {Math.round(100 - split)}%
            </UI.Badge>
          </div>
        }
      />
    );
  return (
    <UI.RangeSlider
      label="Monthly budget"
      value={range}
      onValueChange={setRange}
      min={0}
      max={100}
      formatValue={(value) => "$" + value}
    />
  );
}
