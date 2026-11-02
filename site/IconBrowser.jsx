import React, { useMemo, useState } from "react";
import {
  Icon,
  AnimatedIcon,
  iconNames,
  Button,
  Slider,
  Switch,
  Segmented,
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
export default function IconBrowser({ animated = false }) {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [selected, setSelected] = useState("headset"),
    [size, setSize] = useState(24),
    [motion, setMotion] = useState("auto"),
    [stroke, setStroke] = useState("1.7"),
    [limit, setLimit] = useState(72),
    [replay, setReplay] = useState(0),
    [loop, setLoop] = useState(false);
  const toast = useToast();
  const PreviewIcon = motion === "auto" ? AnimatedIcon : Icon;
  const filtered = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const pool =
      terms.length || category !== "All"
        ? iconNames
        : [
            ...popular.filter((name) => iconNames.includes(name)),
            ...iconNames.filter((name) => !popular.includes(name)),
          ];
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
  const snippet =
    motion === "auto"
      ? `<AnimatedIcon name="${selected}" size={${size}} strokeWidth={${stroke}} playing${loop ? " loop" : ""} />`
      : `<Icon name="${selected}" size={${size}} strokeWidth={${stroke}}${motion !== "none" ? ` motion="${motion}" playing${loop ? " loop" : ""}` : ""} />`;
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
        <Segmented
          name="Icon category"
          fit
          value={category}
          onChange={(name) => {
            setCategory(name);
            setLimit(72);
          }}
          options={Object.keys(categories).map((value) => ({
            value,
            label: value,
          }))}
        />
      </div>
      <div className="icon-workbench">
        <div className="icon-selected">
          <PreviewIcon
            key={selected + motion + replay}
            name={selected}
            size={size}
            strokeWidth={Number(stroke)}
            {...(motion === "auto" ? {} : { motion, animateOn: "always" })}
            playing={motion !== "none"}
            loop={loop}
            label={selected}
          />
          <strong>{selected}</strong>
        </div>
        <div className="icon-controls">
          <div className="icon-control-row">
            <div className="icon-choice-field">
              <Slider
                label="Icon size"
                min={16}
                max={64}
                step={1}
                value={size}
                onValueChange={setSize}
                formatValue={(value) => `${value} px`}
              />
            </div>
            <div className="icon-choice-field">
              <span>Stroke</span>
              <div className="icon-choice-scroll">
                <Segmented
                  name="Icon stroke"
                  fit
                  value={stroke}
                  onChange={setStroke}
                  options={[
                    { value: "1.5", label: "Fine" },
                    { value: "1.7", label: "Send" },
                    { value: "2", label: "Regular" },
                    { value: "2.5", label: "Bold" },
                  ]}
                />
              </div>
            </div>
            <div className="icon-choice-field">
              <span>Motion</span>
              <div className="icon-choice-scroll">
                <Segmented
                  name="Icon motion"
                  fit
                  value={motion}
                  onChange={setMotion}
                  options={[
                    { value: "auto", label: "Animate" },
                    { value: "none", label: "Still" },
                    { value: "draw", label: "Draw" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="icon-playback">
        <Button
          size="sm"
          variant="ghost"
          icon="play"
          disabled={motion === "none"}
          onClick={() => setReplay((value) => value + 1)}
        >
          Replay animation
        </Button>
        <Switch
          label="Loop preview"
          checked={loop}
          onChange={setLoop}
          disabled={motion === "none"}
        />
        <small>Select an icon to play. Hover any glyph to replay it.</small>
        <small className="icon-reduced-note">
          Your system reduces motion; animations are paused.
        </small>
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
            <PreviewIcon
              name={name}
              size={size}
              strokeWidth={Number(stroke)}
              {...(motion === "auto" ? {} : { motion, animateOn: "hover" })}
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
