# Ride Eats UI design language

The working design system lives in `css/components.css` and `src/`. New screens use these shared components and tokens before adding tool-specific styles. Light and dark modes are equally supported.

## Foundation

- Inter typography, with system fonts as fallback. Page titles use the existing `page-head`; section headings use `h2`; field labels use `field`. Supporting text uses `muted` and the shared small-text style.
- Neutral page, card, and control surfaces: `--bg`, `--surface`, `--raised`, `--hover`. Green is the primary-action and status accent, not a large decorative fill. There is one green, the Ride Eats logo green `#1fa476`, in both themes: `--brand` and `--good` both use it; never introduce another shade.
- Use `--text`, `--muted`, and `--faint` for the text hierarchy. Do not hardcode theme-dependent foreground colors.
- Shapes follow Send (send.ride-eats.com), shared across Ride Eats: every button, chip, tab, badge, pager button and search field is a full pill (`--r-pill`); the selected tab or chip is the navigation's ink pill (`--ink` / `--on-ink`). Fields and pickers use `--r-sm` (12px), cards and stats `--r-lg` (20px), dialogs `--r-dialog` (28px). Secondary buttons carry a hairline outline (`--line-strong`) so they never read as status tags.
- No card in card: inside a card or dialog, group with headings, spacing and hairline dividers, never another filled box. Dialog footers share the dialog surface.
- Spacing follows the existing compact rhythm: 6–8 px within controls, 12 px between related items, 16–20 px between groups, and the shared 22 px card padding.
- Surfaces are filled and borderless. Use a visible focus ring for keyboard interaction. Avoid decorative outlines, letter spacing, oversized hero panels, and text shadows.

## Screen structure

The configurable header supplies navigation tabs and an account menu. Supply appearance options through menuItems and sign-out through onSignOut. Settings belong in that menu, not in a sidebar. A screen starts with a concise page title and explanation, followed by standard `card` containers. Use `stack` for vertical groups and a responsive two-column layout only when the secondary column is useful. At narrow widths, stack cards without horizontal page overflow.

Keep one primary action per task. Field labels explain the task; technical implementation details belong in diagnostics or documentation. Never label live actions as sandbox actions.

## Shared components

| Need | Component |
| --- | --- |
| DOM construction and loading buttons | `src/dom.js`: `el`, `busy` |
| Status and counts | `src/ui.js`: `badge`, `stat` |
| Tabs, filters, paging, empty state | `src/ui.js`: `tabs`, `chips`, `pager`, `empty` |
| Modal and confirmation | `src/modal.js`: `openModal`, `confirmModal` |
| Feedback | `src/toast.js`: `toast` |
| Icons | `src/icons.js`: `svg`, `toolIcon` |
| Searchable multiple selection | `src/search-select.js`: `searchSelect` |
| Authentication and API calls | Supplied by the consuming app; not included |

`searchSelect` owns async loading, stale-response protection, selected-recipient pills, keyboard navigation, outside click, and disposal. Its `load(query)` returns `{id, label, detail}` items; `onChange(items)` returns the selection. Use it instead of building another account picker.

Dropdowns align to their field, use compact neutral rows, and show a small check at the end of selected rows. Keep names as primary text and email/device information as supporting text. Empty, loading, and error states stay inside the dropdown. Escape closes; arrows move; Enter toggles; Tab leaves the control. Selection must remain visible after closing.

All dialogs use `openModal` or `confirmModal` and the single `#modal-root::before` backdrop. Do not add per-dialog blur layers. Wrap recurring page redraws in `deferModalBackground(draw)` and call its `.dispose()` during page cleanup; keep data fetching and active dialog updates running. Deferred page redraws coalesce until the final dialog finishes closing.

## Branding

Use `rideeats-dark.png` on light surfaces and `rideeats-light.png` on dark surfaces, selected by the shared `on-light` / `on-dark` theme classes. A logo inside a fixed white tile uses the dark mark in either theme. Preserve aspect ratio; do not redraw, tint, or stretch marks.

## Verification before release

Check the rendered screen in both themes and at desktop and narrow widths. Exercise loading, no results, failure, selected state, keyboard navigation, and long content. Confirm any live status against the actual API. Distinguish provider acceptance from a notification appearing on a physical device.
