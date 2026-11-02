# Ride Eats UI

Shared Ride Eats header, dropdowns, tabs, forms, dialogs and design tokens, extracted from Ride Eats Tools and the Send design. Framework-free browser ES modules; no runtime dependencies or build step. Version 0.1.0.

## Clone and run

```sh
git clone https://github.com/iamresvevo/ride-eats-ui.git
cd ride-eats-ui
npm run check
npm run dev
```

Open http://127.0.0.1:4320/examples/ for the interactive component gallery. Requires Node.js 18+ for checks and Python 3 for the demo server. Private repository access requires a GitHub account/token with read permission.

## Use in any web app

Copy `src/` and `css/` together into a public `vendor/ride-eats-ui/` directory, or add this repository as a Git submodule there. Keep relative paths intact. Pin a reviewed commit for reproducible updates. Serve over HTTP, not file://.

```html
<link rel="stylesheet" href="/vendor/ride-eats-ui/css/index.css">
<script type="module">
  import { initUI, applyTheme, el, siteHeader, tabs, toast }
    from '/vendor/ride-eats-ui/src/index.js';
  initUI();
  applyTheme();
  const header = siteHeader({
    brand: { name: 'My App', href: '/',
      logoLight: '/my-logo-dark.svg', logoDark: '/my-logo-light.svg' },
    items: [{ id: 'home', label: 'Home', icon: 'home', href: '/' }],
    account: { name: 'Alex', email: 'alex@example.com', verified: false },
    onSignOut: async () => { /* call your own sign-out endpoint */ },
  });
  document.body.prepend(header.node);
  header.setActive('home');
  const control = tabs([{id:'all',label:'All'},{id:'active',label:'Active'}],
    'all', id => toast(`Selected ${id}`));
  document.body.append(el('main', {class:'site-page'}, control.node));
  // On SPA unmount: header.destroy(); header.node.remove();
</script>
```

For a bundler, install a pinned Git commit (`npm install github:iamresvevo/ride-eats-ui#COMMIT_SHA`), import JS from `@ride-eats/ui` and CSS from `@ride-eats/ui/styles.css`. This package is not published to npm. React/Vue apps can mount a component's DOM node into a ref and dispose it when unmounting; these are not native React/Vue components.

## Components and design

[Quick component reference](docs/components.md) · [Design rules](docs/design.md) · [AI developer instructions](AGENTS.md)

Global CSS supplies reset, typography, page background and element styles. The default font loads Inter from Google Fonts with system fallbacks; remove the first import in components.css if self-hosting fonts or working offline. Supply your own brand assets; no logos, API keys, backend or authentication implementation are bundled. Header account data and navigation/sign-out callbacks belong to your app. `account: null` means loading, not a signed-out guest menu.

This extraction does not automatically update existing Tools or Send deployments. Pull reviewed library changes into consuming apps explicitly. Browser testing is still required for each integration; no accessibility conformance certification is claimed.
