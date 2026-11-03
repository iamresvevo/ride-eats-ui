import { ControlDemo } from "./ControlDemos.jsx";
import { ReviewDemo } from "./ReviewDemos.jsx";
import { SpecializedDemo } from "./SpecializedDemos.jsx";
import CatalogBoundary from "./CatalogBoundary.jsx";
import React, { useMemo, useState } from "react";
import * as UI from "../react/index.jsx";
const IconBrowser = React.lazy(() => import("./IconBrowser.jsx"));
const {
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  StatCard,
  Grid,
  Tile,
  PageHeader,
  Toolbar,
  DataTable,
  Checkbox,
  Pagination,
  Dropdown,
  Field,
  Dialog,
  useToast,
  useConfirm,
} = UI;
const people = [
  {
    id: "alex",
    name: "Alex Rivera",
    email: "alex@example.com",
    status: "Active",
    role: "Owner",
  },
  {
    id: "sam",
    name: "Sam Chen",
    email: "sam@example.com",
    status: "Active",
    role: "Editor",
  },
  {
    id: "jordan",
    name: "Jordan Lee",
    email: "jordan@example.com",
    status: "Invited",
    role: "Viewer",
  },
  {
    id: "casey",
    name: "Casey Morgan",
    email: "casey@example.com",
    status: "Active",
    role: "Editor",
  },
  {
    id: "taylor",
    name: "Taylor Kim",
    email: "taylor@example.com",
    status: "Active",
    role: "Viewer",
  },
  {
    id: "drew",
    name: "Drew Parker",
    email: "drew@example.com",
    status: "Invited",
    role: "Viewer",
  },
];
export function TableDemo() {
  const [query, setQuery] = useState(""),
    [sort, setSort] = useState({ key: "name", direction: "asc" }),
    [selected, setSelected] = useState([]),
    [page, setPage] = useState(1);
  const toast = useToast();
  const filtered = useMemo(
    () =>
      people
        .filter((row) =>
          (row.name + " " + row.email)
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .sort(
          (a, b) =>
            a[sort.key].localeCompare(b[sort.key]) *
            (sort.direction === "asc" ? 1 : -1),
        ),
    [query, sort],
  );
  return (
    <div className="table-demo">
      <Toolbar
        trailing={
          <Badge>
            {selected.length
              ? `${selected.length} selected`
              : `${filtered.length} members`}
          </Badge>
        }
      >
        <input
          type="search"
          aria-label="Find a member"
          placeholder="Find a member…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </Toolbar>
      <DataTable
        caption="Team members"
        rows={filtered.slice((page - 1) * 4, page * 4)}
        columns={[
          {
            key: "name",
            label: "Name",
            sortable: true,
            render: (_, row) => (
              <div className="table-person">
                <UI.Avatar name={row.name} />
                <span>
                  <strong>{row.name}</strong>
                  <small>{row.email}</small>
                </span>
              </div>
            ),
          },
          { key: "role", label: "Role", sortable: true, width: 110 },
          {
            key: "status",
            label: "Status",
            width: 110,
            render: (value) => (
              <Badge tone={value === "Active" ? "good" : "wait"}>{value}</Badge>
            ),
          },
        ]}
        sort={sort}
        onSortChange={setSort}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        rowActions={(row) => (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toast(`Open ${row.name}`)}
          >
            View
          </Button>
        )}
      />
      <Pagination
        page={page}
        pageSize={4}
        total={filtered.length}
        onPageChange={setPage}
      />
    </div>
  );
}
export function StackedDialogDemo() {
  const [open, setOpen] = useState(false),
    [name, setName] = useState("");
  const confirm = useConfirm(),
    toast = useToast();
  const requestClose = async () => {
    if (
      !name ||
      (await confirm({
        title: "Discard changes?",
        message:
          "Your folder has not been created. Discard the draft or keep editing.",
        confirmLabel: "Discard changes",
        cancelLabel: "Keep editing",
        danger: true,
      }))
    ) {
      setOpen(false);
      setName("");
    }
  };
  return (
    <div className="demo-stack">
      <Button variant="primary" icon="plus" onClick={() => setOpen(true)}>
        Create a folder
      </Button>
      <span className="demo-caption">
        Type a name, then Cancel to see the stacked confirmation.
      </span>
      <Dialog
        open={open}
        onOpenChange={requestClose}
        title="Create a folder"
        footer={
          <>
            <Button onClick={requestClose}>Cancel</Button>
            <Button
              variant="primary"
              disabled={!name.trim()}
              onClick={() => {
                setOpen(false);
                setName("");
                toast("Folder created", { tone: "good" });
              }}
            >
              Create folder
            </Button>
          </>
        }
      >
        <p
          className="muted"
          style={{ fontSize: 12, lineHeight: 1.7, marginBottom: 16 }}
        >
          Keep your next project organized. Give this folder a name to get
          started.
        </p>
        <Field label="Folder name" hint="You can rename it later.">
          <input
            placeholder="Campaign assets"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
      </Dialog>
    </div>
  );
}
export function CardsDemo() {
  const toast = useToast();
  return (
    <div className="cards-demo">
      <Card
        title="Transfer settings"
        description="A few details before you share."
        action={<Badge tone="good">Ready</Badge>}
        footer={
          <>
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => toast("Saved", { tone: "good" })}
            >
              Save changes
            </Button>
          </>
        }
      >
        <UI.SettingRow
          icon="globe"
          label="Access"
          hint="Who can open this link?"
        >
          <Badge>Anyone with the link</Badge>
        </UI.SettingRow>
        <UI.SettingRow
          icon="clock"
          label="Expires"
          hint="A little time to download."
        >
          <span className="muted" style={{ fontSize: 12 }}>
            7 days
          </span>
        </UI.SettingRow>
      </Card>
      <Card variant="soft">
        <CardHeader
          title="A quieter surface"
          description="Use the compound API for a custom layout."
        />
        <CardBody>
          <p className="muted" style={{ fontSize: 12, lineHeight: 1.7 }}>
            CardHeader, CardBody and CardFooter compose naturally with your own
            content.
          </p>
        </CardBody>
        <CardFooter>
          <UI.CopyButton value="https://example.com/share" label="Copy link" />
        </CardFooter>
      </Card>
    </div>
  );
}
export function CollectionDemo({ id }) {
  const [value, setValue] = useState("delivery"),
    [checked, setChecked] = useState(true),
    [number, setNumber] = useState(64),
    [text, setText] = useState(""),
    [open, setOpen] = useState(false),
    [files, setFiles] = useState([]),
    [alert, setAlert] = useState(true),
    [tab, setTab] = useState("payments");
  const toast = useToast();
  switch (id) {
    case "color-picker":
    case "input-group":
    case "button-group":
      return <ControlDemo id={id} />;
    case "icons":
      return (
        <CatalogBoundary>
          <React.Suspense
            fallback={<UI.PageLoading label="Loading icon catalog" />}
          >
            <IconBrowser />
          </React.Suspense>
        </CatalogBoundary>
      );
    case "data-table":
      return <TableDemo />;
    case "stacked-dialogs":
      return <StackedDialogDemo />;
    case "card":
      return <CardsDemo />;
    case "accordion":
      return (
        <UI.Accordion
          value={value}
          onValueChange={setValue}
          items={[
            {
              value: "delivery",
              title: "How does delivery work?",
              icon: "send",
              content:
                "Your recipient gets a secure download link. They can open it on any device, without installing an app.",
            },
            {
              value: "expiry",
              title: "Can I change the expiry?",
              icon: "clock",
              content:
                "Choose an expiry in transfer settings. Your files stay available until the date you select.",
            },
            {
              value: "access",
              title: "Who can access my files?",
              icon: "lock",
              content:
                "Only people with the link, or the people you explicitly invite.",
            },
          ]}
        />
      );
    case "alert":
      return alert ? (
        <UI.Alert
          tone="good"
          title="Your files are ready"
          onDismiss={() => setAlert(false)}
          action={
            <Button size="sm" onClick={() => toast("Opening transfer")}>
              View transfer
            </Button>
          }
        >
          A secure link is ready to share with your team.
        </UI.Alert>
      ) : (
        <Button onClick={() => setAlert(true)}>Show alert</Button>
      );
    case "checkbox":
      return <CheckboxDemo />;
    case "radio-group":
      return (
        <UI.RadioGroup
          label="Who can access this?"
          value={value === "delivery" ? "private" : value}
          onValueChange={setValue}
          options={[
            {
              value: "private",
              label: "Only invited people",
              description: "A private space for your team.",
              trailing: <UI.Icon name="lock" />,
            },
            {
              value: "public",
              label: "Anyone with the link",
              description: "Easy to share, no account needed.",
              trailing: <UI.Icon name="globe" />,
            },
          ]}
        />
      );
    case "slider":
      return (
        <UI.Slider
          label="Volume"
          value={number}
          onValueChange={setNumber}
          formatValue={(value) => value + "%"}
        />
      );
    case "progress":
      return (
        <div className="demo-stack" style={{ width: 380, maxWidth: "100%" }}>
          <UI.Progress
            label="Uploading campaign assets"
            value={number}
            hint={`${number}% complete · 12 files`}
          />
          <div className="demo-row">
            <Button
              size="sm"
              onClick={() => setNumber((value) => Math.min(100, value + 12))}
            >
              Advance
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setNumber(0)}>
              Reset
            </Button>
          </div>
          <UI.Progress label="Preparing your files" indeterminate />
        </div>
      );
    case "password-input":
      return (
        <div style={{ width: 320, maxWidth: "100%" }}>
          <UI.PasswordInput
            label="Password"
            placeholder="Enter your password"
            autoComplete="new-password"
            value={text}
            onChange={(e) => setText(e.target.value)}
            hint="Keep it memorable. Keep it yours."
          />
        </div>
      );
    case "number-input":
      return (
        <UI.NumberInput
          label="Copies"
          value={number === 64 ? 2 : number}
          onValueChange={setNumber}
          min={1}
          max={20}
        />
      );
    case "breadcrumbs":
      return (
        <UI.Breadcrumbs
          items={[
            { label: "Workspace", href: "#overview" },
            { label: "Transfers", href: "#data-table" },
            { label: "Campaign assets" },
          ]}
        />
      );
    case "avatar-group":
      return (
        <div className="demo-stack">
          <UI.AvatarGroup max={4} people={people} />
          <span className="demo-caption">A shared workspace for six.</span>
        </div>
      );
    case "copy-button":
      return (
        <div className="demo-stack">
          <code className="copy-demo-value">ride-eats.com/shared/creative</code>
          <UI.CopyButton
            value="https://ride-eats.com/shared/creative"
            label="Copy link"
            copiedLabel="Link copied"
          />
        </div>
      );
    case "file-dropzone":
      return (
        <div style={{ width: 420, maxWidth: "100%" }}>
          <UI.FileDropzone accept="image/*,.pdf" onFiles={setFiles} />
          {files.length > 0 && (
            <div className="selected-files">
              {files.map((file) => (
                <div key={file.name}>
                  <UI.Icon name="files" />
                  <span>{file.name}</span>
                  <small>{Math.ceil(file.size / 1024)} KB</small>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    case "timeline":
      return (
        <UI.Flex direction="column" style={{ width: "100%" }}>
          <UI.Timeline
            items={[
              {
                id: 1,
                title: "Transfer delivered",
                description: "Campaign assets reached Alex.",
                time: "Just now",
                icon: "check",
                tone: "good",
              },
              {
                id: 2,
                title: "12 files uploaded",
                description: "48 MB · Ready to share",
                time: "2 minutes ago",
                icon: "upload",
              },
              {
                id: 3,
                title: "Folder created",
                time: "5 minutes ago",
                icon: "folder",
              },
            ]}
          />
          <UI.Timeline
            variant="feed"
            label="Recent activity"
            items={[
              {
                id: "feed1",
                title: "Artwork updated",
                description: "Main logo replaced",
                time: "2m ago",
                icon: "image",
              },
              {
                id: "feed2",
                title: "Season published",
                time: "1h ago",
                icon: "check",
              },
            ]}
          />
        </UI.Flex>
      );
    case "drawer":
      return (
        <>
          <Button variant="primary" icon="list" onClick={() => setOpen(true)}>
            View details
          </Button>
          <UI.Drawer
            open={open}
            onOpenChange={setOpen}
            title="Transfer details"
            footer={
              <Button variant="primary" onClick={() => setOpen(false)}>
                Done
              </Button>
            }
          >
            <UI.SettingRow
              icon="files"
              label="Campaign assets"
              hint="12 files · 48 MB"
            >
              <Badge tone="good">Delivered</Badge>
            </UI.SettingRow>
            <UI.Timeline
              items={[
                {
                  id: 1,
                  title: "Shared with Alex",
                  time: "Just now",
                  icon: "send",
                },
                {
                  id: 2,
                  title: "Upload complete",
                  time: "2 minutes ago",
                  icon: "check",
                  tone: "good",
                },
              ]}
            />
          </UI.Drawer>
        </>
      );
    case "stat-cards":
      return (
        <div className="demo-stat-collection">
          <Grid preset="metrics" min={160}>
            <StatCard label="Payments" value="153" hint="1 open" />
            <StatCard
              label="Paid"
              value="5"
              hint="Available from Drop 1"
              tone="good"
            />
            <StatCard label="Scenarios passed" value="44 / 48" progress={92} />
            <StatCard
              label="Avg. response"
              value="1400 ms"
              hint="300 calls · 6 errors"
            />
          </Grid>
          <Grid preset="metrics" min={180}>
            <StatCard
              label="Downloads"
              value="1,284"
              variant="compact"
              trend="+12.8%"
              chart={[12, 18, 15, 30, 24, 40, 48, 52]}
            />
            <StatCard
              label="Storage used"
              value="64 GB"
              variant="compact"
              hint="of 100 GB"
              progress={64}
            />
            <StatCard
              label="Active team"
              value="24"
              variant="inline"
              hint="Across 3 workspaces"
            />
          </Grid>
        </div>
      );
    case "shortcut-recorder":
    case "text-diff-viewer":
      return <ReviewDemo id={id} />;
    case "image-compare":
    case "tree-view":
    case "signature-pad":
    case "activity-heatmap":
      return <SpecializedDemo id={id} />;
    case "section-nav":
      return (
        <div style={{ height: 380, overflow: "auto" }}>
          <UI.Flex direction="column">
            <UI.Card title="Everything your workspace can do">
              <p>Scroll this preview or choose a section.</p>
            </UI.Card>
            <UI.SectionNav
              items={[
                { id: "demo-send", label: "Send", count: 6 },
                { id: "demo-share", label: "Share", count: 6 },
                { id: "demo-protect", label: "Protect", count: 10 },
                { id: "demo-track", label: "Track", count: 7 },
              ]}
            />
            {["Send", "Share", "Protect", "Track"].map((name) => (
              <UI.Card
                key={name}
                id={`demo-${name.toLowerCase()}`}
                title={name}
              >
                <UI.Flex direction="column">
                  {Array.from({ length: 5 }, (_, i) => (
                    <p key={i}>
                      Reusable components for {name.toLowerCase()} workflows.
                      Section links stay visible while content scrolls.
                    </p>
                  ))}
                </UI.Flex>
              </UI.Card>
            ))}
          </UI.Flex>
        </div>
      );
    case "workbench":
      return <WorkbenchDemo />;
    case "masonry":
      return (
        <UI.Masonry min={200} columns={3} gap={16}>
          {[
            "Quick note",
            "Release checklist",
            "Artwork",
            "Team update",
            "Next steps",
            "Review",
          ].map((title, i) => (
            <Card key={title} title={title}>
              <UI.Flex direction="column" gap={8}>
                {Array.from({ length: (i % 3) + 1 }, (_, n) => (
                  <p key={n}>
                    {
                      [
                        "A short note stays compact.",
                        "A longer update wraps naturally and keeps its own height. The following card packs directly below it.",
                        "Review the artwork and confirm the schedule before publishing.",
                      ][i % 3]
                    }
                  </p>
                ))}
                <Badge>{i % 2 ? "In progress" : "Ready"}</Badge>
              </UI.Flex>
            </Card>
          ))}
        </UI.Masonry>
      );
    case "layout":
      return (
        <UI.Flex direction="column" gap={16}>
          <UI.Tabs
            label="Layout options"
            value={value}
            onValueChange={setValue}
            items={[
              { value: "delivery", label: "Narrow left" },
              { value: "aside", label: "Narrow right" },
              { value: "split", label: "2 : 3 split" },
            ]}
          />
          <UI.Grid
            layout={value === "delivery" ? "sidebar" : value}
            sidebarWidth={260}
            ratio={[2, 3]}
          >
            <Card title="Seasons">
              <UI.Flex direction="column" gap={4}>
                <Tile
                  variant="row"
                  title="A little light, a lot of joy"
                  description="28 Oct to 10 Nov"
                  selected
                  onClick={() => {}}
                  meta={<Badge tone="good">Live</Badge>}
                />
                <Tile
                  variant="row"
                  title="A little spooky, a lot of fun"
                  description="27 Oct to 1 Nov"
                  onClick={() => {}}
                  meta={<Badge>Ended</Badge>}
                />
              </UI.Flex>
            </Card>
            <Card
              title="Season details"
              action={
                <UI.Flex gap={8}>
                  <Button size="sm">Save</Button>
                  <Button size="sm" variant="ghost">
                    Cancel
                  </Button>
                </UI.Flex>
              }
            >
              <UI.Textarea
                label="Message"
                defaultValue="A short message for the season."
              />
              <UI.FileDropzone
                variant="compact"
                label="Main logo"
                description="PNG image · up to 2 MB"
                accept="image/png"
                maxSize={2 * 1024 * 1024}
                multiple={false}
                onFiles={setFiles}
              />
            </Card>
          </UI.Grid>
        </UI.Flex>
      );
    case "tiles":
      return <TileCustomizationDemo />;
    case "page-header":
      return (
        <PageHeader
          title="Payments"
          icon="storage"
          description="Shared across your admin devices."
          actions={
            <Button
              size="sm"
              icon="restore"
              onClick={() => toast("Connection checked", { tone: "good" })}
            >
              Check connection
            </Button>
          }
        />
      );
    case "dashboard":
      return (
        <div className="dashboard-demo stack">
          <PageHeader
            title="Payments"
            icon="storage"
            description="PayBridge sandbox · merchant-test"
            actions={
              <Button
                size="sm"
                onClick={() => toast("Connected", { tone: "good" })}
              >
                Check connection
              </Button>
            }
          />
          <Grid preset="metrics" min={140}>
            <StatCard label="Payments" value="153" hint="1 open" />
            <StatCard
              label="Paid"
              value="5"
              tone="good"
              hint="Available from Drop 1"
            />
            <StatCard label="Scenarios passed" value="44 / 48" hint="48 run" />
          </Grid>
          <UI.Tabs
            value={tab}
            onValueChange={setTab}
            items={[
              { value: "payments", label: "Payments", count: 153 },
              { value: "checkouts", label: "App checkouts" },
              { value: "activity", label: "Activity", count: 300 },
            ]}
          />
          <Card
            title={
              tab === "payments"
                ? "Recent payments"
                : tab === "checkouts"
                  ? "App checkouts"
                  : "Activity"
            }
            description="One shared view across your admin devices."
          >
            <DataTable
              columns={[
                { key: "name", label: "Reference" },
                { key: "amount", label: "Amount", align: "right" },
                {
                  key: "status",
                  label: "Status",
                  render: (v) => (
                    <Badge tone={v === "Paid" ? "good" : "wait"}>{v}</Badge>
                  ),
                },
              ]}
              rows={[
                {
                  id: 1,
                  name: "Payment #1053",
                  amount: "SRD 250.00",
                  status: "Paid",
                },
                {
                  id: 2,
                  name: "Payment #1052",
                  amount: "SRD 180.00",
                  status: "Pending",
                },
              ]}
            />
          </Card>
        </div>
      );
    default:
      return null;
  }
}

export function ToastDemo() {
  const toast = useToast();
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button
          variant="primary"
          icon="check"
          onClick={() => toast("Changes saved", { tone: "good" })}
        >
          Save changes
        </Button>
        <Button
          icon="copy"
          onClick={() => toast("Link copied", { tone: "good" })}
        >
          Copy link
        </Button>
      </div>
      <Button
        variant="ghost"
        onClick={() => {
          toast("Upload complete", { tone: "good" });
          toast("Transfer is ready to share");
          toast("Alex received your files", { tone: "good" });
        }}
      >
        Preview stacked notifications
      </Button>
      <span className="demo-caption">
        Three at most. Repeated messages merge.
      </span>
    </div>
  );
}

export function CheckboxDemo() {
  const [notify, setNotify] = useState(true);
  const [selected, setSelected] = useState(["brief"]);
  const files = [
    { id: "brief", name: "Campaign brief.pdf" },
    { id: "assets", name: "Brand assets.zip" },
  ];
  const mixed = selected.length > 0 && selected.length < files.length;
  return (
    <div className="checkbox-demo">
      <UI.Checkbox
        label="Notify my team"
        hint="One update when the transfer is ready."
        checked={notify}
        onCheckedChange={setNotify}
      />
      <div className="checkbox-demo-group">
        <UI.Checkbox
          label={
            mixed
              ? "Some files selected"
              : selected.length === files.length
                ? "All files selected"
                : "No files selected"
          }
          hint={`${selected.length} of ${files.length} files`}
          checked={selected.length === files.length}
          indeterminate={mixed}
          inputProps={{ "aria-label": "Select all files" }}
          onCheckedChange={(checked) =>
            setSelected(checked ? files.map((file) => file.id) : [])
          }
        />
        <div className="checkbox-demo-files">
          {files.map((file) => (
            <UI.Checkbox
              key={file.id}
              label={file.name}
              checked={selected.includes(file.id)}
              onCheckedChange={(checked) =>
                setSelected((current) =>
                  checked
                    ? [...current, file.id]
                    : current.filter((id) => id !== file.id),
                )
              }
            />
          ))}
        </div>
      </div>
      <UI.Checkbox
        label="Managed by your workspace"
        hint="Controlled by your administrator."
        checked
        disabled
        onCheckedChange={() => {}}
      />
    </div>
  );
}

export function SimpleDialogDemo() {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  return (
    <>
      <Button variant="primary" icon="settings" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Transfer details"
        footer={
          <Button
            variant="primary"
            onClick={() => {
              setOpen(false);
              toast("Details reviewed", { tone: "good" });
            }}
          >
            Done
          </Button>
        }
      >
        <p className="muted" style={{ fontSize: 13, lineHeight: 1.8 }}>
          Campaign assets contains 12 files, ready to share with your team.
        </p>
        <UI.SettingRow label="Access">
          <Badge>Anyone with the link</Badge>
        </UI.SettingRow>
      </Dialog>
    </>
  );
}

function WorkbenchDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open editor layout</Button>
      <UI.Dialog
        open={open}
        onOpenChange={setOpen}
        title="Editor workspace"
        style={{ width: "min(1400px,96vw)", maxWidth: "none" }}
        toolbar={
          <UI.Toolbar>
            <UI.Field label="Workspace name">
              <input defaultValue="Autumn artwork" />
            </UI.Field>
            <Button>Preview</Button>
          </UI.Toolbar>
        }
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Done
            </Button>
          </>
        }
      >
        <UI.Workbench leadingWidth={240} trailingWidth={260}>
          <UI.ScrollArea
            label="Object catalogue"
            header={
              <UI.Flex direction="column">
                <UI.CardHeader title="Objects" />
                <UI.Tabs
                  value="all"
                  onValueChange={() => {}}
                  items={[
                    { value: "all", label: "All objects" },
                    { value: "saved", label: "Saved" },
                  ]}
                />
              </UI.Flex>
            }
          >
            <UI.Flex direction="column">
              {Array.from({ length: 30 }, (_, i) => (
                <UI.Tile
                  key={i}
                  variant="row"
                  title={`Object ${i + 1}`}
                  description="Select an object"
                  onClick={() => {}}
                />
              ))}
            </UI.Flex>
          </UI.ScrollArea>
          <UI.Flex direction="column">
            <UI.Card title="Canvas preview">
              <p>The centre stays in place while either panel scrolls.</p>
            </UI.Card>
            <UI.Toolbar>
              <Button>Move</Button>
              <Button>Rotate</Button>
              <Button>Scale</Button>
            </UI.Toolbar>
          </UI.Flex>
          <UI.ScrollArea
            label="Object options"
            header={<UI.CardHeader title="Object options" />}
            footer={<Button>Reset options</Button>}
          >
            <UI.Flex direction="column">
              {Array.from({ length: 20 }, (_, i) => (
                <UI.Field key={i} label={`Option ${i + 1}`}>
                  <input defaultValue="Value" />
                </UI.Field>
              ))}
            </UI.Flex>
          </UI.ScrollArea>
        </UI.Workbench>
      </UI.Dialog>
    </>
  );
}

function TileCustomizationDemo() {
  const [compact, setCompact] = useState(true),
    [row, setRow] = useState(false),
    [footer, setFooter] = useState(false),
    [size, setSize] = useState(32),
    [columns, setColumns] = useState(3),
    [selected, setSelected] = useState(0);
  return (
    <UI.Flex direction="column">
      <UI.Flex>
        <UI.Switch label="Compact" checked={compact} onChange={setCompact} />
        <UI.Switch label="Rows" checked={row} onChange={setRow} />
        <UI.Switch label="Show footer" checked={footer} onChange={setFooter} />
        <UI.NumberInput
          label="Image size"
          min={24}
          max={96}
          step={4}
          value={size}
          onValueChange={setSize}
        />
        <UI.NumberInput
          label="Maximum columns"
          min={1}
          max={6}
          value={columns}
          onValueChange={setColumns}
        />
      </UI.Flex>
      <UI.Grid
        min={130}
        columns={columns}
        density={compact ? "compact" : "default"}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <UI.Tile
            key={i}
            title={
              [
                "Townhouse · Slender",
                "Townhouse · Grand",
                "Market stall · Fruit",
              ][i % 3]
            }
            icon={["home", "building", "store"][i % 3]}
            variant={row ? "row" : "default"}
            imageSize={size}
            titleLines={2}
            showFooter={footer}
            description="Reusable catalogue tile"
            onClick={() => setSelected(i)}
            selected={i === selected}
          />
        ))}
      </UI.Grid>
    </UI.Flex>
  );
}
