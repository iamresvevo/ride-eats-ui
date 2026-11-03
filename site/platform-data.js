const page = (
  id,
  name,
  group,
  detail,
  code,
  props,
  imports = name.replaceAll(" ", ""),
) => ({ id, name, group, description: detail, detail, code, props, imports });
export const platformPages = [
  page(
    "textarea",
    "Textarea",
    "Inputs",
    "A compact multiline field with associated labels, hints and validation. Native textarea props remain available.",
    `<Textarea label="Description" value={description} onChange={event => setDescription(event.target.value)} hint="Keep it short and useful." />`,
    [
      [
        "label / hint / error",
        "ReactNode",
        "Accessible label and supporting content.",
      ],
      [
        "rows / value / onChange / disabled",
        "native textarea props",
        "Defaults to three rows; controlled content stays yours.",
      ],
    ],
  ),
  page(
    "form",
    "Form",
    "Inputs",
    "Validation, async submit state, server errors and first-invalid-field focus in one render-prop form. The demo saves local state.",
    `<Form initialValues={{name:''}} validate={values => ({name:values.name ? undefined : 'Required'})} onSubmit={save}>\n {({field,errors,submitting}) => <><Field label="Name" error={errors.name}><input {...field('name')} /></Field><Button type="submit" loading={submitting}>Save</Button></>}\n</Form>`,
    [
      [
        "initialValues / validate",
        "object / values => errors",
        "Initial values and synchronous validation.",
      ],
      [
        "onSubmit",
        "values => void | Promise",
        "Errors become a visible alert; duplicate submissions are prevented.",
      ],
      [
        "children",
        "render function",
        "Receives values, errors, submitting, field(name), setValue(name,value), reset().",
      ],
    ],
    "Form, Field, Button",
  ),
  page(
    "combobox",
    "Combobox",
    "Inputs",
    "Searchable selection with native top-layer positioning, listbox semantics and keyboard navigation.",
    `<Combobox label="Assignee" options={people} value={person} onValueChange={setPerson} />`,
    [
      [
        "options",
        "{value,label,description?,disabled?}[]",
        "Searchable choices.",
      ],
      [
        "value / onValueChange",
        "string / callback",
        "Controlled selected option.",
      ],
      [
        "label / placeholder / error / hint / disabled",
        "configuration",
        "Labels, validation and availability.",
      ],
    ],
  ),
  page(
    "multi-select",
    "Multi Select",
    "Inputs",
    "Choose multiple options from one searchable field, then remove selections with compact chips.",
    `<MultiSelect label="Teams" options={teams} value={selectedTeams} onValueChange={setSelectedTeams} />`,
    [
      ["options", "ComboboxOption[]", "Searchable choices."],
      [
        "value / onValueChange",
        "string[] / callback",
        "Controlled selected keys.",
      ],
      [
        "label / placeholder / error / hint / disabled",
        "configuration",
        "Labels, validation and availability.",
      ],
    ],
    "MultiSelect",
  ),
  page(
    "date-range-picker",
    "Date Range Picker",
    "Inputs",
    "Send’s custom calendar for both range endpoints, with linked bounds, circular day controls and animated opening and closing. Values stay local YYYY-MM-DD dates.",
    `<DateRangePicker value={range} onValueChange={setRange} label="Reporting period" />`,
    [
      [
        "value / onValueChange",
        "{start,end} / callback",
        "ISO dates or empty strings.",
      ],
      [
        "min / max / disabled / label / locale",
        "configuration",
        "Shared calendar bounds and fieldset label.",
      ],
    ],
    "DateRangePicker",
  ),
  page(
    "time-picker",
    "Time Picker",
    "Inputs",
    "A native time field with a compact label and keyboard input. Time formatting follows the browser locale.",
    `<TimePicker label="Opening time" value={time} onValueChange={setTime} />`,
    [
      [
        "value / onValueChange",
        "HH:mm string / callback",
        "Native time value.",
      ],
      [
        "min / max / step / disabled / label",
        "configuration",
        "Step is seconds; defaults to one minute.",
      ],
    ],
    "TimePicker",
  ),
  page(
    "upload-progress",
    "Upload Progress",
    "Feedback",
    "Compact per-file progress, status, errors, retry and cancellation. The caller owns file transfer and progress; this demo has explicit simulation controls.",
    `<UploadProgress files={uploads} onCancel={cancelUpload} onRetry={retryUpload} />`,
    [
      [
        "files",
        "{id,name,status,progress?,error?}[]",
        "Status is queued, uploading, done, error or cancelled; progress is 0–100.",
      ],
      [
        "onCancel / onRetry",
        "id => void",
        "Caller handles transfer cancellation and retry.",
      ],
    ],
    "UploadProgress",
  ),
  page(
    "data-grid",
    "DataGrid",
    "Display",
    "A compact table with search, filters, sorting, column visibility and resizing, sticky columns, bulk actions and optional row expansion. Fixed-row virtual scrolling supports larger local datasets.",
    `<DataGrid rows={members} columns={[{key:'name',label:'Name',pinned:true,width:220},{key:'role',label:'Role'}]} filters={[{key:'role',label:'Role',options:roles}]} bulkActions={[{value:'export',label:'Export',onSelect:exportRows}]} renderExpanded={row => <p>{row.email}</p>} />\n// For fixed-height rows: <DataGrid rows={records} columns={columns} virtual height={320} />`,
    [
      [
        "rows / columns / getRowKey",
        "T[] / DataGridColumn<T>[] / function",
        "Stable row IDs are required. Columns accept key, label, width, pinned, sortable, resizable, align, render, searchValue and sortValue.",
      ],
      [
        "filters / bulkActions",
        "definition arrays",
        "Exact-value filters and selected-row callbacks.",
      ],
      [
        "renderExpanded / rowActions",
        "row => ReactNode",
        "Optional row details and actions.",
      ],
      [
        "virtual / height / rowHeight / pageSize",
        "boolean / number",
        "Defaults: false / 320 / 40 / 8. Expansion disables virtualization. Virtual rows must fit the fixed height.",
      ],
      [
        "loading / error / onRetry / emptyText / label",
        "configuration",
        "Loading, error, retry and empty states.",
      ],
    ],
    "DataGrid",
  ),
  page(
    "app-shell",
    "App Shell",
    "Layout",
    "A reusable compact application frame with collapsible navigation, mobile dialog navigation and slots for workspace, search, notifications and account actions.",
    `<AppShell brand="Studio" items={navigation} value={view} onValueChange={setView} workspace={<WorkspaceSwitcher items={workspaces} value={workspace} onValueChange={setWorkspace} />} actions={<NotificationCenter items={notifications} />}>\n  <Card title="Overview">Your application</Card>\n</AppShell>`,
    [
      [
        "items / value / onValueChange",
        "navigation array / string / callback",
        "Navigation items accept value, label, icon, count and disabled.",
      ],
      [
        "brand / workspace / search / actions / sidebarFooter / children",
        "ReactNode slots",
        "Supply branding, controls and actual screens.",
      ],
      [
        "collapsed / onCollapsedChange",
        "optional controlled state",
        "Leave unset for internal collapse state. Mobile navigation uses a native modal.",
      ],
    ],
    "AppShell, WorkspaceSwitcher, NotificationCenter, Card",
  ),
  page(
    "workspace-switcher",
    "Workspace Switcher",
    "Navigation",
    "Compact workspace selection using the shared Send menu, ready for a header or app sidebar.",
    `<WorkspaceSwitcher items={workspaces} value={workspace} onValueChange={setWorkspace} />`,
    [
      [
        "items",
        "{value,label,description?,icon?,disabled?}[]",
        "Caller-owned workspaces.",
      ],
      [
        "value / onValueChange / label",
        "controlled state and label",
        "Selection does not switch a backend session automatically.",
      ],
    ],
    "WorkspaceSwitcher",
  ),
  page(
    "notification-center",
    "Notification Center",
    "Feedback",
    "Unread counts, compact notification rows and caller-owned read state. No polling, push or backend is bundled.",
    `<NotificationCenter items={notifications} onRead={markRead} onReadAll={markAllRead} onSelect={openNotification} />`,
    [
      [
        "items",
        "{id,title,description?,time?,read?,icon?}[]",
        "Notification content and read state.",
      ],
      [
        "onRead / onReadAll / onSelect / label",
        "callbacks / string",
        "Caller handles persistence and routing.",
      ],
    ],
    "NotificationCenter",
  ),
  page(
    "bottom-sheet",
    "Bottom Sheet",
    "Feedback",
    "A compact native modal sheet. Drag the handle or header down to dismiss; short pulls smoothly return, press the handle, use Close, or press Escape. It keeps the real dialog mounted through exits.",
    `<BottomSheet open={open} onClose={() => setOpen(false)} title="Transfer settings" footer={<Button onClick={save}>Save changes</Button>}>\n  Your settings\n</BottomSheet>`,
    [
      [
        "open / onClose",
        "controlled state",
        "Keep mounted for animated exits and focus restoration.",
      ],
      [
        "title / children / footer",
        "ReactNode",
        "Accessible heading, content and actions.",
      ],
      [
        "height",
        "number | CSS length",
        "Defaults to 360px and is constrained by the viewport.",
      ],
    ],
    "BottomSheet, Button",
  ),
  page(
    "context-menu",
    "Context Menu",
    "Actions",
    "Right-click or use Shift+F10 to open compact contextual actions. Nested choices, disabled actions, keyboard movement and Escape are supported.",
    `<ContextMenu items={[{value:'open',label:'Open',onSelect:openFile},{value:'sort',label:'Sort',items:[{value:'newest',label:'Newest',onSelect:sortNewest}]}]}>\n  <Card title="Project files" />\n</ContextMenu>`,
    [
      [
        "items",
        "ContextMenuItem[]",
        "value, label, icon, disabled, destructive, separator, onSelect and nested items.",
      ],
      [
        "children / label",
        "ReactNode / string",
        "Context target and accessible action name.",
      ],
    ],
    "ContextMenu, Card",
  ),
  page(
    "nested-popovers",
    "Nested Popovers",
    "Recipes",
    "Native top-layer popovers can hold a second popover without clipping into surrounding cards. Dismissal follows the nested hierarchy.",
    `<Popover open={open} onOpenChange={setOpen} label="Share" trigger={props => <Button {...props}>Share</Button>}>\n <Popover open={details} onOpenChange={setDetails} label="Access" trigger={props => <Button {...props}>Access</Button>}>Access settings</Popover>\n</Popover>`,
    [
      [
        "open / onOpenChange / trigger",
        "controlled state / render prop",
        "Each popover owns its open state.",
      ],
      [
        "label / children / align / width",
        "configuration",
        "Same Popover API; native hierarchy handles outside dismissal.",
      ],
    ],
    "Popover, Button",
  ),
  page(
    "settings-panel",
    "Settings Panel",
    "Layout",
    "Compact settings sections with labels, descriptions, control slots and footer actions. Compose real inputs rather than rebuilding layout CSS.",
    `<SettingsPanel title="Workspace settings" sections={[{id:'general',title:'General',description:'Your workspace identity.',children:<Field label="Name"><input value={name} onChange={event => setName(event.target.value)} /></Field>}]} actions={<Button onClick={save}>Save</Button>} />`,
    [
      ["title / description", "ReactNode", "Panel heading."],
      [
        "sections",
        "{id,title,icon?,description?,children}[]",
        "Rounded sections, optional icons and caller-owned controls.",
      ],
      ["actions", "ReactNode", "Compact footer actions."],
    ],
    "SettingsPanel, Field, Button",
  ),
  page(
    "team-directory",
    "Team Directory",
    "Workflows",
    "A complete member table with optional invitation form, editable roles and confirmed removal. All changes are caller-owned callbacks; this demo stores changes locally.",
    `<TeamDirectory members={members} onInvite={inviteMember} onRoleChange={changeRole} onRemove={removeMember} />`,
    [
      [
        "members",
        "{id,name,email,role,status?}[]",
        "Caller-owned member records.",
      ],
      [
        "onInvite / onRoleChange / onRemove",
        "optional async callbacks",
        "Missing callbacks omit those controls. Rejected promises show errors.",
      ],
      [
        "roles",
        "string[]",
        "Defaults to Owner, Editor, Viewer. Use UIProvider for confirmations and toasts.",
      ],
    ],
    "TeamDirectory",
  ),
  page(
    "file-manager",
    "File Manager",
    "Workflows",
    "A compact file table with native multi-file selection, opening, selected-file download and confirmed deletion. Transfer and storage remain in your application.",
    `<FileManager files={files} onUpload={uploadFiles} onOpen={openFile} onDownload={downloadFiles} onDelete={deleteFile} />`,
    [
      [
        "files",
        "{id,name,type?,size?,owner?,updated?}[]",
        "type is file or folder. Display sizes and dates are caller formatted.",
      ],
      [
        "onUpload / onOpen / onDownload / onDelete",
        "optional callbacks",
        "Upload receives native File[]. Download receives selected records. Use UIProvider for confirmations.",
      ],
    ],
    "FileManager",
  ),
  page(
    "activity-feed",
    "Activity Feed",
    "Display",
    "A dense activity list for audit events, recent changes and workspace updates, with compact icons and timestamps.",
    `<ActivityFeed items={activity} label="Workspace activity" />`,
    [
      [
        "items",
        "{id,title,description?,time?,dateTime?,icon?}[]",
        "Display timestamps and optional machine-readable datetimes.",
      ],
      ["label / emptyText", "string", "Accessible heading and empty state."],
    ],
    "ActivityFeed",
  ),
  page(
    "support-inbox",
    "Support Inbox",
    "Workflows",
    "Conversation list, selected thread and reply composer in one responsive workflow. Reply promises control pending and error states; the caller appends persisted messages.",
    `<SupportInbox threads={threads} value={threadId} onValueChange={setThreadId} onReply={sendReply} />`,
    [
      [
        "threads",
        "SupportThread[]",
        "id, name, subject, status, time and messages; messages contain id, author, text, time and own.",
      ],
      [
        "value / onValueChange",
        "string / callback",
        "Selected conversation ID.",
      ],
      [
        "onReply / label",
        "(id,text) => Promise | void / string",
        "Optional reply callback; controls are omitted without it. Drafts are retained per conversation during the mounted session. Search filters names and subjects.",
      ],
    ],
    "SupportInbox",
  ),
  page(
    "sticky-bar",
    "Sticky Bar",
    "Layout",
    "Tools’ automatic floating page controls. Scroll depth progressively fades the content beneath without blur while controls remain sharp. The header offset is measured automatically when used with Header.",
    `<StickyBar><Tabs items={tabs} value={tab} onValueChange={setTab} /></StickyBar>`,
    [
      ["children", "ReactNode", "Tabs, chips, search or action controls."],
      [
        "offset",
        "number | CSS length",
        "Defaults to the nearest inherited --header-height. Set 0 for an independent scroll container.",
      ],
      [
        "fade",
        "boolean",
        "Progressive neutral fade, enabled by default. No blur effects.",
      ],
      [
        "label / className / style",
        "styling and accessibility",
        "The parent defines the sticky scroll boundary; use a labelled scroll region for keyboard scrolling.",
      ],
    ],
    "StickyBar, Tabs",
  ),
];
