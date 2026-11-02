import React, { useMemo, useState } from "react";
import {
  Icon,
  iconNames,
  Button,
  Select,
  Slider,
  useToast,
} from "../react/index.jsx";
import { iconTags } from "../react/icons/search.js";
const popular = [
  "search",
  "house",
  "settings",
  "users",
  "files",
  "folder",
  "calendar-days",
  "bell",
  "mail",
  "message-circle",
  "circle-help",
  "shield-check",
  "database",
  "server",
  "chart-no-axes-combined",
  "layout-dashboard",
  "table-2",
  "credit-card",
  "shopping-bag",
  "globe",
  "upload",
  "download",
  "copy",
  "link",
  "check",
  "x",
  "arrow-right",
  "chevron-down",
  "loader-circle",
  "refresh-cw",
  "heart",
  "sparkles",
  "building-2",
  "briefcase-business",
  "headset",
  "ticket",
  "workflow",
  "key-round",
  "lock-keyhole",
  "monitor",
  "smartphone",
  "cloud",
  "image",
  "video",
  "music",
  "map-pin",
  "scan-line",
  "qr-code",
];
const categories = {
  All: [],
  Navigation: ["arrow", "navigation", "chevron", "direction"],
  Files: ["file", "folder", "document", "storage"],
  People: ["person", "people", "user", "team", "contact"],
  Media: ["video", "image", "music", "audio", "camera"],
  Systems: ["server", "database", "security", "network", "code", "computer"],
};
export default function IconBrowser() {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [selected, setSelected] = useState("headset"),
    [size, setSize] = useState(24),
    [motion, setMotion] = useState("none"),
    [stroke, setStroke] = useState("1.7"),
    [limit, setLimit] = useState(72);
  const toast = useToast();
  const filtered = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const pool =
      terms.length || category !== "All"
        ? iconNames
        : [...popular, ...iconNames.filter((name) => !popular.includes(name))];
    return pool.filter((name) => {
      const text = (
        name +
        " " +
        (iconTags[name] || []).join(" ")
      ).toLowerCase();
      return (
        terms.every((term) => text.includes(term)) &&
        (category === "All" ||
          categories[category].some((term) => text.includes(term)))
      );
    });
  }, [query, category]);
  const snippet = `<Icon name="${selected}" size={${size}} strokeWidth={${stroke}}${motion !== "none" ? ` motion="${motion}" animateOn="hover"` : ""} />`;
  return (
    <div className="icon-browser">
      <div className="icon-browser-head">
        <label className="icon-search">
          <Icon name="search" />
          <input
            aria-label="Search icons"
            placeholder={`Search ${iconNames.length.toLocaleString()} icons…`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(72);
            }}
          />
        </label>
        <span>{filtered.length.toLocaleString()} icons</span>
      </div>
      <div className="icon-browser-categories">
        {Object.keys(categories).map((name) => (
          <button
            type="button"
            key={name}
            aria-pressed={category === name}
            onClick={() => {
              setCategory(name);
              setLimit(72);
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="icon-workbench">
        <div className="icon-selected">
          <Icon
            key={selected + motion}
            name={selected}
            size={40}
            strokeWidth={Number(stroke)}
            motion={motion}
            animateOn="always"
            label={selected}
          />
          <strong>{selected}</strong>
        </div>
        <div className="icon-controls">
          <Slider
            label="Size"
            min={16}
            max={48}
            step={2}
            value={size}
            onValueChange={setSize}
            formatValue={(v) => v + " px"}
          />
          <div className="icon-control-row">
            <Select
              label="Stroke width"
              value={stroke}
              onValueChange={setStroke}
              options={[
                { value: "1.5", label: "Fine · 1.5" },
                { value: "1.7", label: "Send · 1.7" },
                { value: "2", label: "Regular · 2" },
                { value: "2.5", label: "Bold · 2.5" },
              ]}
            />
            <Select
              label="Icon motion"
              value={motion}
              onValueChange={setMotion}
              options={[
                "none",
                "draw",
                "spin",
                "pulse",
                "bounce",
                "rotate",
              ].map((value) => ({
                value,
                label:
                  value === "none"
                    ? "No motion"
                    : value[0].toUpperCase() + value.slice(1),
              }))}
            />
          </div>
        </div>
      </div>
      <div className="icon-code">
        <code>{snippet}</code>
        <Button
          size="sm"
          icon="copy"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(snippet);
              toast("Icon code copied", { tone: "good" });
            } catch {
              toast("Select and copy the code", { tone: "bad" });
            }
          }}
          aria-label="Copy icon code"
        >
          Copy
        </Button>
      </div>
      <div className="icon-grid">
        {filtered.slice(0, limit).map((name) => (
          <button
            type="button"
            key={name}
            title={name}
            className={selected === name ? "is-selected" : ""}
            onClick={() => setSelected(name)}
            aria-label={`Select ${name}`}
          >
            <Icon
              name={name}
              size={size}
              strokeWidth={Number(stroke)}
              motion={motion}
              animateOn="hover"
            />
            <span>{name}</span>
          </button>
        ))}
      </div>
      {!filtered.length && (
        <p className="icon-no-results">
          No icons match that search. Try a name or a purpose, like “support” or
          “payments”.
        </p>
      )}
      {filtered.length > limit && (
        <Button onClick={() => setLimit((value) => value + 72)}>
          Show more icons
        </Button>
      )}
      <p className="icon-credit">
        Built into Ride Eats UI. Lucide artwork · ISC license. Send’s original
        glyphs remain available. Letter groups load on demand.
      </p>
    </div>
  );
}
