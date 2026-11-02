# Send / Tools design contract

The kit uses Send's control behavior and Tools' compact product layouts. Read [the audit](design-audit.md), [source map](source-map.md), and `design/contract.json` before changing a family.

- `css/tokens.css` owns the palette, shape scale, density and motion. Components consume tokens; they do not define their own brand colors, numeric corner radii or easing curves.
- Neutral page/surface/raised fills are opaque. Brand and status colors carry meaning. Supporting `-soft` tokens are neutral, never transparent green/red/yellow canvases.
- Actions, single-line inputs, tabs, chips and option rows are pills. Compact icon controls and selection indicators are circular. Cards use the Tools 20px corner; dialogs use Send's 28px corner. Multiline content uses the 12px/18px inner scale. Attached sheet/footer edges are deliberate exceptions, not standalone square surfaces.
- Primary actions and tab/toggle selection use ink/on-ink. Explicit brand actions and selected multi-value chips use solid brand/on-brand. Semantic swipe actions have solid blue/amber/red variants. Status labels use color on a neutral surface.
- Default controls are 36px, table rows 40px, panel padding 16px. Coarse-pointer menu targets are at least 44px. Compact never means unreadable labels.
- `--motion-ease` is Send's soft settle, shared by CSS and JavaScript animations. Menu presence, expanding submenus, measured selection pills and native dialog stacking keep their actual interaction semantics. A sheet slides from its edge. Dragging follows the pointer directly; release settles. Spinners/progress remain linear; static reading content stays still.
- Reduced motion suppresses nonessential travel. Closures preserve focus and inert state until their exit completes. Native popover dismissal retains the top layer when the browser supports discrete display/overlay transitions.
- Header and StickyBar use scroll-driven neutral progressive fade/blur, keeping controls sharp. Blur and backdrop transparency are depth treatments, not translucent accent fills.
- Documentation uses the same components and tokens. Previews do not recolor Card, StatCard or Tile to manufacture contrast. Props, callbacks, complete workbench examples and real source links explain implementation.

Run `npm run design:check` before visual review. CI checks foundation ownership, tokenized shapes, semantic fills, shared CSS motion, valid literal icon names, documentation IDs and public API audit coverage. Browser and interaction checks still matter; passing the contract is not proof of accessibility conformance or physical-device gesture feel.
