import React, { useState } from "react";
import * as UI from "../react/index.jsx";
export default function CommandDemo() {
  const [open, setOpen] = useState(false),
    [view, setView] = useState("files"),
    [name, setName] = useState("Design Studio"),
    [transfers, setTransfers] = useState([
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
  const { theme, setTheme } = UI.useTheme(),
    toast = UI.useToast();
  const commands = [
    {
      value: "check",
      label: "Check draft readiness",
      description: "Validate recipients before sharing",
      group: "Tools",
      icon: "shield-check",
      keywords: "validate recipient readiness",
      onSelect: async () => {
        const invalid = transfers.find(
          (transfer) => !transfer.recipient.trim(),
        );
        if (invalid)
          throw Error(`Add a recipient to “${invalid.name}” before sharing.`);
        toast("Local drafts are ready", { tone: "good" });
      },
    },
    {
      value: "new-transfer",
      label: "New transfer",
      description: "Create a draft in this workspace",
      group: "Create",
      icon: "plus",
      shortcut: "Alt+N",
      keywords: "send files upload draft",
      onSelect: () => setView("create"),
    },
    {
      value: "files",
      label: "Browse transfers",
      description: "Your drafts and shared files",
      group: "Navigate",
      icon: "files",
      keywords: "storage documents files",
      onSelect: () => setView("files"),
    },
    {
      value: "team",
      label: "Open team",
      description: "View workspace members and roles",
      group: "Navigate",
      icon: "users",
      keywords: "people members",
      onSelect: () => setView("team"),
    },
    {
      value: "settings",
      label: "Workspace settings",
      description: "Profile and appearance commands",
      group: "Navigate",
      icon: "settings",
      items: [
        {
          value: "profile",
          label: "Edit workspace profile",
          description: "Update the workspace name",
          icon: "edit",
          onSelect: () => setView("settings"),
        },
        {
          value: "appearance",
          label: "Appearance",
          icon: "sun",
          items: [
            {
              value: "light",
              label: "Use light theme",
              description: "Apply the light interface",
              icon: "sun",
              onSelect: () => setTheme("light"),
            },
            {
              value: "dark",
              label: "Use dark theme",
              description: "Apply the dark interface",
              icon: "moon",
              onSelect: () => setTheme("dark"),
            },
          ],
        },
      ],
    },
  ];
  return (
    <div className="command-demo">
      <div className="command-demo-toolbar">
        <div>
          <strong>{name}</strong>
          <small>Local workspace · {transfers.length} transfers</small>
        </div>
        <UI.Button
          size="sm"
          icon="search"
          variant="ghost"
          onClick={() => setOpen(true)}
        >
          Search commands <kbd>⌘K</kbd>
        </UI.Button>
      </div>
      <div className="command-demo-content">
        {view === "files" && (
          <UI.DataTable
            caption="Transfers"
            rows={transfers}
            columns={[
              { key: "name", label: "Transfer" },
              { key: "recipient", label: "Recipient" },
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
        )}
        {view === "create" && (
          <UI.Form
            initialValues={{ name: "", recipient: "" }}
            validate={(values) => ({
              name: values.name.trim() ? undefined : "Enter a transfer name",
            })}
            onSubmit={(values) => {
              setTransfers((old) => [
                ...old,
                { ...values, id: crypto.randomUUID(), status: "Draft" },
              ]);
              setView("files");
              toast("Draft created locally", { tone: "good" });
            }}
          >
            {({ field, errors }) => (
              <>
                <h3>New transfer</h3>
                <UI.Field label="Transfer name" error={errors.name}>
                  <input {...field("name")} />
                </UI.Field>
                <UI.Field label="Recipient">
                  <input {...field("recipient")} placeholder="Team or email" />
                </UI.Field>
                <div className="re-form-actions">
                  <UI.Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setView("files")}
                  >
                    Cancel
                  </UI.Button>
                  <UI.Button type="submit" size="sm">
                    Create draft
                  </UI.Button>
                </div>
              </>
            )}
          </UI.Form>
        )}
        {view === "team" && (
          <UI.TeamDirectory
            members={[
              {
                id: "1",
                name: "Alex Rivera",
                email: "alex@example.com",
                role: "Owner",
                status: "Active",
              },
              {
                id: "2",
                name: "Sam Chen",
                email: "sam@example.com",
                role: "Editor",
                status: "Active",
              },
            ]}
          />
        )}
        {view === "settings" && (
          <UI.SettingsPanel
            title="Workspace profile"
            sections={[
              {
                id: "name",
                title: "General",
                children: (
                  <UI.Field label="Workspace name">
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </UI.Field>
                ),
              },
              {
                id: "theme",
                title: "Appearance",
                children: (
                  <UI.Switch
                    label="Dark theme"
                    checked={theme === "dark"}
                    onChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                ),
              },
            ]}
            actions={
              <UI.Button
                size="sm"
                onClick={() => {
                  setView("files");
                  toast("Workspace updated locally", { tone: "good" });
                }}
              >
                Save profile
              </UI.Button>
            }
          />
        )}
      </div>
      <UI.CommandMenu
        open={open}
        onOpenChange={setOpen}
        items={commands}
        shortcut
        label="Workspace commands"
      />
    </div>
  );
}
