import React, { useState } from "react";
import {
  ShortcutRecorder,
  TextDiffViewer,
  Flex,
  Button,
  Switch,
} from "../react/index.jsx";
const previous = Array.from({ length: 48 }, (_, i) =>
  i === 0
    ? "export const delivery = {"
    : i === 1
      ? '  name: "City route",'
      : i === 12
        ? "  retries: 2,"
        : i === 25
          ? "  timeout: 3000,"
          : i === 47
            ? "};"
            : `  stop${i}: "District ${i}",`,
).join("\n");
const revision = previous
  .replace("retries: 2", "retries: 4")
  .replace("timeout: 3000", "timeout: 5000")
  .replace(
    '  stop30: "District 30",',
    '  allowWeekend: true,\n  stop30: "District 30",',
  );
export function ReviewDemo({ id }) {
  const [shortcut, setShortcut] = useState(["Control", "Shift", "K"]),
    [view, setView] = useState("split"),
    [fold, setFold] = useState(true),
    [content, setContent] = useState(revision);
  if (id === "shortcut-recorder")
    return (
      <Flex direction="column" style={{ width: "100%", maxWidth: 560 }}>
        <ShortcutRecorder
          value={shortcut}
          onValueChange={setShortcut}
          label="Open command search"
          bindings={[
            { keys: ["Control", "Shift", "P"], label: "Publish artwork" },
            { keys: ["Alt", "M"], label: "Open messages" },
          ]}
        />
        <p className="muted">
          Try Ctrl+Shift+P to see conflict handling. Ctrl+Alt+K is available.
          Escape cancels recording.
        </p>
        <output aria-live="polite">
          Saved binding: {shortcut.length ? shortcut.join(" + ") : "None"}
        </output>
      </Flex>
    );
  if (id === "text-diff-viewer")
    return (
      <Flex direction="column" style={{ width: "100%" }}>
        <Flex>
          <Switch
            label="Fold unchanged lines"
            checked={fold}
            onChange={setFold}
          />
          <Button
            onClick={() =>
              setContent(content === previous ? revision : previous)
            }
          >
            {content === previous ? "Show changes" : "Compare identical text"}
          </Button>
        </Flex>
        <TextDiffViewer
          label="Delivery configuration"
          before={previous}
          after={content}
          beforeLabel="Current version"
          afterLabel="Proposed version"
          view={view}
          onViewChange={setView}
          collapseUnchanged={fold}
          maxHeight={320}
        />
      </Flex>
    );
  return null;
}
