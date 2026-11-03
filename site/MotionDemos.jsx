import CatalogBoundary from "./CatalogBoundary.jsx";
import CommandDemo from "./CommandDemo.jsx";
import GestureDemos from "./GestureDemos.jsx";
import React, { lazy, Suspense, useState } from "react";
import * as UI from "../react/index.jsx";
const IconBrowser = lazy(() => import("./IconBrowser.jsx"));
export default function MotionDemos({ id }) {
  const [open, setOpen] = useState(false),
    [value, setValue] = useState("details"),
    [pin, setPin] = useState(""),
    [format, setFormat] = useState(["bold"]),
    [rating, setRating] = useState(4),
    [loop, setLoop] = useState(false),
    [playing, setPlaying] = useState(false),
    [activeName, setActiveName] = useState("*"),
    [replay, setReplay] = useState(0),
    [query, setQuery] = useState("");
  const toast = UI.useToast();
  if (
    [
      "reorder-list",
      "swipe-actions",
      "carousel",
      "split-pane",
      "range-slider",
    ].includes(id)
  )
    return <GestureDemos key={id} id={id} />;
  switch (id) {
    case "animated-icons":
      return (
        <CatalogBoundary>
          <Suspense
            fallback={<UI.PageLoading label="Loading animated icon library" />}
          >
            <IconBrowser animated />
          </Suspense>
        </CatalogBoundary>
      );
    case "popover":
      return (
        <UI.Popover
          label="Share settings"
          open={open}
          onOpenChange={setOpen}
          trigger={(props) => (
            <UI.Button {...props} icon="settings">
              Share settings
            </UI.Button>
          )}
        >
          <div className="stack" style={{ gap: 16 }}>
            <strong style={{ fontSize: 14 }}>Share settings</strong>
            <p className="muted" style={{ fontSize: 12, lineHeight: 1.7 }}>
              Anyone with the link can open this transfer.
            </p>
            <UI.Switch
              label="Allow downloads"
              checked={loop}
              onChange={setLoop}
            />
            <UI.Button
              size="sm"
              variant="primary"
              onClick={() => setOpen(false)}
            >
              Done
            </UI.Button>
          </div>
        </UI.Popover>
      );
    case "command-menu":
      return <CommandDemo />;
    case "pin-input":
      return (
        <div className="demo-stack">
          <UI.PinInput
            label="Verification code"
            value={pin}
            onValueChange={setPin}
            onComplete={() => toast("Code complete", { tone: "good" })}
          />
          <span className="demo-caption">
            Paste a code or type six digits. No code is sent.
          </span>
        </div>
      );
    case "toggle-group":
      return (
        <UI.ToggleGroup
          label="Text formatting"
          multiple
          value={format}
          onValueChange={setFormat}
          items={[
            { value: "bold", label: "Bold", icon: "bold" },
            { value: "italic", label: "Italic", icon: "italic" },
            { value: "underline", label: "Underline", icon: "underline" },
          ]}
        />
      );
    case "rating":
      return (
        <UI.Rating
          label="How was your experience?"
          value={rating}
          onValueChange={setRating}
        />
      );
    default:
      return null;
  }
}
