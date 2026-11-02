import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  UIProvider,
  CommandMenu,
  AppShell,
  WorkspaceSwitcher,
  NotificationCenter,
  TeamDirectory,
  FileManager,
  SettingsPanel,
  Field,
  Button,
  ActivityFeed,
  SupportInbox,
  useToast,
} from "@ride-eats/ui";
import "@ride-eats/ui/styles.css";
import "./style.css";
function Application() {
  const [command, setCommand] = useState(false),
    [view, setView] = useState("team"),
    [workspace, setWorkspace] = useState("studio"),
    [name, setName] = useState("Design Studio"),
    [members, setMembers] = useState([
      {
        id: "1",
        name: "Alex Rivera",
        email: "alex@example.com",
        role: "Owner",
        status: "Active",
      },
    ]),
    [files, setFiles] = useState([
      {
        id: "1",
        name: "Welcome.pdf",
        type: "file",
        size: "24 KB",
        owner: "Alex Rivera",
        updated: "Today",
      },
    ]),
    [notifications, setNotifications] = useState([
      { id: "1", title: "Your workspace is ready", time: "Now", read: false },
    ]),
    [thread, setThread] = useState("1"),
    [threads, setThreads] = useState([
      {
        id: "1",
        name: "Sam Chen",
        subject: "Getting started",
        status: "Open",
        time: "Now",
        messages: [
          {
            id: "1",
            author: "Sam Chen",
            text: "Where can I find our files?",
            time: "Now",
          },
        ],
      },
    ]);
  const toast = useToast();
  const activity = [
    {
      id: "1",
      title: "Workspace created",
      description: "Your team can start sharing files.",
      time: "Today",
      icon: "layers",
    },
  ];
  return (
    <>
      <CommandMenu
        open={command}
        onOpenChange={setCommand}
        shortcut
        items={["team", "files", "activity", "support", "settings"].map(
          (value) => ({
            value,
            label: "Open " + value,
            onSelect: () => setView(value),
          }),
        )}
      />
      <AppShell
        brand="Studio"
        items={[
          { value: "team", label: "Team", icon: "users" },
          { value: "files", label: "Files", icon: "folder" },
          { value: "activity", label: "Activity", icon: "activity" },
          { value: "support", label: "Support", icon: "headset" },
          { value: "settings", label: "Settings", icon: "settings" },
        ]}
        value={view}
        onValueChange={setView}
        workspace={
          <WorkspaceSwitcher
            items={[
              { value: "studio", label: "Design Studio" },
              { value: "platform", label: "Platform" },
            ]}
            value={workspace}
            onValueChange={setWorkspace}
          />
        }
        search={
          <Button
            size="sm"
            variant="ghost"
            icon="search"
            onClick={() => setCommand(true)}
          >
            Search workspace…
          </Button>
        }
        actions={
          <NotificationCenter
            items={notifications}
            onRead={(id) =>
              setNotifications((old) =>
                old.map((item) =>
                  item.id === id ? { ...item, read: true } : item,
                ),
              )
            }
            onReadAll={() =>
              setNotifications((old) =>
                old.map((item) => ({ ...item, read: true })),
              )
            }
          />
        }
      >
        <p className="demo-notice">
          Local starter data. Connect callbacks to your application API.
        </p>
        {view === "team" && (
          <TeamDirectory
            members={members}
            onInvite={(values) =>
              setMembers((old) => [
                ...old,
                { ...values, id: crypto.randomUUID(), status: "Invited" },
              ])
            }
            onRoleChange={(id, role) =>
              setMembers((old) =>
                old.map((item) => (item.id === id ? { ...item, role } : item)),
              )
            }
            onRemove={(id) =>
              setMembers((old) => old.filter((item) => item.id !== id))
            }
          />
        )}
        {view === "files" && (
          <FileManager
            files={files}
            onOpen={(file) => toast(file.name)}
            onUpload={(incoming) =>
              setFiles((old) => [
                ...old,
                ...incoming.map((file) => ({
                  id: crypto.randomUUID(),
                  name: file.name,
                  type: "file",
                  size: Math.ceil(file.size / 1024) + " KB",
                  owner: "You",
                  updated: "Now",
                })),
              ])
            }
            onDelete={(id) =>
              setFiles((old) => old.filter((item) => item.id !== id))
            }
            onDownload={(selection) =>
              toast(`Connect a download handler for ${selection.length} files`)
            }
          />
        )}
        {view === "activity" && <ActivityFeed items={activity} />}
        {view === "support" && (
          <SupportInbox
            threads={threads}
            value={thread}
            onValueChange={setThread}
            onReply={(id, text) =>
              setThreads((old) =>
                old.map((item) =>
                  item.id === id
                    ? {
                        ...item,
                        messages: [
                          ...item.messages,
                          {
                            id: crypto.randomUUID(),
                            author: "You",
                            text,
                            own: true,
                            time: "Now",
                          },
                        ],
                      }
                    : item,
                ),
              )
            }
          />
        )}
        {view === "settings" && (
          <SettingsPanel
            title="Workspace settings"
            sections={[
              {
                id: "name",
                title: "General",
                description: "Your workspace identity.",
                children: (
                  <Field label="Workspace name">
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </Field>
                ),
              },
            ]}
            actions={
              <Button
                size="sm"
                onClick={() => toast("Saved locally", { tone: "good" })}
              >
                Save changes
              </Button>
            }
          />
        )}
      </AppShell>
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <UIProvider>
    <Application />
  </UIProvider>,
);
