# Visual regression checks

The baselines in `baselines/` are real browser screenshots, not generated mocks. `manifest.json` records page, theme, viewport and state. Capture matching candidate screenshots through the supported browser tooling at the same viewport and state, after fonts and layout settle.

```sh
npm run visual:compare -- tests/visual/baselines /path/to/candidate-screenshots
```

The command checks dimensions and changed pixels, allowing 20 levels of channel variation and 0.4% changed pixels for JPEG/font noise. Missing files fail. Inspect differences before intentionally replacing a baseline; never update baselines merely to make a failure pass.

Capture is currently a manual browser step. CI runs the comparison-engine tests and component/model/type checks; it does not launch a browser to regenerate candidates automatically. These fourteen baselines cover compact form, DataGrid, app shell, ToggleGroup, open Dropdown, stacked confirmation and open BottomSheet states in both themes. They are not exhaustive accessibility, mobile-device or performance certification.
