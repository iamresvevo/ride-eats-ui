import React, { useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import * as UI from "../react/index.jsx";
import "../css/index.css";
import "./style.css";
const {
  Button,
  Badge,
  Card,
  Header,
  Tabs,
  Chips,
  Dropdown,
  Select,
  SearchSelect,
  Dialog,
  Switch,
  SettingRow,
  Skeleton,
  Bone,
  BoneText,
  DateTimePicker,
  Avatar,
  VerifiedName,
  Icon,
  Pagination,
  Field,
  Stat,
  EmptyState,
  ThemeProvider,
  ToastProvider,
  useTheme,
  useToast,
  Menu,
  MenuItem,
  MenuSub,
  MenuSeparator,
} = UI;
const repo = "https://github.com/iamresvevo/ride-eats-ui";
const components = [
  {
    id: "header",
    name: "Header",
    group: "Navigation",
    description:
      "Your brand. Send’s navigation. One familiar place for the account.",
    detail:
      "Extracted from Send’s Header and AccountMenu. The active pill slides between navigation items, while the measured account shell grows from its loading state without moving the center tabs.",
    code: `<Header\n  brand={{ name: 'Studio', href: '/' }}\n  items={[\n    { value: 'files', label: 'Files', icon: 'files', href: '/files' },\n    { value: 'activity', label: 'Activity', icon: 'chart', href: '/activity' },\n  ]}\n  activeValue={view}\n  onNavigate={item => setView(item.value)}\n  account={{ name: 'Alex Rivera', email: 'alex@example.com', verified: true }}\n  onSignOut={signOut}\n/>`,
    props: [
      [
        "brand",
        "{ name, href?, logoLight?, logoDark? }",
        "Brand label and optional theme logos.",
      ],
      ["items", "{ value, label, href, icon? }[]", "Navigation destinations."],
      ["activeValue", "string", "Current destination."],
      [
        "onNavigate",
        "(item) => void",
        "Optional SPA navigation; standard links work without it.",
      ],
      ["account", "Account | null", "Name, email, avatar and verified."],
      [
        "loading / signingOut",
        "boolean",
        "Account loading and sign-out states.",
      ],
      [
        "menuContent / extras / guestContent",
        "ReactNode",
        "Custom menu rows, trailing controls and signed-out UI.",
      ],
    ],
  },
  {
    id: "dropdown",
    name: "Dropdown",
    group: "Navigation",
    description: "A little menu with a lot of care.",
    detail:
      "Send’s own compound menu: soft entry and exit, automatic upward placement, keyboard navigation, and expandable value groups. Use the array API for a quick start or compose MenuItem and MenuSub yourself.",
    code: `<Dropdown\n  trigger="Actions"\n  items={[\n    { label: 'Edit', icon: 'edit', onSelect: edit },\n    { id: 'sort', label: 'Sort', value: sort, items: [\n      { label: 'Newest', checked: sort === 'Newest', onSelect: () => setSort('Newest') },\n      { label: 'Oldest', checked: sort === 'Oldest', onSelect: () => setSort('Oldest') },\n    ]},\n    { type: 'separator' },\n    { label: 'Delete', icon: 'trash', danger: true, onSelect: remove },\n  ]}\n/>`,
    props: [
      [
        "trigger",
        "ReactNode",
        "Button contents. Use Menu for a custom trigger renderer.",
      ],
      ["items", "MenuRow[]", "Actions, separators, labels and nested options."],
      ["align", "'start' | 'end'", "Align against the trigger."],
      ["label", "string", "Accessible trigger label."],
    ],
  },
  {
    id: "tabs",
    name: "Tabs",
    group: "Navigation",
    description: "A clear choice, with just enough movement.",
    detail:
      "Controlled tabs with counts, roving focus, arrow keys, Home and End. Supply panel IDs to associate your own content panels.",
    code: `<Tabs\n  value={tab}\n  onValueChange={setTab}\n  items={[\n    { value: 'all', label: 'All files', count: 24 },\n    { value: 'shared', label: 'Shared', count: 8 },\n    { value: 'archived', label: 'Archived' },\n  ]}\n/>`,
    props: [
      [
        "items",
        "{ value, label, count?, id?, panelId? }[]",
        "Tab definitions.",
      ],
      ["value", "string", "Selected tab."],
      ["onValueChange", "(value) => void", "Update your controlled state."],
      ["label", "string", "Accessible tab-list name."],
    ],
  },
  {
    id: "button",
    name: "Button",
    group: "Actions",
    description: "The same considered action, everywhere.",
    detail:
      "Send’s ActionButton with a friendlier variant API. Icons, loading labels and disabled states are built in. The primary action uses Send’s high-contrast ink surface.",
    code: `<Button variant="primary" icon="plus" onClick={create}>\n  Create transfer\n</Button>\n<Button variant="secondary">Cancel</Button>\n<Button loading={saving} loadingLabel="Saving…">Save changes</Button>`,
    props: [
      [
        "variant",
        "primary | brand | secondary | ghost | danger | surface",
        "Action emphasis.",
      ],
      ["icon", "string", "Name from Send’s icon set."],
      ["loading / disabled", "boolean", "Prevent interaction during work."],
      ["loadingLabel", "string", "Visible loading text."],
      ["size", "'sm' | 'lg'", "Optional size override."],
      [
        "...props",
        "button attributes",
        "onClick, type, aria-label, className, ref and more.",
      ],
    ],
  },
  {
    id: "select",
    name: "Select",
    group: "Inputs",
    description: "A field that feels like the rest of the app.",
    detail:
      "A controlled single select built with Send’s menu. The selected option shows a check, and the menu flips upward near the bottom of the viewport.",
    code: `<Select\n  label="Status"\n  value={status}\n  onValueChange={setStatus}\n  options={[\n    { value: 'active', label: 'Active' },\n    { value: 'draft', label: 'Draft' },\n    { value: 'archived', label: 'Archived' },\n  ]}\n/>`,
    props: [
      ["options", "{ value, label, disabled? }[]", "Choices."],
      ["value", "string", "Selected value."],
      ["onValueChange", "(value) => void", "Selection callback."],
      ["label", "string", "Accessible field label."],
      ["disabled", "boolean", "Prevent selection."],
    ],
  },
  {
    id: "search-select",
    name: "Search Select",
    group: "Inputs",
    description: "Find the right people, without the friction.",
    detail:
      "Async lookup with debouncing, stale-result protection, selected chips and keyboard navigation. Your application owns the loader and its endpoint.",
    code: `const loadPeople = useCallback(async query => {\n  const res = await fetch('/api/people?q=' + encodeURIComponent(query));\n  if (!res.ok) throw new Error('Could not load people');\n  return res.json(); // [{ value, label, detail? }]\n}, []);\n\n<SearchSelect\n  label="People" load={loadPeople}\n  value={people} onValueChange={setPeople} max={3}\n/>`,
    props: [
      [
        "load",
        "async (query) => Option[]",
        "Keep loader stable with useCallback.",
      ],
      ["value", "Option[]", "Selected options, each with value and label."],
      ["onValueChange", "(items) => void", "Updated selection."],
      ["max", "number", "Maximum selected items; default 50."],
      ["label / placeholder", "string", "Accessible name and prompt."],
    ],
  },
  {
    id: "switch",
    name: "Switch",
    group: "Inputs",
    description: "An honest on or off.",
    detail:
      "Send’s switch, unchanged: label, supporting text, optional icon and a compact animated track. Works with keyboard and controlled state.",
    code: `<Switch\n  label="Email notifications"\n  hint="A quiet update when your files arrive."\n  checked={notifications}\n  onChange={setNotifications}\n/>`,
    props: [
      ["checked", "boolean", "Current state."],
      ["onChange", "(checked) => void", "New boolean state."],
      ["label / hint", "ReactNode", "Main label and supporting text."],
      [
        "icon / disabled / className",
        "optional",
        "Appearance and availability.",
      ],
    ],
  },
  {
    id: "date-time",
    name: "Date & Time",
    group: "Inputs",
    description: "A moment, picked in your app’s own style.",
    detail:
      "Extracted from Send’s scheduling field. A floating month grid sits beside hour and minute lists, with future-only selection and a dialog-aware portal.",
    code: `<DateTimePicker\n  value={scheduledAt}\n  onChange={setScheduledAt}\n  future\n/> // Unix seconds, not milliseconds`,
    props: [
      ["value", "number", "Unix timestamp in seconds."],
      ["onChange", "(timestamp) => void", "Chosen date/time in seconds."],
      ["future", "boolean", "Disable past choices."],
    ],
  },
  {
    id: "dialog",
    name: "Dialog",
    group: "Feedback",
    description: "A focused moment, with a soft landing.",
    detail:
      "Send’s native modal: focus management, scroll lock, Escape, backdrop dismissal and an animated exit. Compose a footer, block dismissal while saving, or use the lower-level Modal.",
    code: `<Dialog\n  open={open}\n  onOpenChange={setOpen}\n  title="Create a folder"\n  footer={<Button variant="primary" onClick={save}>Create folder</Button>}\n>\n  <Field label="Folder name"><input placeholder="Untitled folder" /></Field>\n</Dialog>`,
    props: [
      ["open", "boolean", "Controlled visibility."],
      ["onOpenChange", "(open) => void", "Dismissal callback."],
      ["title / children / footer", "ReactNode", "Header, body and actions."],
      ["size", "'sm' | 'md' | 'lg'", "Dialog width."],
      ["dismissible", "boolean", "Whether Escape/backdrop can dismiss."],
    ],
  },
  {
    id: "skeleton",
    name: "Skeleton",
    group: "Feedback",
    description: "Hold the space. Keep the rhythm.",
    detail:
      "Send’s layout-sized loading primitives. Text bones keep the original line height; shapes stand in for real controls without shifting the layout.",
    code: `<Skeleton label="Loading account">\n  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>\n    <Bone className="bone-avatar-lg" />\n    <div>\n      <strong><BoneText ch={16} /></strong>\n      <p><BoneText ch={24} /></p>\n    </div>\n  </div>\n</Skeleton>`,
    props: [
      ["Skeleton: label", "string", "Accessible loading status."],
      [
        "Bone: className",
        "string",
        "bone-avatar, bone-input, bone-btn and other shapes.",
      ],
      [
        "BoneText: ch",
        "3 | 6 | 10 | 16 | 24 | 36",
        "Approximate character width.",
      ],
    ],
  },
  {
    id: "identity",
    name: "Identity",
    group: "Display",
    description: "Names and faces, given the right weight.",
    detail:
      "Send’s avatar fallback, verified name and original verification mark. Avatar failures fall back to initials; the badge scales beside the name.",
    code: `<Avatar name="Alex Rivera" src={avatarUrl} />\n<VerifiedName name="Alex Rivera" verified />`,
    props: [
      [
        "Avatar: name / src / className",
        "string",
        "Initials fallback and optional image.",
      ],
      [
        "VerifiedName: name / verified",
        "string / boolean",
        "Name with optional verification.",
      ],
      [
        "VerificationBadge: verified",
        "boolean",
        "Display the original Send badge.",
      ],
    ],
  },
  {
    id: "settings",
    name: "Setting Row",
    group: "Layout",
    description: "A list of settings, not a wall of fields.",
    detail:
      "Extracted from Send’s settings: label and hint on the left, a control at its natural size on the right. Rows separate with a quiet hairline.",
    code: `<SettingRow icon="globe" label="Visibility" hint="Who can open this transfer?">\n  <Select label="Visibility" value={visibility} onValueChange={setVisibility}\n    options={[{ value: 'private', label: 'Private' }, { value: 'public', label: 'Public' }]} />\n</SettingRow>`,
    props: [
      ["label / hint / icon", "string", "Setting description and icon name."],
      ["children", "ReactNode", "Control."],
      ["wide", "boolean", "Give the control up to half the row."],
    ],
  },
  {
    id: "pagination",
    name: "Pagination",
    group: "Navigation",
    description: "A simple way through a longer list.",
    detail:
      "Send’s previous/next control with a readable position. The library computes page count from total and pageSize; your app fetches or slices records.",
    code: `<Pagination\n  page={page} pageSize={10} total={42}\n  onPageChange={setPage}\n/>`,
    props: [
      [
        "page / pageSize / total",
        "number",
        "1-based page, rows per page and record count.",
      ],
      ["onPageChange", "(page) => void", "Request a new page."],
      ["disabled", "boolean", "Prevent paging while loading."],
    ],
  },
  {
    id: "toast",
    name: "Toast",
    group: "Feedback",
    description: "A small confirmation. Then out of the way.",
    detail:
      "Use ToastProvider once and useToast anywhere inside it. Timers are cleaned up on unmount; messages are announced politely.",
    code: `const toast = useToast();\n<Button onClick={() => toast('Changes saved', { tone: 'good' })}>\n  Save changes\n</Button>`,
    props: [
      ["toast(message, options?)", "function", "Show a message."],
      ["options.tone", "neutral | good | bad", "Message tone."],
      [
        "options.duration",
        "number",
        "Milliseconds before removal; default 3200.",
      ],
    ],
  },
  {
    id: "field",
    name: "Field",
    group: "Inputs",
    description: "One place for the label, hint, and error.",
    detail:
      "A generic React addition that links the label and supporting message to your input. Use standard input props for browser behavior and validation.",
    code: `<Field label="Email address" hint="We’ll send the receipt here.">\n  <input type="email" placeholder="alex@example.com" />\n</Field>`,
    props: [
      ["label / hint / error", "string", "Field copy and validation feedback."],
      ["children", "ReactElement", "One input, textarea or select."],
      ["id", "string", "Optional stable field identifier."],
    ],
  },
  {
    id: "badge",
    name: "Badge & Stat",
    group: "Display",
    description: "The useful details, at a glance.",
    detail:
      "Compact status and summary primitives from the shared design. Semantic color tokens carry the meaning in light and dark themes.",
    code: `<Badge tone="good">Delivered</Badge>\n<Stat label="Total transfers" value="1,284" hint="This month" />`,
    props: [
      ["Badge: tone", "neutral | good | wait | bad", "Semantic status tone."],
      [
        "Stat: label / value / hint",
        "ReactNode",
        "Summary figures and context.",
      ],
    ],
  },
  {
    id: "empty",
    name: "Empty State",
    group: "Feedback",
    description: "Nothing here yet. A clear next step.",
    detail:
      "Send’s empty state with a quieter explanation and optional action. Works inside lists, cards and full pages.",
    code: `<EmptyState\n  icon="files" title="No files yet"\n  description="Your next idea starts here."\n  action={<Button variant="primary">Upload a file</Button>}\n/>`,
    props: [
      ["title / description", "string", "Empty-state copy."],
      ["icon", "string", "Send icon name."],
      ["action", "ReactNode", "Optional next action."],
    ],
  },
  {
    id: "chips",
    name: "Chips",
    group: "Navigation",
    description: "Quick filters that keep their place.",
    detail:
      "Controlled filter buttons with an accessible pressed state. Use them for filtering a list, rather than switching content panels.",
    code: `<Chips value={filter} onValueChange={setFilter}\n  items={[{ value: 'all', label: 'All files' }, { value: 'mine', label: 'Mine' }]} />`,
    props: [
      ["items", "{ value, label }[]", "Filter options."],
      ["value / onValueChange", "string / callback", "Controlled selection."],
    ],
  },
  {
    id: "card",
    name: "Card",
    group: "Layout",
    description: "A neutral surface. Room for the task.",
    detail:
      "A small layout primitive using the shared surface, radius and spacing tokens. Avoid stacking filled cards inside each other.",
    code: `<Card title="Storage">\n  <p className="muted">Your files, in one place.</p>\n  <Button variant="primary">Manage storage</Button>\n</Card>`,
    props: [
      ["title / children", "ReactNode", "Optional heading and content."],
      [
        "className / ...props",
        "section attributes",
        "Layout and semantic customization.",
      ],
    ],
  },
];
function Demo({ id }) {
  const [tab, setTab] = useState("all"),
    [status, setStatus] = useState("active"),
    [sort, setSort] = useState("Newest"),
    [open, setOpen] = useState(false),
    [checked, setChecked] = useState(true),
    [people, setPeople] = useState([]),
    [date, setDate] = useState(() => Math.floor(Date.now() / 1000) + 3600),
    [page, setPage] = useState(1),
    [view, setView] = useState("files");
  const toast = useToast();
  const load = useCallback(
    async (q) =>
      [
        { value: "alex", label: "Alex Rivera", detail: "alex@example.com" },
        { value: "sam", label: "Sam Chen", detail: "sam@example.com" },
        { value: "jordan", label: "Jordan Lee", detail: "jordan@example.com" },
      ].filter((p) => p.label.toLowerCase().includes(q.toLowerCase())),
    [],
  );
  switch (id) {
    case "header":
      return (
        <div className="header-demo">
          <Header
            brand={{ name: "Studio", href: "#header" }}
            items={[
              {
                value: "files",
                label: "Files",
                icon: "files",
                href: "#header",
              },
              {
                value: "activity",
                label: "Activity",
                icon: "chart",
                href: "#header",
              },
            ]}
            activeValue={view}
            onNavigate={(item) => setView(item.value)}
            account={{
              name: "Alex Rivera",
              email: "alex@example.com",
              verified: true,
            }}
            onSignOut={() => toast("Sign out callback")}
            menuContent={
              <MenuItem icon="settings" onSelect={() => toast("Settings")}>
                Settings
              </MenuItem>
            }
          />
          <div className="header-demo-page">
            <div className="mini-file">
              <Icon name="folder" />
            </div>
            <span>Your workspace, beautifully familiar.</span>
          </div>
        </div>
      );
    case "dropdown":
      return (
        <Dropdown
          trigger={
            <>
              <Icon name="more" /> Actions
            </>
          }
          label="Actions"
          items={[
            {
              label: "Edit details",
              icon: "edit",
              onSelect: () => toast("Edit selected"),
            },
            {
              id: "sort",
              label: "Sort",
              icon: "sort",
              value: sort,
              items: ["Newest", "Oldest"].map((label) => ({
                label,
                checked: sort === label,
                onSelect: () => setSort(label),
              })),
            },
            { type: "separator" },
            {
              label: "Delete",
              icon: "trash",
              danger: true,
              onSelect: () => setOpen(true),
            },
          ]}
        />
      );
    case "tabs":
      return (
        <div className="demo-stack">
          <Tabs
            label="File views"
            value={tab}
            onValueChange={setTab}
            items={[
              { value: "all", label: "All files", count: 24 },
              { value: "shared", label: "Shared", count: 8 },
              { value: "archived", label: "Archived" },
            ]}
          />
          <span className="demo-caption">
            {tab === "all"
              ? "Everything in one place."
              : tab === "shared"
                ? "A little collaboration."
                : "Kept for later."}
          </span>
        </div>
      );
    case "button":
      return (
        <div className="demo-stack">
          <div className="demo-row">
            <Button
              variant="primary"
              icon="plus"
              onClick={() => toast("Ready to create")}
            >
              Create transfer
            </Button>
            <Button onClick={() => toast("Cancelled")}>Cancel</Button>
          </div>
          <div className="demo-row">
            <Button variant="ghost" icon="download">
              Download
            </Button>
            <Button variant="danger" icon="trash">
              Delete
            </Button>
            <Button loading loadingLabel="Saving…" />
          </div>
        </div>
      );
    case "select":
      return (
        <div style={{ width: 230 }}>
          <Select
            label="Status"
            value={status}
            onValueChange={setStatus}
            options={[
              { value: "active", label: "Active" },
              { value: "draft", label: "Draft" },
              { value: "archived", label: "Archived" },
            ]}
          />
        </div>
      );
    case "search-select":
      return (
        <div style={{ width: 320, maxWidth: "100%" }}>
          <SearchSelect
            label="People"
            load={load}
            value={people}
            onValueChange={setPeople}
            max={3}
          />
        </div>
      );
    case "switch":
      return (
        <div className="setting-demo">
          <Switch
            icon="bell"
            label="Email notifications"
            hint="A quiet update when your files arrive."
            checked={checked}
            onChange={setChecked}
          />
          <Switch
            label="Public downloads"
            hint="Anyone with the link can download."
            checked={!checked}
            onChange={(v) => setChecked(!v)}
          />
        </div>
      );
    case "date-time":
      return <DateTimePicker value={date} onChange={setDate} future />;
    case "dialog":
      return (
        <>
          <Button variant="primary" icon="plus" onClick={() => setOpen(true)}>
            Create a folder
          </Button>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            title="Create a folder"
            footer={
              <>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setOpen(false);
                    toast("Folder created", { tone: "good" });
                  }}
                >
                  Create folder
                </Button>
              </>
            }
          >
            <Field label="Folder name">
              <input placeholder="Untitled folder" />
            </Field>
          </Dialog>
        </>
      );
    case "skeleton":
      return (
        <Skeleton label="Loading account">
          <div className="demo-row">
            <Bone className="bone-avatar-lg" />
            <div>
              <strong>
                <BoneText ch={16} />
              </strong>
              <p>
                <BoneText ch={24} />
              </p>
            </div>
          </div>
        </Skeleton>
      );
    case "identity":
      return (
        <div className="demo-row identity-demo">
          <Avatar name="Alex Rivera" />
          <div>
            <VerifiedName name="Alex Rivera" verified />
            <small className="muted">alex@example.com</small>
          </div>
          <Avatar name="Sam Chen" />
        </div>
      );
    case "settings":
      return (
        <div className="setting-demo">
          <SettingRow
            icon="globe"
            label="Visibility"
            hint="Who can open this transfer?"
          >
            <Select
              label="Visibility"
              value={status}
              onValueChange={setStatus}
              options={[
                { value: "active", label: "Private" },
                { value: "draft", label: "Public" },
              ]}
            />
          </SettingRow>
          <SettingRow
            icon="lock"
            label="Require approval"
            hint="You decide who gets access."
          >
            <Switch label="Approval" checked={checked} onChange={setChecked} />
          </SettingRow>
        </div>
      );
    case "pagination":
      return (
        <Pagination
          page={page}
          pageSize={10}
          total={42}
          onPageChange={setPage}
        />
      );
    case "toast":
      return (
        <Button
          variant="primary"
          icon="check"
          onClick={() => toast("Changes saved", { tone: "good" })}
        >
          Save changes
        </Button>
      );
    case "field":
      return (
        <div style={{ width: 320, maxWidth: "100%" }}>
          <Field label="Email address" hint="We’ll send the receipt here.">
            <input type="email" placeholder="alex@example.com" />
          </Field>
        </div>
      );
    case "badge":
      return (
        <div className="demo-stack">
          <div className="demo-row">
            <Badge tone="good">Delivered</Badge>
            <Badge tone="wait">Pending</Badge>
            <Badge tone="bad">Expired</Badge>
          </div>
          <Stat label="Total transfers" value="1,284" hint="This month" />
        </div>
      );
    case "empty":
      return (
        <EmptyState
          title="No files yet"
          description="Your next idea starts here."
          action={
            <Button
              variant="primary"
              icon="upload"
              onClick={() => toast("Upload callback")}
            >
              Upload a file
            </Button>
          }
        />
      );
    case "chips":
      return (
        <Chips
          value={tab}
          onValueChange={setTab}
          items={[
            { value: "all", label: "All files" },
            { value: "mine", label: "Mine" },
            { value: "team", label: "Team" },
          ]}
        />
      );
    case "card":
      return (
        <Card title="Storage">
          <p className="muted">Your files, in one place.</p>
          <Button variant="primary" onClick={() => toast("Manage storage")}>
            Manage storage
          </Button>
        </Card>
      );
    default:
      return null;
  }
}
function Code({ children }) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  return (
    <div className="code-wrap">
      <div className="code-top">
        <span>React · JSX</span>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(children);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            } catch {
              toast("Select and copy the code below");
            }
          }}
        >
          <Icon name={copied ? "check" : "copy"} />
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}
function App() {
  const [current, setCurrent] = useState(
      () => location.hash.slice(1) || "overview",
    ),
    [query, setQuery] = useState(""),
    [mode, setMode] = useState("preview"),
    [mobile, setMobile] = useState(false),
    [accent, setAccent] = useState("#1fa476");
  const { theme, setTheme } = useTheme();
  const selected = components.find((c) => c.id === current);
  const navigate = (id) => {
    setCurrent(id);
    location.hash = id;
    setMode("preview");
    setMobile(false);
    window.scrollTo(0, 0);
  };
  React.useEffect(() => {
    const change = () => setCurrent(location.hash.slice(1) || "overview");
    addEventListener("hashchange", change);
    return () => removeEventListener("hashchange", change);
  }, []);
  return (
    <div
      className="docs-app"
      style={{
        "--brand": accent,
        "--brand-hover": accent,
        "--brand-strong": accent,
      }}
    >
      <header className="docs-top">
        <a
          className="docs-brand"
          href="#overview"
          onClick={() => navigate("overview")}
        >
          <span className="brand-mark">
            <Icon name="send" />
          </span>
          <strong>
            Ride Eats <span>UI</span>
          </strong>
          <Badge>v0.2</Badge>
        </a>
        <div className="top-links">
          <span className="react-tag">
            <span>⚛</span> Built for React
          </span>
          <a href={repo} target="_blank" rel="noreferrer">
            GitHub <Icon name="external" />
          </a>
          <button
            className="theme-toggle"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} />
          </button>
          <button
            className="mobile-toggle"
            aria-label="Toggle navigation"
            onClick={() => setMobile(!mobile)}
          >
            <Icon name="list" />
          </button>
        </div>
      </header>
      <aside className={`docs-sidebar ${mobile ? "is-open" : ""}`}>
        <label className="docs-search">
          <Icon name="search" />
          <input
            aria-label="Find a component"
            placeholder="Find a component…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd>⌕</kbd>
        </label>
        <div className="sidebar-group">
          <span>Get started</span>
          {[
            ["overview", "Introduction"],
            ["installation", "Installation"],
            ["customization", "Customization"],
          ].map(([id, name]) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              className={current === id ? "selected" : ""}
            >
              {name}
              {id === "overview" && <Icon name="next" />}
            </button>
          ))}
        </div>
        {[
          "Navigation",
          "Actions",
          "Inputs",
          "Feedback",
          "Display",
          "Layout",
        ].map((group) => (
          <div className="sidebar-group" key={group}>
            <span>{group}</span>
            {components
              .filter(
                (c) =>
                  c.group === group &&
                  c.name.toLowerCase().includes(query.toLowerCase()),
              )
              .map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate(c.id)}
                  className={current === c.id ? "selected" : ""}
                >
                  {c.name}
                  {["header", "dropdown", "dialog"].includes(c.id) && (
                    <small>Send</small>
                  )}
                </button>
              ))}
          </div>
        ))}
        <a
          className="sidebar-footer"
          href={`${repo}/blob/main/AGENTS.md`}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="terminal" />
          <span>
            Building with AI?<small>Start with AGENTS.md ↗</small>
          </span>
        </a>
      </aside>
      <main className="docs-main">
        {selected ? (
          <>
            <div className="breadcrumb">
              Components <Icon name="next" /> {selected.group}{" "}
              <Icon name="next" />
              <span>{selected.name}</span>
            </div>
            <div className="component-title">
              <div>
                <div className="eyebrow">{selected.group}</div>
                <h1>{selected.name}</h1>
              </div>
              <a
                className="source-link"
                href={`${repo}/tree/main/react`}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="terminal" /> Source ↗
              </a>
            </div>
            <p className="component-description">{selected.detail}</p>
            <div className="preview-bar">
              <div className="view-tabs">
                <button
                  className={mode === "preview" ? "active" : ""}
                  onClick={() => setMode("preview")}
                >
                  <Icon name="eye" /> Preview
                </button>
                <button
                  className={mode === "code" ? "active" : ""}
                  onClick={() => setMode("code")}
                >
                  <Icon name="terminal" /> Code
                </button>
              </div>
              <div className="preview-meta">
                <span className="status-dot" /> Interactive React component
              </div>
            </div>
            {mode === "preview" ? (
              <div className={`preview-stage preview-${selected.id}`}>
                <div className="stage-corner">{selected.name}</div>
                <Demo key={selected.id} id={selected.id} />
                <span className="stage-note">
                  Try it. It’s the real component.
                </span>
              </div>
            ) : (
              <Code>{selected.code}</Code>
            )}
            <section className="usage-section">
              <div className="section-label">
                <span>01</span>
                <h2>Usage</h2>
              </div>
              <Code>{`import { ${
                selected.id === "skeleton"
                  ? "Skeleton, Bone, BoneText"
                  : selected.id === "dialog"
                    ? "Dialog, Field, Button"
                    : selected.id === "card"
                      ? "Card, Button"
                      : selected.id === "empty"
                        ? "EmptyState, Button"
                        : selected.id === "identity"
                          ? "Avatar, VerifiedName"
                          : selected.id === "settings"
                            ? "SettingRow, Select"
                            : selected.id === "badge"
                              ? "Badge, Stat"
                              : selected.id === "date-time"
                                ? "DateTimePicker"
                                : selected.id === "search-select"
                                  ? "SearchSelect"
                                  : selected.id === "empty"
                                    ? "EmptyState"
                                    : selected.id === "toast"
                                      ? "Button, useToast"
                                      : selected.name.replaceAll(" ", "")
              } } from '@ride-eats/ui';\n\n${selected.code}`}</Code>
            </section>
            <section className="usage-section">
              <div className="section-label">
                <span>02</span>
                <h2>Props</h2>
              </div>
              <div className="props-scroll">
                <table className="props-table">
                  <thead>
                    <tr>
                      <th>Prop</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.props.map(([name, type, description]) => (
                      <tr key={name}>
                        <td>
                          <code>{name}</code>
                        </td>
                        <td>
                          <code>{type}</code>
                        </td>
                        <td>{description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <div className="component-next">
              <span>Small pieces. One familiar design.</span>
              <Button
                icon="next"
                onClick={() =>
                  navigate(
                    components[
                      (components.indexOf(selected) + 1) % components.length
                    ].id,
                  )
                }
              >
                Next component
              </Button>
            </div>
          </>
        ) : current === "installation" ? (
          <>
            <div className="eyebrow">Get started</div>
            <h1>Make yourself at home.</h1>
            <p className="component-description">
              Install from GitHub, add the styles once, and start with a single
              component. React 19 or newer.
            </p>
            <h2 className="doc-heading">1. Install a reviewed version</h2>
            <Code>{"npm install github:iamresvevo/ride-eats-ui#v0.2.0"}</Code>
            <h2 className="doc-heading">2. Add the providers and styles</h2>
            <Code>{`import { ThemeProvider, ToastProvider, Button } from '@ride-eats/ui';\nimport '@ride-eats/ui/styles.css';\n\nexport default function App() {\n  return (\n    <ThemeProvider defaultTheme="system">\n      <ToastProvider>\n        <Button variant="primary">Hello, Studio</Button>\n      </ToastProvider>\n    </ThemeProvider>\n  );\n}`}</Code>
            <h2 className="doc-heading">3. Make it yours</h2>
            <p className="component-description">
              Pass your brand, routes and account into Header. Keep API calls
              and authentication in your app. The library owns how the controls
              look and behave.
            </p>
            <Button onClick={() => navigate("header")}>
              Start with Header <Icon name="next" />
            </Button>
            <p className="fine-print">
              The package ships JSX source for Vite and other JSX-capable
              bundlers. Next.js: use a client component and transpilePackages:
              ['@ride-eats/ui']. It is not published to npm.
            </p>
          </>
        ) : current === "customization" ? (
          <>
            <div className="eyebrow">Make it yours</div>
            <h1>
              Same foundation.
              <br />
              Your own character.
            </h1>
            <p className="component-description">
              Use props for content and behavior. Use CSS custom properties for
              color, shape and spacing. No component forks required.
            </p>
            <div className="customizer">
              <div>
                <h2>Choose your accent</h2>
                <p className="muted">The preview updates immediately.</p>
              </div>
              <div className="swatches">
                {["#1fa476", "#6d5ce7", "#d66a36", "#337bbd"].map((color) => (
                  <button
                    key={color}
                    style={{ background: color }}
                    aria-label={`Accent ${color}`}
                    aria-pressed={accent === color}
                    onClick={() => setAccent(color)}
                  >
                    {accent === color ? "✓" : ""}
                  </button>
                ))}
              </div>
            </div>
            <div className="preview-stage">
              <div className="demo-stack">
                <Button variant="brand" icon="plus">
                  Create something
                </Button>
                <Switch checked label="Made for you" onChange={() => {}} />
              </div>
            </div>
            <Code>{`:root {\n  --brand: ${accent};\n  --brand-hover: ${accent};\n  --brand-strong: ${accent};\n  --r-sm: 12px;\n  --r-lg: 24px;\n  --content: 1132px;\n}`}</Code>
            <p className="fine-print">
              Override tokens after the library stylesheet, or on a wrapper for
              a subtree. Body-level toast and date-picker portals inherit global
              tokens. All supplied labels are yours to translate.
            </p>
          </>
        ) : (
          <>
            <div className="intro-kicker">
              <span className="status-dot" /> FROM RIDE EATS SEND · NOW REUSABLE
            </div>
            <h1 className="intro-title">
              Familiar by design.
              <br />
              <span>Yours to build with.</span>
            </h1>
            <p className="intro-copy">
              The little details that make Send feel right.
              <br />
              Extracted into customizable React components.
            </p>
            <div className="intro-actions">
              <Button
                variant="primary"
                icon="next"
                onClick={() => navigate("installation")}
              >
                Start building
              </Button>
              <a
                className="intro-source"
                href={repo}
                target="_blank"
                rel="noreferrer"
              >
                Explore the source <Icon name="external" />
              </a>
            </div>
            <div className="intro-facts">
              <span>
                <strong>{components.length}</strong> component pages
              </span>
              <span>
                <strong>React 19</strong> native components
              </span>
              <span>
                <strong>Light & dark</strong> considered together
              </span>
            </div>
            <div className="collection-heading">
              <div>
                <div className="eyebrow">THE COLLECTION</div>
                <h2>Small pieces. Thoughtfully made.</h2>
              </div>
              <span>Live, not screenshots.</span>
            </div>
            <div className="collection-grid">
              {[
                "dropdown",
                "tabs",
                "switch",
                "button",
                "identity",
                "skeleton",
              ].map((id) => {
                const item = components.find((c) => c.id === id);
                return (
                  <article key={id} className="collection-card">
                    <div className="collection-preview">
                      <Demo id={id} />
                    </div>
                    <button
                      className="collection-info"
                      onClick={() => navigate(id)}
                    >
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.description}</span>
                      </div>
                      <Icon name="next" />
                    </button>
                  </article>
                );
              })}
            </div>
            <div className="featured-header">
              <div>
                <div className="eyebrow">THE FAMILIAR SHELL</div>
                <h2>One Header. Your whole app.</h2>
                <p>
                  Bring your brand and routes.
                  <br />
                  Keep Send’s motion and account menu.
                </p>
                <Button onClick={() => navigate("header")}>
                  Explore Header <Icon name="next" />
                </Button>
              </div>
              <Code>{`<Header\n  brand={{ name: 'Studio' }}\n  items={navigation}\n  activeValue={view}\n  account={account}\n  onSignOut={signOut}\n/>`}</Code>
            </div>
            <div className="collection-heading">
              <div>
                <div className="eyebrow">EVERYTHING ELSE</div>
                <h2>Ready for the everyday.</h2>
              </div>
            </div>
            <div className="index-grid">
              {components.map((c) => (
                <button key={c.id} onClick={() => navigate(c.id)}>
                  <span>{c.name}</span>
                  <Icon name="next" />
                </button>
              ))}
            </div>
          </>
        )}
        <footer className="docs-footer">
          <span>
            Ride Eats UI <span className="footer-dot">·</span> Built from the
            details.
          </span>
          <a
            href={`${repo}/blob/main/docs/source-map.md`}
            target="_blank"
            rel="noreferrer"
          >
            Extracted from Send ↗
          </a>
        </footer>
      </main>
    </div>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <ToastProvider>
        <UI.Tooltips />
        <App />
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
