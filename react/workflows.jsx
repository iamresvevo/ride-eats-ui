import React, { useEffect, useId, useRef, useState } from "react";
import Icon from "./send/Icon.jsx";
import Modal from "./send/ui/Modal.jsx";
import { Button, Field, Badge, Select, Avatar } from "./index.jsx";
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
  const id = useId();
  return (
    <section
      className={`re-settings-panel ${className}`}
      style={style}
      aria-labelledby={id}
    >
      <header>
        <h2 id={id}>{title}</h2>
        {description && <p>{description}</p>}
      </header>
      {sections.map((section) => (
        <section key={section.id} aria-labelledby={`${id}-${section.id}`}>
          <div className="re-settings-section-heading">
            {section.icon && (
              <span className="re-settings-icon">
                <Icon name={section.icon} />
              </span>
            )}
            <div>
              <h3 id={`${id}-${section.id}`}>{section.title}</h3>
              {section.description && <p>{section.description}</p>}
            </div>
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
          <Select
            label={`Role for ${row.name}`}
            value={row.role}
            options={roles.map((role) => ({ value: role, label: role }))}
            onValueChange={async (role) => {
              try {
                await onRoleChange(row.id, role);
              } catch (error) {
                toast(error.message || "Unable to change role", {
                  tone: "bad",
                });
              }
            }}
          />
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
          {({ field, values, setValue, errors, submitting }) => (
            <>
              <Field label="Name" error={errors.name}>
                <input {...field("name")} autoComplete="name" />
              </Field>
              <Field label="Email" error={errors.email}>
                <input {...field("email")} type="email" autoComplete="email" />
              </Field>
              <Field label="Role">
                <Select
                  label="Role"
                  value={values.role}
                  disabled={submitting}
                  options={roles.map((role) => ({ value: role, label: role }))}
                  onValueChange={(role) => setValue("role", role)}
                />
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
      <DataGrid
        label="Files"
        toolbarActions={
          onUpload && (
            <>
              <Button
                size="sm"
                variant="primary"
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
          )
        }
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
export { SupportInbox } from "./SupportInbox.jsx";
