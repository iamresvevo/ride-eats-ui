import React, { useState } from "react";
import * as UI from "../react/index.jsx";

export default function CommandDemo() {
  const [open, setOpen] = useState(false),
    [filter, setFilter] = useState("all"),
    [result, setResult] = useState(
      "Open search to create a draft, filter transfers, or change appearance.",
    ),
    [rows, setRows] = useState([
      {
        id: "1",
        name: "Brand assets",
        recipient: "Design team",
        status: "Ready",
      },
      {
        id: "2",
        name: "Launch materials",
        recipient: "Marketing",
        status: "Draft",
      },
    ]);
  const { setTheme } = UI.useTheme();
  const commands = [
    {
      value: "new",
      label: "Create a transfer draft",
      description: "Add a local draft to the list below",
      group: "Actions",
      icon: "plus",
      shortcut: "Alt+N",
      keywords: "new upload files",
      onSelect: () => {
        setRows((old) => [
          ...old,
          {
            id: crypto.randomUUID(),
            name: `Untitled transfer ${old.length + 1}`,
            recipient: "",
            status: "Draft",
          },
        ]);
        setFilter("draft");
        setResult("Created a draft. The list now shows drafts.");
      },
    },
    {
      value: "all",
      label: "Show all transfers",
      group: "Views",
      icon: "files",
      onSelect: () => {
        setFilter("all");
        setResult("Showing all transfers.");
      },
    },
    {
      value: "drafts",
      label: "Show drafts only",
      group: "Views",
      icon: "edit",
      keywords: "filter pending",
      onSelect: () => {
        setFilter("draft");
        setResult("Showing drafts only.");
      },
    },
    {
      value: "appearance",
      label: "Change appearance",
      description: "Choose the light or dark theme",
      group: "Settings",
      icon: "sun",
      items: [
        {
          value: "light",
          label: "Use light theme",
          icon: "sun",
          onSelect: () => {
            setTheme("light");
            setResult("Applied light appearance.");
          },
        },
        {
          value: "dark",
          label: "Use dark theme",
          icon: "moon",
          onSelect: () => {
            setTheme("dark");
            setResult("Applied dark appearance.");
          },
        },
      ],
    },
    {
      value: "validate",
      label: "Check draft recipients",
      description: "Validation errors stay in the command palette",
      group: "Actions",
      icon: "shield-check",
      onSelect: async () => {
        const invalid = rows.find((row) => !row.recipient.trim());
        if (invalid) throw Error(`“${invalid.name}” needs a recipient.`);
        setResult("All draft recipients are present.");
      },
    },
  ];
  return (
    <div className="command-demo">
      <header>
        <div>
          <strong>Transfer commands</strong>
          <small>
            {filter === "draft" ? "Drafts" : "All transfers"} · Local preview
          </small>
        </div>
        <UI.Button
          icon="search"
          variant="primary"
          onClick={() => setOpen(true)}
        >
          Search commands <kbd>⌘K</kbd>
        </UI.Button>
      </header>
      <UI.DataTable
        label="Command result preview"
        rows={
          filter === "draft"
            ? rows.filter((row) => row.status === "Draft")
            : rows
        }
        columns={[
          { key: "name", label: "Transfer" },
          {
            key: "status",
            label: "Status",
            render: (value) => (
              <UI.Badge tone={value === "Ready" ? "good" : "neutral"}>
                {value}
              </UI.Badge>
            ),
          },
        ]}
      />
      <p className="command-demo-result" role="status">
        {result}
      </p>
      <UI.CommandMenu
        open={open}
        onOpenChange={setOpen}
        items={commands}
        shortcut
        label="Transfer commands"
      />
    </div>
  );
}
