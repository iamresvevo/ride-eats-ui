# Customization

Set the solid accent once at the application root. The provider updates root tokens, including body-level dialogs, calendars and toasts.

```jsx
import { UIProvider } from '@ride-eats/ui';
import '@ride-eats/ui/styles.css';

<UIProvider accent="#1fa476" defaultTheme="system">
  <App />
</UIProvider>
```

Hex colors (`#rgb` or `#rrggbb`) get automatic black or white foreground text. For another CSS color format, pass `accentForeground` explicitly. Use one root provider; theme and accent are document-wide. Changes update live and provider-owned inline tokens are restored on unmount.

Primary buttons, Done/Save actions, checked controls, sliders, ratings and calendar selections use the accent. Navigation selection can retain the neutral ink pill; status and destructive colors keep their own meanings. Supporting surfaces remain solid neutral colors.

Advanced overrides can follow the library stylesheet:

```css
:root { --brand: #1fa476; --on-brand: #000; }
```

Hover and icon variants derive from `--brand`; no extra palette setup is required.

| Tokens                                       | Purpose                                      |
| -------------------------------------------- | -------------------------------------------- |
| --bg, --surface, --raised, --sunken, --hover | Page, card, field and interaction surfaces   |
| --text, --muted, --faint                     | Text hierarchy                               |
| --brand, --brand-hover, --brand-strong       | Brand controls and selected states           |
| --ink, --on-ink                              | Primary button and selected tab contrast     |
| --good, --wait, --bad and their -soft tokens | Status text on neutral supporting surfaces   |
| --r-sm, --r-lg, --r-pill, --r-dialog         | Inner, card, pill and dialog radii           |
| --shadow-card, --shadow-pop, --overlay       | Depth and backdrop                           |
| --content                                    | Shared header and page maximum content width |
| --motion-ease, --spring-soft, --ease         | Navigation and control motion                |

ThemeProvider resolves a stored system/light/dark preference to `data-theme` on `<html>`. Override both themes when changing theme-sensitive surfaces:

```css
:root {
  --brand: #6d5ce7;
  --brand-hover: #5c4bd6;
  --brand-strong: #5c4bd6;
}
[data-theme="dark"] {
  --brand: #a298ff;
  --brand-hover: #b4abff;
  --brand-strong: #b4abff;
}
```

Subtree overrides work for inline controls. Body portals (toasts and date picker outside dialogs) use the document’s tokens; use global tokens for a single coherent application theme.

The current stylesheet intentionally includes global reset, typography, forms and reusable classes. Review those rules before adding it to an existing app. Inter is loaded from Google Fonts; remove the first import in css/components.css to use a self-hosted/system font. Use `.site-page` to align pages with the header. The library does not impose Send’s fixed-screen app shell.

Use translated React labels from your application. The extracted text adapter preserves React nodes and interpolates Send’s built-in short picker/pagination labels. Localizing those built-in labels beyond document-locale date formatting currently requires adapting the text adapter; a translation provider is not supplied.

For Next.js, import from a `'use client'` wrapper and add the package to `transpilePackages`. The package ships JSX, not a precompiled CommonJS distribution. Do not use it in React Native.

The foundation lives only in `css/tokens.css`. `--brand-ink` and `--brand-hover` derive opaque readable colors from `--brand`; no transparent accent fill is generated. The legacy `--brand-soft`, `--good-soft`, `--wait-soft` and `--bad-soft` names alias `--raised`. For selected brand fills, pair `--brand` with `--on-brand`. Use `--r-pill` for controls, `--r-circle` for compact indicators, `--r-lg` for cards and `--r-dialog` for dialogs. CSS and JavaScript motion both read `--motion-ease`. Static content does not animate merely because the easing is present.
