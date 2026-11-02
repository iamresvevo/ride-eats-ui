# Build a compact platform

```sh
npm install github:iamresvevo/ride-eats-ui#v0.7.0
```

Import `@ride-eats/ui/styles.css` once and wrap the app in UIProvider. The complete runnable example is [examples/platform](../examples/platform/README.md). All 76 component pages have live examples, imports and prop tables; selected primitives also have an editable JSON props playground with no code evaluation.

## Defaults

Controls are 36px, small actions 32px, DataGrid rows 40px and panel padding 16px. Use existing spacing rather than adding oversized cards around every control. `data-density="comfortable"` provides 44px controls and 24px panel padding. DataGrid always uses its numeric rowHeight (40px by default); pass rowHeight={52} for roomier fixed rows. Coarse-pointer menu options keep 44px targets. Accent colors follow `--brand`, `--brand-soft` and `--brand-ink`.

## Forms

```jsx
<Form initialValues={{name:'',email:''}}
  validate={values => ({name:values.name.trim() ? undefined : 'Enter a name'})}
  onSubmit={values => api.saveProfile(values)}>
  {({field,errors,submitting}) => <>
    <Field label="Name" error={errors.name}><input {...field('name')} /></Field>
    <Textarea label="Notes" value={notes} onChange={event => setNotes(event.target.value)} />
    <Button type="submit" loading={submitting}>Save</Button>
  </>}
</Form>
```

`field(name)` returns native name/value/onChange props. `setValue(name,value)` connects non-native controls such as MultiSelect. `reset()` returns to the initial values. Form focuses the first invalid field and displays rejected submit errors. Validation must be synchronous; server checks belong in onSubmit. Initial values are read on mount; remount with a new key when switching records. Do not rely on client validation for server authorization or data integrity.

Combobox selects existing options; MultiSelect stores string arrays; Autocomplete also accepts custom text. Arrow keys move, Enter selects, Escape closes, and selected chips are removable. Options use `{value,label,description?,disabled?}`. DateRangePicker uses `{start,end}` ISO dates, TimePicker uses native time strings. Native date/time interfaces vary by browser. UploadProgress displays caller-supplied status and progress and never creates a transfer itself.

## Tables

```jsx
<DataGrid label="Members" rows={members}
  columns={[
    {key:'name',label:'Name',width:220,pinned:true},
    {key:'role',label:'Role',width:120},
    {key:'status',label:'Status',render:(value,row) => <Badge>{value}</Badge>},
  ]}
  filters={[{key:'role',label:'Role',options:roles}]}
  bulkActions={[{value:'export',label:'Export',onSelect:exportRows}]}
  renderExpanded={row => <p>{row.email}</p>}
/>
```

Rows need stable `id` values or getRowKey. View state—query, filters, sort, widths, visibility, selection, pagination and expansion—lives inside DataGrid. Rows and mutations stay in the consuming application. `searchValue(row)` and `sortValue(row)` override column text/value behavior. Sorting is stable, with numeric-aware text comparison. The Columns menu cannot hide the last visible column. Header separators support pointer and arrow-key resizing (72–600px). Pinned columns stay visible during horizontal scrolling.

For larger already-loaded datasets use `virtual height={320} rowHeight={40}`. This renders a small window plus overscan, not all rows. Content must fit the fixed row height. Variable-height expansion disables virtualization. Search/filter/sort operate on the supplied local rows; this is not server pagination or a million-row query engine. For server tables, use DataTable with caller-owned rows, sort and selection instead.

## Navigation and overlays

AppShell accepts navigation items, value/onValueChange and slots for brand, workspace, search, actions, sidebarFooter and children. Desktop navigation collapses to icons; mobile navigation uses a native modal with focus restoration. Compose CommandMenu into the search slot for Cmd/Ctrl+K navigation. WorkspaceSwitcher and NotificationCenter never create backend sessions, subscriptions or polling.

Keep BottomSheet mounted and control open so its native modal can animate exits. Drag its handle down more than 100px to dismiss; pressing the handle or Close and Escape provide alternatives. Modal handles stacking and focus. ContextMenu opens on right-click or Shift+F10, supports nested items, disabled actions and keyboard movement. For touch-first actions, provide a visible button or Dropdown rather than relying on long press.

Popover supports nesting. Closing an inner popover leaves its parent open; Escape dismisses one level at a time. Native top-layer APIs require a modern browser.

## Reusable workflows

- SettingsPanel accepts sections with React control slots and actions.
- TeamDirectory accepts members plus optional async onInvite/onRoleChange/onRemove callbacks. Rejected mutations show errors; removal uses useConfirm.
- FileManager accepts files and optional onUpload/onOpen/onDownload/onDelete callbacks. Upload receives native File objects. No file data leaves the browser until your callback sends it.
- ActivityFeed displays caller-owned events and formatted timestamps.
- SupportInbox accepts threads, selected ID and optional async onReply. The caller appends persisted messages; errors preserve the draft. Switching threads clears the draft.

The starter uses local React state and explicitly labels this. Wire callbacks to your authenticated API for production. The library cannot infer authorization, persistence, invitation delivery or transfer completion.

## Checks and limits

Run check, typecheck, test and build. Browser checks cover key interactions at desktop and a 390px viewport, with both themes reviewed. Visual baselines and `npm run visual:compare` help catch spacing and density regressions; candidate capture is manual, not an automated CI browser job. Physical-device gesture feel, exhaustive screen-reader behavior and accessibility conformance remain unverified.

For remote option lookup, use the existing SearchSelect `load(query)` callback and handle authentication/cancellation in your application. Combobox/MultiSelect are intended for already-loaded option lists. The JSON playground only edits its listed, validated props; it does not execute arbitrary JSX. Full custom render functions belong in your application code.
