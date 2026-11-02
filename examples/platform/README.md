# Compact platform starter

Clone the repository, then from this directory run:

```sh
npm install
npm run dev
```

This working React app combines AppShell, workspace switching, notifications, team invitations/role changes/removal, file selection, activity, support replies and settings. Demo data stays in React state and resets on reload. It does not send invitations, upload files, send support messages or change backend sessions.

Replace the callbacks with your authenticated application API. Return a Promise from mutation callbacks so controls reflect pending/errors. Keep UIProvider around the app for confirmations, notifications and theme handling. The dependency is pinned to the GitHub release in package.json.

Default density is compact. Add `data-density="comfortable"` to a wrapper for larger controls and panel padding. The mobile navigation becomes a native modal; physical device validation is still required for your application.
