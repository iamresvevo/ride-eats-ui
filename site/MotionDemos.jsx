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
        <Suspense fallback={<UI.Skeleton width="100%" height={300} />}>
          <IconBrowser animated />
        </Suspense>
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
      return (
        <>
          <UI.Button
            icon="terminal"
            variant="primary"
            onClick={() => setOpen(true)}
          >
            Quick actions <kbd>⌘ K</kbd>
          </UI.Button>
          <UI.CommandMenu
            open={open}
            onOpenChange={setOpen}
            shortcut
            items={[
              {
                value: "new",
                label: "New transfer",
                icon: "plus",
                shortcut: "N",
                onSelect: () => toast("Create a transfer"),
              },
              {
                value: "files",
                label: "Browse files",
                icon: "files",
                keywords: "storage documents",
                onSelect: () => toast("Open files"),
              },
              {
                value: "team",
                label: "Open team",
                icon: "team",
                keywords: "people members",
                onSelect: () => toast("Open team"),
              },
              {
                value: "settings",
                label: "Workspace settings",
                icon: "settings",
                onSelect: () => toast("Open settings"),
              },
            ]}
          />
        </>
      );
    case "collapsible":
      return (
        <UI.Collapsible
          title="Advanced settings"
          open={open}
          onOpenChange={setOpen}
        >
          <UI.Switch
            label="Require approval"
            hint="You decide who gets access."
            checked={loop}
            onChange={setLoop}
          />
          <UI.SettingRow label="Link expires">
            <UI.Badge>7 days</UI.Badge>
          </UI.SettingRow>
        </UI.Collapsible>
      );
    case "steps":
      return (
        <div className="demo-stack" style={{ width: "100%" }}>
          <UI.Steps
            value={value}
            onValueChange={setValue}
            items={[
              {
                value: "details",
                label: "Details",
                description: "Name your transfer",
              },
              { value: "files", label: "Files", description: "Choose files" },
              {
                value: "review",
                label: "Review",
                description: "Ready to send",
              },
            ]}
          />
          <UI.Button
            size="sm"
            onClick={() =>
              setValue(
                value === "details"
                  ? "files"
                  : value === "files"
                    ? "review"
                    : "details",
              )
            }
          >
            Next step
          </UI.Button>
        </div>
      );
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
    case "scroll-area":
      return (
        <UI.ScrollArea
          height={250}
          label="Team members"
          style={{ maxWidth: 380 }}
          header={
            <input
              type="search"
              placeholder="Find a member…"
              aria-label="Filter scroll area"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          }
        >
          {[
            "Alex Rivera",
            "Sam Chen",
            "Jordan Lee",
            "Casey Morgan",
            "Taylor Kim",
            "Drew Parker",
            "Riley James",
            "Morgan Cruz",
          ]
            .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
            .map((name, i) => (
              <div className="scroll-demo-row" key={name}>
                <UI.Avatar name={name} />
                <span>{name}</span>
                <small>{i % 2 ? "Editor" : "Viewer"}</small>
              </div>
            ))}
        </UI.ScrollArea>
      );
    case "separator":
      return (
        <div className="demo-stack" style={{ width: 300, maxWidth: "100%" }}>
          <UI.Button variant="primary">Continue with Ride Eats</UI.Button>
          <UI.Separator label="or continue with" />
          <UI.Button>Email address</UI.Button>
        </div>
      );
    default:
      return null;
  }
}
