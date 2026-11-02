# Upgrading to v0.8

Install `github:iamresvevo/ride-eats-ui#v0.8.0`. This release removes duplicate public APIs. Earlier releases remain tagged.

| Removed export | Replacement |
| --- | --- |
| Autocomplete | `<Combobox allowCustom ... />` |
| Collapsible | `<Accordion items={[{value:'details', title:'Details', content:details}]} />` |
| Stat | `<StatCard variant="inline" ... />` |
| Modal | `<Dialog open={open} onOpenChange={setOpen} ... />` |

For Modal migration, replace `onClose={() => setOpen(false)}` with `onOpenChange={setOpen}`, `dismissable` with `dismissible`, and use Dialog's default size instead of `md`. Keep the component mounted during close. Dialog forwards `label`, `labelledBy`, `onAfterClose` and `closeOnBackdrop`. The internal Modal file remains the shared native dialog engine and is not a public export.

CommandMenu accepts optional `group`, `description`, `keywords`, nested `items`, and Promise-returning `onSelect`. Give every command a unique stable value. Use modifier shortcuts such as `Alt+N` or `Mod+1`; plain letters remain search input. Rejected actions show an error and keep the palette open. Its default accessible label is now Command search.

WorkspaceSwitcher now uses the shared Menu implementation. Its className/style apply to the menu root; target `.re-workspace-trigger` for trigger customization. Selected rows expose radio-menu semantics. ContextMenu submenus remain mounted but inert when collapsed, with animated height and opacity.

The old documentation hashes `#autocomplete` and `#collapsible` resolve to their canonical replacements. Stacked Dialogs, Nested Popovers and Dashboard Layout are recipes, not extra component APIs. TeamDirectory, FileManager and SupportInbox are workflows.
