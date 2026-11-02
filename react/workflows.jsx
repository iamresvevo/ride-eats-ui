import React, { useEffect, useId, useRef, useState } from "react";
import Icon from "./send/Icon.jsx";
import Modal from "./send/ui/Modal.jsx";
import { Button, Field, Badge } from "./index.jsx";
import { DataGrid } from "./DataGrid.jsx";
import { Form, Textarea } from "./forms.jsx";
import { useConfirm, useToast } from "./Feedback.jsx";

export function SettingsPanel({
  sections,
  actions,
  title = "Settings",
  description,
  className = "",
  style,
}) {
  return (
    <section className={`re-settings-panel ${className}`} style={style}>
      <header>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </header>
      {sections.map((section) => (
        <section key={section.id}>
          <div>
            <h3>{section.title}</h3>
            {section.description && <p>{section.description}</p>}
          </div>
          <div>{section.children}</div>
        </section>
      ))}
      {actions && <footer>{actions}</footer>}
    </section>
  );
}
export function TeamDirectory({
  members,
  onInvite,
  onRoleChange,
  onRemove,
  roles = ["Owner", "Editor", "Viewer"],
  className = "",
  style,
}) {
  const [invite, setInvite] = useState(false),
    confirm = useConfirm(),
    toast = useToast();
  const columns = [
    {
      key: "name",
      label: "Member",
      width: 240,
      pinned: true,
      render: (_, row) => (
        <div className="re-person-cell">
          <span className="re-person-initial">
            {row.name
              .split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("")}
          </span>
          <span>
            <strong>{row.name}</strong>
            <small>{row.email}</small>
          </span>
        </div>
      ),
      searchValue: (row) => row.name + " " + row.email,
    },
    {
      key: "role",
      label: "Role",
      width: 140,
      render: (_, row) =>
        onRoleChange ? (
          <select
            aria-label={`Role for ${row.name}`}
            value={row.role}
            onChange={async (event) => {
              try {
                await onRoleChange(row.id, event.target.value);
              } catch (error) {
                toast(error.message || "Unable to change role", {
                  tone: "bad",
                });
              }
            }}
          >
            {roles.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
        ) : (
          row.role
        ),
    },
    {
      key: "status",
      label: "Status",
      width: 110,
      render: (value) => (
        <Badge tone={value === "Active" ? "good" : "neutral"}>
          {value || "Active"}
        </Badge>
      ),
    },
  ];
  return (
    <div className={`re-team-directory ${className}`} style={style}>
      <div className="re-workflow-heading">
        <h2>Team members</h2>
        {onInvite && (
          <Button size="sm" onClick={() => setInvite(true)} icon="plus">
            Invite member
          </Button>
        )}
      </div>
      <DataGrid
        label="Team members"
        rows={members}
        columns={columns}
        rowActions={
          onRemove
            ? (row) => (
                <Button
                  size="sm"
                  variant="ghost"
                  icon="trash"
                  aria-label={`Remove ${row.name}`}
                  onClick={async () => {
                    if (
                      await confirm({
                        title: "Remove member?",
                        message: `${row.name} will lose access to this workspace.`,
                        confirmLabel: "Remove",
                        danger: true,
                      })
                    ) {
                      try {
                        await onRemove(row.id);
                      } catch (error) {
                        toast(error.message || "Unable to remove member", {
                          tone: "bad",
                        });
                      }
                    }
                  }}
                />
              )
            : undefined
        }
      />
      <Modal
        open={invite}
        onClose={() => setInvite(false)}
        title="Invite a teammate"
      >
        <Form
          initialValues={{
            name: "",
            email: "",
            role: roles.at(-1) || "Viewer",
          }}
          validate={(values) => ({
            name: !values.name.trim() ? "Enter a name" : undefined,
            email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
              ? "Enter a valid email address"
              : undefined,
          })}
          onSubmit={async (values) => {
            await onInvite(values);
            setInvite(false);
            toast("Invitation sent", { tone: "good" });
          }}
        >
          {({ field, errors, submitting }) => (
            <>
              <Field label="Name" error={errors.name}>
                <input {...field("name")} autoComplete="name" />
              </Field>
              <Field label="Email" error={errors.email}>
                <input {...field("email")} type="email" autoComplete="email" />
              </Field>
              <Field label="Role">
                <select {...field("role")}>
                  {roles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </Field>
              <div className="re-form-actions">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setInvite(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" type="submit" loading={submitting}>
                  Send invitation
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
export function FileManager({
  files,
  onUpload,
  onOpen,
  onDownload,
  onDelete,
  className = "",
  style,
}) {
  const input = useRef(null),
    confirm = useConfirm(),
    toast = useToast();
  return (
    <div className={`re-file-manager ${className}`} style={style}>
      <div className="re-workflow-heading">
        <h2>Files</h2>
        {onUpload && (
          <>
            <Button
              size="sm"
              icon="upload"
              onClick={() => input.current.click()}
            >
              Upload files
            </Button>
            <input
              ref={input}
              className="re-sr-only"
              aria-label="Choose files to upload"
              type="file"
              multiple
              onChange={(event) => {
                onUpload([...event.target.files]);
                event.target.value = "";
              }}
            />
          </>
        )}
      </div>
      <DataGrid
        label="Files"
        rows={files}
        columns={[
          {
            key: "name",
            label: "Name",
            pinned: true,
            width: 260,
            render: (_, row) => (
              <button
                type="button"
                className="re-file-name"
                onClick={() => onOpen?.(row)}
              >
                <Icon name={row.type === "folder" ? "folder" : "file"} />
                <span>{row.name}</span>
              </button>
            ),
          },
          { key: "size", label: "Size", width: 110 },
          { key: "owner", label: "Owner", width: 140 },
          { key: "updated", label: "Updated", width: 130 },
        ]}
        bulkActions={
          onDownload
            ? [{ value: "download", label: "Download", onSelect: onDownload }]
            : []
        }
        rowActions={
          onDelete
            ? (row) => (
                <Button
                  size="sm"
                  variant="ghost"
                  icon="trash"
                  aria-label={`Delete ${row.name}`}
                  onClick={async () => {
                    if (
                      await confirm({
                        title: "Delete file?",
                        message: `Delete ${row.name}?`,
                        confirmLabel: "Delete",
                        danger: true,
                      })
                    ) {
                      try {
                        await onDelete(row.id);
                      } catch (error) {
                        toast(error.message || "Unable to delete file", {
                          tone: "bad",
                        });
                      }
                    }
                  }}
                />
              )
            : undefined
        }
      />
    </div>
  );
}
export function ActivityFeed({
  items,
  label = "Recent activity",
  emptyText = "No activity yet.",
  className = "",
  style,
}) {
  return (
    <section
      className={`re-activity-feed ${className}`}
      style={style}
      aria-label={label}
    >
      <h2>{label}</h2>
      {items.length ? (
        <ol>
          {items.map((item) => (
            <li key={item.id}>
              <span className="re-activity-icon">
                <Icon name={item.icon || "activity"} />
              </span>
              <div>
                <strong>{item.title}</strong>
                {item.description && <p>{item.description}</p>}
              </div>
              <time dateTime={item.dateTime}>{item.time}</time>
            </li>
          ))}
        </ol>
      ) : (
        <p className="re-platform-empty">{emptyText}</p>
      )}
    </section>
  );
}
export function SupportInbox({
  threads,
  value,
  onValueChange,
  onReply,
  label = "Support inbox",
  className = "",
  style,
}) {
  const selected = threads.find((thread) => thread.id === value),
    [draft, setDraft] = useState(""),
    [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    busy = useRef(false),
    id = useId();
  useEffect(() => {
    setDraft("");
    setError("");
  }, [value]);
  return (
    <section
      className={`re-support ${className}`}
      style={style}
      aria-label={label}
    >
      <aside>
        <h2>{label}</h2>
        <div role="list" aria-label="Conversations">
          {threads.map((thread) => (
            <div role="listitem" key={thread.id}>
              <button
                type="button"
                aria-current={value === thread.id ? "true" : undefined}
                onClick={() => onValueChange(thread.id)}
              >
                <strong>{thread.name}</strong>
                <small>{thread.subject}</small>
                <span>
                  <Badge tone={thread.status === "Open" ? "good" : "neutral"}>
                    {thread.status}
                  </Badge>
                  <time>{thread.time}</time>
                </span>
              </button>
            </div>
          ))}
        </div>
      </aside>
      <div className="re-support-thread">
        {selected ? (
          <>
            <header>
              <strong>{selected.subject}</strong>
              <small>{selected.name}</small>
            </header>
            <ol aria-label="Messages">
              {selected.messages.map((message) => (
                <li key={message.id} data-own={message.own || undefined}>
                  <strong>{message.author}</strong>
                  <p>{message.text}</p>
                  <time>{message.time}</time>
                </li>
              ))}
            </ol>
            {onReply && (
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (!draft.trim() || busy.current) return;
                  busy.current = true;
                  setPending(true);
                  setError("");
                  try {
                    await onReply(value, draft.trim());
                    setDraft("");
                  } catch (reason) {
                    setError(reason.message || "Unable to send reply.");
                  } finally {
                    busy.current = false;
                    setPending(false);
                  }
                }}
              >
                <label htmlFor={id}>Reply to {selected.name}</label>
                <textarea
                  id={id}
                  rows={2}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write a reply…"
                  disabled={pending}
                />
                {error && (
                  <p role="alert" className="re-form-error">
                    {error}
                  </p>
                )}
                <Button
                  size="sm"
                  type="submit"
                  loading={pending}
                  disabled={!draft.trim()}
                >
                  Send reply
                </Button>
              </form>
            )}
          </>
        ) : (
          <p className="re-platform-empty">Choose a conversation.</p>
        )}
      </div>
    </section>
  );
}
