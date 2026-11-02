# Send extraction map

Source checkout: ride-eats-send, HEAD `2530ac60d257a8440da6c3a93efc254e3f6fb5df`. Extraction also reads the current working files; Send is not modified.

| Library                                        | Send source                                              | Adaptation                                                                                                    |
| ---------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Button                                         | src/components/ActionButton.jsx                          | Friendly variant prop adapter                                                                                 |
| Menu / Dropdown / Select                       | src/components/ui/Menu.jsx                               | Send render-prop and compound API preserved; array adapter added                                              |
| Modal / Dialog                                 | src/components/ui/Modal.jsx                              | Controlled open adapter added                                                                                 |
| Switch                                         | src/components/ui/Switch.jsx                             | Preserved                                                                                                     |
| SettingRow                                     | src/components/ui/SettingRow.jsx                         | Preserved                                                                                                     |
| Skeleton, Bone, BoneText                       | src/components/ui/Skeleton.jsx                           | Preserved; domain skeleton exports remain internal                                                            |
| Pagination                                     | src/components/ui/Pagination.jsx                         | Page-size adapter                                                                                             |
| DateTimePicker                                 | src/components/ui/DateTimePicker.jsx                     | Locale from document lang                                                                                     |
| Avatar, VerificationBadge, VerifiedName        | src/components/AccountAvatar.jsx and identity components | Local initials helper replaces business format module                                                         |
| Icon                                           | src/components/Icon.jsx                                  | Preserved                                                                                                     |
| Header                                         | src/components/Header.jsx                                | Configurable brand, item data, account and callbacks; retained measurement and pill motion                    |
| AccountMenu                                    | src/components/AccountMenu.jsx                           | Retained AccountShell; removed companies, plans, routes, notification service, language and auth dependencies |
| Theme, Chips, Field, Card, Toast, SearchSelect | Shared Tools / library additions                         | Generic React API; no Send business logic                                                                     |

Translation calls use a small node-preserving text adapter. Pass translated labels from your app. CSS copies only reusable control sections, with integration overrides. No shader, upload, billing, networking, workspace service or credentials are imported.

Tooltips and PageLoading are also extracted from Send’s matching src/components/ui modules. UIProvider combines the generic providers with Send’s global tooltip renderer.

## Fluid selection motion

Segmented is extracted from Send src/components/Segmented.jsx. Its placeSelection geometry, 400ms easing and directional stretch/settle are shared with Tabs through react/send/hooks/selection.js. Tabs retains tablist/tab semantics and panel associations; Segmented retains Send’s radiogroup/radio semantics. Both disable movement for reduced motion and remeasure on resize.

## Feedback, platform composition and icon catalog (v0.3)

- React Feedback adapts Send's `src/components/Feedback.jsx`: bounded depth-stacked toasts, two-phase expiry and async confirmations. It adds message deduplication, configurable duration/limit, tone icons and queued confirmations. Classes are isolated from legacy vanilla toast styles.
- Modal retains Send's native dialog/focus/exit handling and adds a Tools-style shared-backdrop stack: underlying dialogs stay mounted, inert and scaled while the top dialog owns input.
- Card, MetricGrid, StatCard, Tile, PageHeader and Toolbar follow Tools' compact dashboard surfaces, metric hierarchy and launcher tiles. Generic inputs, tables, accordion, drawer and timeline are new React components, not claimed as direct Send source copies.
- The built-in catalog vendors 2,015 icons from `lucide-static` 1.66.0 under ISC, with its full copyright and Feather-derived notices in `react/icons/LICENSE.lucide`. Existing Send PATHS are retained. The kit adds lazy loading, custom glyph registration, searchable names/tags and opt-in icon motion.
