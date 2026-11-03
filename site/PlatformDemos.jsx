import React, { useState } from "react";
import * as UI from "../react/index.jsx";
const people = [
  { value: "alex", label: "Alex Rivera", description: "Design team" },
  { value: "sam", label: "Sam Chen", description: "Engineering" },
  { value: "jordan", label: "Jordan Lee", description: "Support" },
  { value: "inactive", label: "Archived account", disabled: true },
];
const members = [
  {
    id: "a",
    name: "Alex Rivera",
    email: "alex@example.com",
    role: "Owner",
    status: "Active",
  },
  {
    id: "b",
    name: "Sam Chen",
    email: "sam@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: "c",
    name: "Jordan Lee",
    email: "jordan@example.com",
    role: "Viewer",
    status: "Invited",
  },
];
const records = Array.from({ length: 1500 }, (_, index) => ({
  id: String(index + 1),
  name:
    ["Alex Rivera", "Sam Chen", "Jordan Lee", "Casey Morgan", "Drew Parker"][
      index % 5
    ] +
    " " +
    (index + 1),
  email: `member${index + 1}@example.com`,
  role: ["Owner", "Editor", "Viewer"][index % 3],
  status: index % 4 ? "Active" : "Invited",
}));
const initialThreads = [
  {
    id: "1",
    name: "Alex Rivera",
    subject: "Help with a shared link",
    status: "Open",
    time: "5m",
    messages: [
      {
        id: "a",
        author: "Alex Rivera",
        text: "Can I update the expiry date after sharing?",
        time: "10:14",
      },
      {
        id: "b",
        author: "You",
        text: "Yes. Open the transfer and choose its expiry date.",
        own: true,
        time: "10:16",
      },
    ],
  },
  {
    id: "2",
    name: "Sam Chen",
    subject: "Workspace invitation",
    status: "Open",
    time: "12m",
    messages: [
      {
        id: "c",
        author: "Sam Chen",
        text: "Where can I invite a teammate?",
        time: "09:42",
      },
    ],
  },
];
const workspaces = [
  {
    value: "studio",
    label: "Design Studio",
    description: "12 members",
    icon: "palette",
  },
  {
    value: "platform",
    label: "Platform",
    description: "8 members",
    icon: "layers",
  },
];
const activity = [
  {
    id: "1",
    title: "Alex shared Brand assets",
    description: "The design team now has access.",
    time: "2m ago",
    icon: "share-2",
  },
  {
    id: "2",
    title: "Sam uploaded 3 files",
    description: "Added to Launch materials.",
    time: "14m ago",
    icon: "upload",
  },
  {
    id: "3",
    title: "Jordan joined the workspace",
    time: "1h ago",
    icon: "user-plus",
  },
];
export default function PlatformDemos({ id }) {
  const [person, setPerson] = useState("alex"),
    [teams, setTeams] = useState(["alex"]),
    [tag, setTag] = useState(""),
    [text, setText] = useState(""),
    [workspaceName, setWorkspaceName] = useState("Design Studio"),
    [transferName, setTransferName] = useState("Brand assets"),
    [range, setRange] = useState({ start: "2026-11-02", end: "2026-11-09" }),
    [time, setTime] = useState("09:00"),
    [saved, setSaved] = useState(false),
    [virtual, setVirtual] = useState(false),
    [sheet, setSheet] = useState(false),
    [command, setCommand] = useState(false),
    [share, setShare] = useState(false),
    [access, setAccess] = useState(false),
    [workspace, setWorkspace] = useState("studio"),
    [view, setView] = useState("overview"),
    [team, setTeam] = useState(members),
    [files, setFiles] = useState([
      {
        id: "1",
        name: "Brand assets",
        type: "folder",
        size: "12 files",
        owner: "Alex Rivera",
        updated: "Today",
      },
      {
        id: "2",
        name: "Launch brief.pdf",
        type: "file",
        size: "284 KB",
        owner: "Sam Chen",
        updated: "Yesterday",
      },
      {
        id: "3",
        name: "Homepage.fig",
        type: "file",
        size: "4.2 MB",
        owner: "Alex Rivera",
        updated: "Nov 1",
      },
    ]),
    [threads, setThreads] = useState(initialThreads),
    [thread, setThread] = useState("1"),
    [notify, setNotify] = useState([
      {
        id: "1",
        title: "Your transfer is ready",
        description: "Brand assets can now be shared.",
        time: "2m ago",
        read: false,
        icon: "check",
      },
      {
        id: "2",
        title: "Sam joined Design Studio",
        time: "15m ago",
        read: false,
        icon: "user-plus",
      },
      {
        id: "3",
        title: "Weekly summary",
        time: "Yesterday",
        read: true,
        icon: "chart",
      },
    ]),
    [uploads, setUploads] = useState([
      {
        id: "1",
        name: "Brand guidelines.pdf",
        status: "uploading",
        progress: 40,
      },
      { id: "2", name: "Logo.svg", status: "done", progress: 100 },
      {
        id: "3",
        name: "Product shots.zip",
        status: "error",
        error: "Connection interrupted",
      },
    ]);
  const toast = UI.useToast();
  const notification = (
    <UI.NotificationCenter
      items={notify}
      onRead={(id) =>
        setNotify((old) =>
          old.map((item) => (item.id === id ? { ...item, read: true } : item)),
        )
      }
      onReadAll={() =>
        setNotify((old) => old.map((item) => ({ ...item, read: true })))
      }
    />
  );
  const switcher = (
    <UI.WorkspaceSwitcher
      items={workspaces}
      value={workspace}
      onValueChange={setWorkspace}
    />
  );
  const columns = [
    { key: "name", label: "Member", pinned: true, width: 210 },
    { key: "email", label: "Email", width: 210 },
    { key: "role", label: "Role", width: 110 },
    {
      key: "status",
      label: "Status",
      width: 110,
      render: (value) => (
        <UI.Badge tone={value === "Active" ? "good" : "neutral"}>
          {value}
        </UI.Badge>
      ),
    },
  ];
  switch (id) {
    case "textarea":
      return (
        <div className="platform-form-demo">
          <UI.Textarea
            label="Description"
            value={text}
            onChange={(event) => setText(event.target.value)}
            hint="A short description keeps the team aligned."
          />
          <small className="muted">{text.length} characters</small>
        </div>
      );
    case "form":
      return (
        <div className="platform-form-demo">
          <UI.Form
            initialValues={{ name: "", email: "" }}
            validate={(values) => ({
              name: values.name.trim() ? undefined : "Enter your name",
              email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
                ? undefined
                : "Enter a valid email",
            })}
            onSubmit={() => {
              setSaved(true);
              toast("Profile saved locally", { tone: "good" });
            }}
          >
            {({ field, errors, submitting, reset }) => (
              <>
                <UI.Field label="Full name" error={errors.name}>
                  <input {...field("name")} placeholder="Alex Rivera" />
                </UI.Field>
                <UI.Field label="Email" error={errors.email}>
                  <input
                    {...field("email")}
                    inputMode="email"
                    placeholder="alex@example.com"
                  />
                </UI.Field>
                <div className="re-form-actions">
                  <UI.Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      reset();
                      setSaved(false);
                    }}
                  >
                    Reset
                  </UI.Button>
                  <UI.Button size="sm" type="submit" loading={submitting}>
                    Save profile
                  </UI.Button>
                </div>
                {saved && <UI.Badge tone="good">Saved locally</UI.Badge>}
              </>
            )}
          </UI.Form>
        </div>
      );
    case "combobox":
      return (
        <UI.Flex direction="column" style={{ width: "100%", maxWidth: 420 }}>
          <UI.Combobox
            label="Assignee"
            options={people}
            value={person}
            onValueChange={setPerson}
          />
          <UI.Combobox
            multiple
            label="Notify teammates"
            options={people}
            value={teams}
            onValueChange={setTeams}
            hint="Choose one or more people."
          />
        </UI.Flex>
      );
    case "date-range-picker":
      return (
        <div className="platform-form-demo">
          <UI.DateRangePicker
            value={range}
            onValueChange={setRange}
            label="Reporting period"
          />
        </div>
      );
    case "time-picker":
      return (
        <div className="platform-form-demo">
          <UI.TimePicker
            value={time}
            onValueChange={setTime}
            label="Opening time"
          />
        </div>
      );
    case "upload-progress":
      return (
        <div className="platform-form-demo">
          <UI.UploadProgress
            files={uploads}
            onCancel={(id) =>
              setUploads((old) =>
                old.map((file) =>
                  file.id === id ? { ...file, status: "cancelled" } : file,
                ),
              )
            }
            onRetry={(id) =>
              setUploads((old) =>
                old.map((file) =>
                  file.id === id
                    ? {
                        ...file,
                        status: "uploading",
                        progress: 0,
                        error: undefined,
                      }
                    : file,
                ),
              )
            }
          />
          <UI.Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setUploads((old) =>
                old.map((file) =>
                  file.status === "uploading"
                    ? {
                        ...file,
                        progress: Math.min(100, file.progress + 20),
                        status: file.progress >= 80 ? "done" : "uploading",
                      }
                    : file,
                ),
              )
            }
          >
            Advance demo progress
          </UI.Button>
        </div>
      );
    case "data-grid":
      return (
        <div className="platform-wide-demo">
          <div className="platform-demo-options">
            <UI.Switch
              label="Virtualize 1,500 rows"
              checked={virtual}
              onChange={setVirtual}
            />
            <small>Search, filter, select, resize and toggle columns.</small>
          </div>
          <UI.DataGrid
            key={String(virtual)}
            label="Workspace members"
            rows={virtual ? records : records.slice(0, 24)}
            columns={columns}
            virtual={virtual}
            filters={[
              {
                key: "role",
                label: "Role",
                options: ["Owner", "Editor", "Viewer"].map((value) => ({
                  value,
                  label: value,
                })),
              },
            ]}
            bulkActions={[
              {
                value: "export",
                label: "Export selected",
                onSelect: (rows) =>
                  toast(`${rows.length} records selected for export`),
              },
            ]}
            renderExpanded={
              virtual
                ? undefined
                : (row) => (
                    <div>
                      <strong>{row.name}</strong>
                      <p>
                        {row.email} · Member #{row.id}
                      </p>
                    </div>
                  )
            }
          />
        </div>
      );
    case "workspace-switcher":
      return <div className="platform-form-demo">{switcher}</div>;
    case "notification-center":
      return notification;
    case "app-shell":
      return (
        <div className="platform-wide-demo">
          <UI.CommandMenu
            open={command}
            onOpenChange={setCommand}
            shortcut
            items={[
              {
                value: "overview",
                label: "Open overview",
                icon: "layout-dashboard",
                onSelect: () => setView("overview"),
              },
              {
                value: "team",
                label: "Open team",
                icon: "users",
                onSelect: () => setView("team"),
              },
              {
                value: "files",
                label: "Open files",
                icon: "folder",
                onSelect: () => setView("files"),
              },
              {
                value: "activity",
                label: "Open activity",
                icon: "activity",
                onSelect: () => setView("activity"),
              },
            ]}
          />
          <UI.AppShell
            brand="Studio"
            items={[
              {
                value: "overview",
                label: "Overview",
                icon: "layout-dashboard",
              },
              { value: "files", label: "Files", icon: "folder", count: 3 },
              { value: "team", label: "Team", icon: "users" },
              { value: "activity", label: "Activity", icon: "activity" },
            ]}
            value={view}
            onValueChange={setView}
            workspace={switcher}
            search={
              <UI.Button
                size="sm"
                variant="ghost"
                icon="search"
                onClick={() => setCommand(true)}
              >
                Search workspace… <kbd>⌘K</kbd>
              </UI.Button>
            }
            actions={notification}
          >
            {view === "activity" ? (
              <UI.Timeline variant="feed" items={activity} />
            ) : (
              <>
                <div className="re-workflow-heading">
                  <h2>
                    {view === "overview"
                      ? "Workspace overview"
                      : view === "files"
                        ? "Your files"
                        : "Your team"}
                  </h2>
                  <UI.Badge tone="good">Live demo</UI.Badge>
                </div>
                {view === "overview" ? (
                  <>
                    <UI.Grid preset="metrics" columns={3}>
                      <UI.StatCard
                        label="Files"
                        value="24"
                        hint="In your workspace"
                      />
                      <UI.StatCard label="Members" value="12" hint="3 online" />
                      <UI.StatCard
                        label="Storage"
                        value="2.4 GB"
                        hint="Of 10 GB"
                      />
                    </UI.Grid>
                    <UI.Timeline variant="feed" items={activity.slice(0, 2)} />
                  </>
                ) : (
                  <UI.DataGrid
                    rows={view === "team" ? members : files}
                    columns={
                      view === "team"
                        ? columns.filter((column) => column.key !== "email")
                        : [
                            { key: "name", label: "Name", width: 200 },
                            { key: "size", label: "Size", width: 90 },
                          ]
                    }
                    label={view === "team" ? "Members" : "Files"}
                  />
                )}
              </>
            )}
          </UI.AppShell>
        </div>
      );
    case "bottom-sheet":
      return (
        <>
          <UI.Button onClick={() => setSheet(true)}>
            Open settings sheet
          </UI.Button>
          <UI.BottomSheet
            open={sheet}
            onClose={() => setSheet(false)}
            title="Transfer settings"
            footer={
              <UI.Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSheet(false);
                  toast("Settings updated for this preview", { tone: "good" });
                }}
              >
                Save changes
              </UI.Button>
            }
          >
            <>
              <UI.Field label="Transfer name">
                <input
                  value={transferName}
                  onChange={(event) => setTransferName(event.target.value)}
                  placeholder="Brand assets"
                />
              </UI.Field>
              <UI.Switch
                label="Notify my team"
                checked={saved}
                onChange={setSaved}
              />
            </>
          </UI.BottomSheet>
        </>
      );
    case "context-menu":
      return (
        <UI.ContextMenu
          label="File context actions"
          items={[
            {
              value: "open",
              label: "Open file",
              icon: "external",
              onSelect: () => toast("Open action selected"),
            },
            {
              value: "sort",
              label: "Sort by",
              icon: "sort",
              items: [
                {
                  value: "name",
                  label: "Name",
                  onSelect: () => toast("Sorted by name"),
                },
                {
                  value: "date",
                  label: "Newest first",
                  onSelect: () => toast("Sorted by date"),
                },
              ],
            },
            { value: "divider", separator: true },
            {
              value: "delete",
              label: "Delete",
              destructive: true,
              icon: "trash",
              onSelect: () => toast("Demo delete action selected"),
            },
          ]}
        >
          <div className="platform-context-card">
            <UI.Icon name="folder" size={28} />
            <strong>Project files</strong>
            <small>Right-click here, or focus and press Shift+F10.</small>
          </div>
        </UI.ContextMenu>
      );
    case "sticky-bar":
      return <StickyDemo />;
    case "nested-popovers":
      return (
        <UI.Popover
          open={share}
          onOpenChange={setShare}
          label="Share settings"
          trigger={(props) => <UI.Button {...props}>Share settings</UI.Button>}
        >
          <div className="platform-nested">
            <strong>Share with your team</strong>
            <p>Choose access before sharing the link.</p>
            <UI.Popover
              open={access}
              onOpenChange={setAccess}
              label="Access settings"
              trigger={(props) => (
                <UI.Button {...props} size="sm" variant="ghost">
                  Access settings
                </UI.Button>
              )}
            >
              <UI.Switch
                label="Allow downloads"
                checked={saved}
                onChange={setSaved}
              />
            </UI.Popover>
          </div>
        </UI.Popover>
      );
    case "settings-panel":
      return (
        <div className="platform-wide-demo">
          <UI.SettingsPanel
            title="Workspace settings"
            description="A few essentials, kept together."
            sections={[
              {
                id: "general",
                icon: "building-2",
                title: "General",
                description: "How your workspace appears to the team.",
                children: (
                  <>
                    <UI.Field label="Workspace name">
                      <input
                        value={workspaceName}
                        onChange={(event) =>
                          setWorkspaceName(event.target.value)
                        }
                      />
                    </UI.Field>
                    <UI.Textarea
                      label="Description"
                      value={tag}
                      onChange={(event) => setTag(event.target.value)}
                      rows={2}
                    />
                  </>
                ),
              },
              {
                id: "notifications",
                icon: "bell",
                title: "Notifications",
                description: "Keep everyone up to date.",
                children: (
                  <UI.Switch
                    label="Email updates"
                    checked={saved}
                    onChange={setSaved}
                  />
                ),
              },
            ]}
            actions={
              <UI.Button
                variant="primary"
                size="sm"
                onClick={() =>
                  toast("Settings updated for this preview", { tone: "good" })
                }
              >
                Save changes
              </UI.Button>
            }
          />
        </div>
      );
    case "team-directory":
      return (
        <div className="platform-wide-demo">
          <UI.TeamDirectory
            members={team}
            onInvite={(values) =>
              setTeam((old) => [
                ...old,
                { ...values, id: crypto.randomUUID(), status: "Invited" },
              ])
            }
            onRoleChange={(id, role) =>
              setTeam((old) =>
                old.map((member) =>
                  member.id === id ? { ...member, role } : member,
                ),
              )
            }
            onRemove={(id) =>
              setTeam((old) => old.filter((member) => member.id !== id))
            }
          />
        </div>
      );
    case "file-manager":
      return (
        <div className="platform-wide-demo">
          <UI.FileManager
            files={files}
            onOpen={(file) => toast(`Opened ${file.name} in this demo`)}
            onUpload={(newFiles) =>
              setFiles((old) => [
                ...old,
                ...newFiles.map((file) => ({
                  id: crypto.randomUUID(),
                  name: file.name,
                  type: "file",
                  size: Math.round(file.size / 1024) + " KB",
                  owner: "You",
                  updated: "Now",
                })),
              ])
            }
            onDelete={(id) =>
              setFiles((old) => old.filter((file) => file.id !== id))
            }
            onDownload={(files) =>
              toast(
                `${files.length} files selected; connect your download handler`,
              )
            }
          />
        </div>
      );
    case "support-inbox":
      return (
        <div className="platform-wide-demo">
          <UI.SupportInbox
            threads={threads}
            value={thread}
            onValueChange={setThread}
            onReply={(id, text) =>
              setThreads((old) =>
                old.map((thread) =>
                  thread.id === id
                    ? {
                        ...thread,
                        messages: [
                          ...thread.messages,
                          {
                            id: crypto.randomUUID(),
                            author: "You",
                            text,
                            own: true,
                            time: "Now",
                          },
                        ],
                      }
                    : thread,
                ),
              )
            }
          />
        </div>
      );
    default:
      return null;
  }
}

function StickyDemo() {
  const [tab, setTab] = useState("payments");
  return (
    <div
      className="floater-demo"
      role="region"
      aria-label="Scrollable floating toolbar example"
      tabIndex={0}
    >
      <UI.PageHeader
        title="Workspace"
        description="Scroll to see Tools’ floating controls and progressive fade."
      />
      <UI.StickyBar offset={0}>
        <UI.Tabs
          value={tab}
          onValueChange={setTab}
          items={[
            { value: "payments", label: "Payments", count: 8 },
            { value: "activity", label: "Activity" },
          ]}
        />
      </UI.StickyBar>
      <div className="floater-demo-rows">
        {Array.from({ length: 12 }, (_, i) => (
          <UI.Card key={i} padding="sm">
            <UI.SettingRow
              label={
                tab === "payments"
                  ? `Transfer ${i + 1}`
                  : `Workspace update ${i + 1}`
              }
              hint="Content stays behind the floating controls."
            >
              <UI.Badge tone="good">Ready</UI.Badge>
            </UI.SettingRow>
          </UI.Card>
        ))}
      </div>
    </div>
  );
}
