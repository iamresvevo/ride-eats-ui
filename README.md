# Ride Eats UI

**Send’s familiar details, as customizable React components.**

A React-first UI library extracted from [Ride Eats Send](https://github.com/iamresvevo/ride-eats-send): the animated header and account menu, dropdowns, dialogs, switches, settings rows, date/time picker, skeletons, icons and identity components. Generic tabs, fields and feedback primitives complete the system.

[Live component browser](https://iamresvevo.github.io/ride-eats-ui/) · [Component reference](docs/components.md) · [Customization](docs/customization.md) · [Send extraction map](docs/source-map.md)

![Ride Eats UI component browser](docs/preview.jpg)

## Install

React **19+** and React DOM **19+** are peer dependencies. Install a reviewed release from GitHub:

```sh
npm install github:iamresvevo/ride-eats-ui#v0.2.1
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
