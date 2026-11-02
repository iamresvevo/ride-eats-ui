# Ride Eats UI

**A complete React UI foundation for Ride Eats tools and internal platforms.**

A React-first UI library extracted from [Ride Eats Send](https://github.com/iamresvevo/ride-eats-send): the animated header and account menu, dropdowns, dialogs, switches, settings rows, date/time picker, skeletons, icons and identity components. Tables, cards, tiles, metrics, inputs, stacked feedback and a 2,015-icon catalog extend the system.

[Live component browser](https://iamresvevo.github.io/ride-eats-ui/) · [Start a working app](docs/implementation.md) · [Component reference](docs/components.md) · [Customization](docs/customization.md) · [Send extraction map](docs/source-map.md)

![Ride Eats UI component browser](docs/preview.jpg)

## Install

React **19+** and React DOM **19+** are peer dependencies. Install a reviewed release from GitHub:

```sh
npm install github:iamresvevo/ride-eats-ui#v0.4.0
```

The package is not published to the npm registry. It ships JSX source for Vite or another JSX-capable bundler. In Next.js, use a client component and add `transpilePackages: ['@ride-eats/ui']` to your Next configuration. TypeScript declarations are included.

## Start with one component

```jsx
import { Button } from "@ride-eats/ui";
import "@ride-eats/ui/styles.css";

export default function App() {
  return (
    <Button variant="primary" icon="plus" onClick={() => console.log("Create")}>
      Create transfer
    </Button>
  );
}
```

No DOM mounting helpers or manual cleanup. Use React props and state.

For theme, toasts and Send’s tooltips in one place:

```jsx
import { UIProvider } from "@ride-eats/ui";

<UIProvider defaultTheme="system">
  <App />
</UIProvider>;
```

## Header

```jsx
import { useState } from "react";
import { Header, MenuItem, MenuSub } from "@ride-eats/ui";

export default function AppHeader({ account, signOut }) {
  const [view, setView] = useState("files");

  return (
    <Header
      brand={{
        name: "Studio",
        href: "/",
        logoLight: "/brand-dark.svg",
        logoDark: "/brand-light.svg",
      }}
      items={[
        { value: "files", label: "Files", icon: "files", href: "/files" },
        {
          value: "activity",
          label: "Activity",
          icon: "chart",
          href: "/activity",
        },
      ]}
      activeValue={view}
      onNavigate={(item) => setView(item.value)}
      account={account}
      onSignOut={signOut}
      menuContent={
        <MenuItem icon="settings" onSelect={() => setView("settings")}>
          Settings
        </MenuItem>
      }
    />
  );
}
```

`account` is `{ name, email?, avatar?, verified? }`. Use `loading` while checking a session and `signingOut` while signing out. Provide `guestContent` for a signed-out action. `extras` accepts notifications or other React controls. Omit `onNavigate` to use ordinary links; when supplied, route navigation belongs in that callback. No authentication service or backend is bundled.

Tabs now share Send’s fluid sliding and stretching selection pill. `Segmented` exposes the original Send radio-control API. Both honor reduced motion.

## Dropdowns and tabs

```jsx
import { useState } from "react";
import { Dropdown, Tabs } from "@ride-eats/ui";

export default function FileControls() {
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState("Newest");

  return (
    <>
      <Tabs
        value={tab}
        onValueChange={setTab}
        items={[
          { value: "all", label: "All files", count: 24 },
          { value: "shared", label: "Shared", count: 8 },
        ]}
      />
      <Dropdown
        trigger="Actions"
        items={[
          { label: "Edit", icon: "edit", onSelect: () => console.log("Edit") },
          {
            id: "sort",
            label: "Sort",
            value: sort,
            items: ["Newest", "Oldest"].map((label) => ({
              label,
              checked: sort === label,
              onSelect: () => setSort(label),
            })),
          },
          { type: "separator" },
          {
            label: "Delete",
            danger: true,
            onSelect: () => console.log("Delete"),
          },
        ]}
      />
    </>
  );
}
```

For full composition, use Send’s original `<Menu trigger={props => <Button {...props}>…</Button>}>` API with `<MenuItem />`, `<MenuSub />`, `<MenuLabel />` and `<MenuSeparator />`.

## Theme and toasts

```jsx
import {
  ThemeProvider,
  ToastProvider,
  Button,
  useTheme,
  useToast,
} from "@ride-eats/ui";

function Controls() {
  const { theme, setTheme } = useTheme();
  const toast = useToast();
  return (
    <>
      <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        Appearance
      </Button>
      <Button onClick={() => toast("Changes saved", { tone: "good" })}>
        Save
      </Button>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ToastProvider>
        <Controls />
      </ToastProvider>
    </ThemeProvider>
  );
}
```

Override CSS variables after importing the stylesheet:

```css
:root {
  --brand: #1fa476;
  --brand-hover: #1b9169;
  --brand-strong: #1b9169;
  --r-sm: 12px;
  --r-lg: 24px;
}
```

## Component collection

| Area               | Components                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------- |
| Navigation         | `Header`, `AccountMenu`, `Menu`, `Dropdown`, `Tabs`, `Segmented`, `Chips`, `Pagination`      |
| Actions            | `Button`, `Icon`                                                                             |
| Inputs             | `Field`, `Select`, `SearchSelect`, `Switch`, `DateTimePicker`                                |
| Feedback           | `Dialog`, `Modal`, `Skeleton`, `Bone`, `BoneText`, `EmptyState`, `ToastProvider`, `useToast` |
| Display and layout | `Card`, `Stat`, `Badge`, `SettingRow`, `Avatar`, `VerifiedName`, `VerificationBadge`         |
| Theme              | `ThemeProvider`, `useTheme`                                                                  |

See [props and examples](docs/components.md). Preview every component on the [documentation site](https://iamresvevo.github.io/ride-eats-ui/).

## Run the component browser

```sh
git clone https://github.com/iamresvevo/ride-eats-ui.git
cd ride-eats-ui
npm ci
npm run dev
```

Open the Vite URL with `/ride-eats-ui/`. `npm run build` produces the static documentation site in `dist/`. GitHub Actions deploys it to GitHub Pages. `npm run check` checks the vanilla modules; the production build validates the React source and component browser.

## For AI developers

Read [AGENTS.md](AGENTS.md), [the component reference](docs/components.md), and [the extraction map](docs/source-map.md). Prefer `<Header {...props} />` and the other React exports over rebuilding controls. Use `value` / `onValueChange` for library selection controls; Send’s unchanged `Switch` and `DateTimePicker` retain `onChange`. Keep endpoints, auth, translations, business state and routes in the consuming app.

The stylesheet includes global base, form, typography and theme rules. Review it when integrating into an existing design system. Inter loads from Google Fonts with system fallbacks. This is a web React library, not a React Native library. Existing Send and Tools deployments do not automatically consume it.

The older vanilla DOM helpers remain available from `@ride-eats/ui/vanilla`; they are a compatibility entry point. New integrations should use React.

## Build a complete platform screen

[Implementation guide](docs/implementation.md) · [Expanded component APIs](docs/platform-components.md) · [Runnable starter app](examples/starter)

```jsx
<UIProvider>
  <Header brand={brand} items={navigation} account={account} />
  <main className="site-page stack">
    <PageHeader title="Payments" actions={<Button>Check connection</Button>} />
    <MetricGrid>
      <StatCard label="Payments" value="153" hint="1 open" />
      <StatCard label="Paid" value="5" tone="good" />
      <StatCard label="Passed" value="44 / 48" progress={92} />
    </MetricGrid>
    <Card title="Recent payments" description="Shared across your team.">
      <DataTable columns={columns} rows={payments} />
    </Card>
  </main>
</UIProvider>
```

The expanded collection includes **DataTable, Accordion, Alert, Checkbox, RadioGroup, Slider, Progress, PasswordInput, NumberInput, Breadcrumbs, AvatarGroup, CopyButton, FileDropzone, Timeline, Drawer, CardHeader, CardBody, CardFooter, MetricGrid, StatCard, Tile, PageHeader, Toolbar**, and async **useConfirm** / **useFeedback**.

## Built-in icons

**2,015 Lucide icons**, plus Send's original glyphs, under one API. The catalog is bundled with the kit in lazy letter groups; it does not use an external icon CDN or add a runtime icon-package dependency. Artwork attribution and the ISC/Feather notices are included in [the icon notice](react/icons/NOTICE.md).

```jsx
<Icon name="headset" size={24} strokeWidth={1.7} />
<Icon name="loader-circle" motion="spin" animateOn="always" />
<Icon name="check" motion="draw" />
<IconProvider icons={{ brand: <path d="M4 12 12 4l8 8-8 8Z" /> }}>
  <Icon name="brand" size={32} />
</IconProvider>
```

[Search and preview the icon catalog](https://iamresvevo.github.io/ride-eats-ui/#icons). Motion is opt-in and respects reduced motion. Icons are Lucide artwork behind Ride Eats UI's component API, not claimed as original Ride Eats drawings.

## Native SVG motion and more components

[Animated icons](https://iamresvevo.github.io/ride-eats-ui/#animated-icons) now have a dedicated page. These animate SVG paths, strokes and internal parts with native animate/animateTransform elements, rather than moving a view wrapper. Presets: bell, heart, check, upload, download, search, refresh, settings, folder and send. Hover/focus plays once; playing and loop provide explicit control. Reduced-motion preferences stop playback.

```jsx
<AnimatedIcon name="bell" size={28} />
<AnimatedIcon name="heart" playing loop />
<AnimatedIcon name="check" playing />
```

The library also includes Popover, CommandMenu, Collapsible, Steps, PinInput, ToggleGroup, Rating, ScrollArea and Separator. The component browser has 51 pages. Its sidebar search stays pinned, and icon size/stroke/motion choices are segmented selectors.

Keep Dialog/Modal mounted and use open={false} for the animated exit. useConfirm resolves after the confirmation has closed, so a parent form can then close without competing animations. Dialog is a simple-sheet demo; Stacked Dialogs demonstrates the draft/discard workflow.
