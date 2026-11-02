# Design rules

Use Send as the owning source for extracted control behavior. Read source-map.md before changing an extracted component.

- Compact controls, readable type, neutral surfaces, ink primary actions, restrained brand accents.
- Pill buttons and tabs, 12px fields, soft card and dialog corners.
- Keep groups legible through spacing, headings and quiet separators; avoid nested filled cards.
- Preserve Send’s menu entry/exit, inline subgroup motion, sliding header indicator, measured account shell and dialog focus/exit behavior.
- Use theme tokens for surfaces and text; preserve both themes and reduced motion.
- Supply app branding, account data, routes, translations and callbacks through React props.
- Showcase real interactive components with code and prop documentation, rather than static screenshots.

See customization.md for token and integration details.
