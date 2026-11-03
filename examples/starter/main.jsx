import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  UIProvider,
  Header,
  Button,
  PageHeader,
  Grid,
  StatCard,
  Card,
  DataTable,
  Badge,
  Toolbar,
  Dialog,
  Field,
  Icon,
  useConfirm,
  useToast,
} from "@ride-eats/ui";
import "@ride-eats/ui/styles.css";
import "./style.css";

const initialRows = [
  { id: "1", name: "Campaign assets", owner: "Alex Rivera", status: "Ready" },
  { id: "2", name: "Brand guidelines", owner: "Sam Chen", status: "Draft" },
  { id: "3", name: "Launch photos", owner: "Jordan Lee", status: "Ready" },
];
function Workspace() {
  const [rows, setRows] = useState(initialRows),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState([]),
    [sort, setSort] = useState({ key: "name", direction: "asc" }),
    [open, setOpen] = useState(false),
    [name, setName] = useState("");
  const confirm = useConfirm(),
    toast = useToast();
  const filtered = useMemo(
    () =>
      rows
        .filter((row) => row.name.toLowerCase().includes(query.toLowerCase()))
        .sort(
          (a, b) =>
            String(a[sort.key]).localeCompare(String(b[sort.key])) *
            (sort.direction === "asc" ? 1 : -1),
        ),
    [rows, query, sort],
  );
  const requestClose = async () => {
    if (
      !name.trim() ||
      (await confirm({
        title: "Discard changes?",
        message: "Your new folder has not been saved.",
        cancelLabel: "Keep editing",
        confirmLabel: "Discard changes",
        danger: true,
      }))
    ) {
      setOpen(false);
      setName("");
    }
  };
  const save = () => {
    setRows((current) => [
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        owner: "You",
        status: "Draft",
      },
      ...current,
    ]);
    setName("");
    setOpen(false);
    toast("Folder created", { tone: "good" });
  };
  return (
    <>
      <Header
        brand={{ name: "Workspace", href: "/" }}
        items={[{ value: "files", label: "Files", icon: "files", href: "/" }]}
        activeValue="files"
        account={{ name: "Alex Rivera", email: "alex@example.com" }}
        menuContent={null}
        onSignOut={() => toast("Connect your sign-out endpoint")}
      />
      <main className="site-page stack">
        <PageHeader
          title="Your workspace"
          description="Shared work, in one familiar place."
          icon="layout-dashboard"
          actions={
            <Button variant="primary" icon="plus" onClick={() => setOpen(true)}>
              Create folder
            </Button>
          }
        />
        <Grid preset="metrics">
          <StatCard
            label="Folders"
            value={rows.length}
            hint="In this workspace"
          />
          <StatCard
            label="Ready to share"
            value={rows.filter((row) => row.status === "Ready").length}
            tone="good"
          />
          <StatCard label="Team members" value="3" icon="users" />
        </Grid>
        <Card
          title="Folders"
          description="A working example with your own data and callbacks."
        >
          <Toolbar trailing={<Badge>{selected.length} selected</Badge>}>
            <input
              type="search"
              placeholder="Find a folder…"
              aria-label="Find a folder"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Toolbar>
          <DataTable
            rows={filtered}
            columns={[
              { key: "name", label: "Name", sortable: true },
              { key: "owner", label: "Owner", sortable: true },
              {
                key: "status",
                label: "Status",
                render: (status) => (
                  <Badge tone={status === "Ready" ? "good" : "neutral"}>
                    {status}
                  </Badge>
                ),
              },
            ]}
            sort={sort}
            onSortChange={setSort}
            selectedKeys={selected}
            onSelectionChange={setSelected}
            rowActions={(row) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast(`Open ${row.name}`)}
              >
                View
              </Button>
            )}
          />
        </Card>
      </main>
      <Dialog
        open={open}
        onOpenChange={requestClose}
        title="Create a folder"
        footer={
          <>
            <Button onClick={requestClose}>Cancel</Button>
            <Button variant="primary" disabled={!name.trim()} onClick={save}>
              Create folder
            </Button>
          </>
        }
      >
        <Field label="Folder name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Campaign assets"
          />
        </Field>
      </Dialog>
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UIProvider>
      <Workspace />
    </UIProvider>
  </React.StrictMode>,
);
