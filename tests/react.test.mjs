import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { PassThrough } from "node:stream";
import { renderToPipeableStream, renderToStaticMarkup } from "react-dom/server";
import * as UI from "../.test-build/index.js";
const render = (name, props) =>
  renderToStaticMarkup(React.createElement(UI[name], props));
test("loading Button preserves Send loading semantics and submit support", () => {
  const html = render("Button", {
    variant: "primary",
    loading: true,
    loadingLabel: "Saving…",
    type: "submit",
    children: "Save",
  });
  assert.match(html, /btn-primary/);
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /disabled/);
  assert.match(html, /Saving…/);
  assert.match(html, /type="submit"/);
  // The idle label keeps the button width but is hidden from assistive tech.
  assert.match(html, /<span class="btn-label" aria-hidden="true">Save<\/span>/);
});
test("controlled tabs expose panel associations and only the active stop", () => {
  const html = render("Tabs", {
    value: "b",
    items: [
      { value: "a", label: "First", id: "a", panelId: "pa" },
      { value: "b", label: "Second", id: "b", panelId: "pb" },
    ],
    onValueChange() {},
  });
  assert.match(html, /aria-controls="pb" aria-selected="true" tabindex="0"/);
  assert.match(html, /aria-controls="pa" aria-selected="false" tabindex="-1"/);
});
test("Field associates validation with a caller supplied id", () => {
  const html = render("Field", {
    label: "Email",
    id: "email",
    error: "Invalid email",
    children: React.createElement("input", { type: "email" }),
  });
  assert.match(html, /for="email"/);
  assert.match(html, /aria-describedby="email-hint"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /id="email-hint"/);
});
test("Select preserves Field label and validation associations", () => {
  const html = render("Field", {
    id: "role",
    label: "Role",
    error: "Choose a role",
    children: React.createElement(UI.Select, {
      value: "",
      options: [{ value: "editor", label: "Editor" }],
      onValueChange() {},
    }),
  });
  assert.match(html, /for="role"/);
  assert.match(html, /<button[^>]*id="role"/);
  assert.match(html, /aria-describedby="role-hint"/);
  assert.match(html, /aria-invalid="true"/);
});
test("Header uses caller supplied brand, links and account; no Send routes", () => {
  const html = render("Header", {
    brand: { name: "Acme", href: "/acme" },
    items: [{ value: "home", label: "Home", href: "/acme/home" }],
    activeValue: "home",
    account: { name: "Test User", email: "test@example.com" },
  });
  assert.match(html, /Acme/);
  assert.match(html, /href="\/acme\/home"/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /Account: Test User/);
  assert.doesNotMatch(html, /\/transfers|\/admin/);
});
test("closed Dialog renders no modal and pagination hides one-page controls", () => {
  assert.equal(
    render("Dialog", { open: false, onOpenChange() {}, title: "Test" }),
    "",
  );
  assert.equal(
    render("Pagination", {
      page: 1,
      pageSize: 10,
      total: 8,
      onPageChange() {},
    }),
    "",
  );
  assert.match(
    render("Pagination", {
      page: 2,
      pageSize: 10,
      total: 42,
      onPageChange() {},
    }),
    /Page 2 of 5/,
  );
});
test("unverified identities omit the verification badge and retain safe labels", () => {
  assert.equal(render("VerificationBadge", { verified: false }), "");
  assert.match(
    render("VerifiedName", { name: "<script>bad</script>", verified: true }),
    /&lt;script&gt;/,
  );
});

test("Send selection motion slides and stretches only after initial placement", async (t) => {
  const { placeSelection } = await import("../react/send/hooks/selection.js");
  const previous = globalThis.matchMedia;
  t.after(() => {
    if (previous) globalThis.matchMedia = previous;
    else delete globalThis.matchMedia;
  });
  globalThis.matchMedia = () => ({ matches: false });
  const frames = [];
  const liquid = {
    style: {},
    getAnimations: () => [],
    animate: (keyframes, options) => frames.push({ keyframes, options }),
  };
  const pill = { dataset: {}, style: {}, firstElementChild: liquid };
  const selected = {
    offsetLeft: 4,
    offsetTop: 4,
    offsetWidth: 100,
    offsetHeight: 34,
  };
  const root = {
    offsetWidth: 300,
    querySelector: (selector) =>
      selector === "[data-selection-pill]" ? pill : selected,
  };
  placeSelection(root, false);
  assert.equal(frames.length, 0);
  assert.equal(pill.style.transition, "none");
  selected.offsetLeft = 108;
  placeSelection(root, true);
  assert.equal(pill.style.transform, "translate(108px, 4px)");
  assert.equal(pill.style.transition, "");
  assert.equal(frames.length, 1);
  assert.equal(frames[0].options.duration, 400);
  assert.match(frames[0].keyframes[1].transform, /0\.88/);
  assert.equal(liquid.style.transformOrigin, "25% center");
  globalThis.matchMedia = () => ({ matches: true });
  selected.offsetLeft = 4;
  placeSelection(root, true);
  assert.equal(frames.length, 1);
  assert.equal(pill.style.transition, "none");
});

test("all new controls render with their basic implementation API", () => {
  const noop = () => {};
  const cases = [
    [
      "Accordion",
      {
        items: [{ value: "a", title: "A", content: "Detail" }],
        value: "a",
        onValueChange: noop,
      },
    ],
    ["Alert", { title: "Saved", children: "Done", tone: "good" }],
    ["Checkbox", { label: "Select", checked: true, onCheckedChange: noop }],
    [
      "RadioGroup",
      {
        label: "Access",
        options: [{ value: "a", label: "Private" }],
        value: "a",
        onValueChange: noop,
      },
    ],
    ["Slider", { value: 50, onValueChange: noop }],
    ["Progress", { value: 64 }],
    ["PasswordInput", { value: "test", onChange: noop }],
    ["NumberInput", { value: 2, onValueChange: noop, min: 1, max: 10 }],
    [
      "Breadcrumbs",
      { items: [{ label: "Home", href: "/" }, { label: "Current" }] },
    ],
    ["AvatarGroup", { people: [{ name: "Alex" }] }],
    ["CopyButton", { value: "test" }],
    ["FileDropzone", { onFiles: noop }],
    ["Timeline", { items: [{ title: "Created" }] }],
    [
      "Card",
      {
        title: "Settings",
        description: "Details",
        action: React.createElement("button", null, "More"),
        footer: "Footer",
        children: "Body",
      },
    ],
    [
      "StatCard",
      { label: "Paid", value: 5, chart: [1, 4, 2, 6], progress: 60 },
    ],
    ["Tile", { title: "Files", href: "/files" }],
    ["PageHeader", { title: "Payments", icon: "files" }],
    [
      "DateTimePicker",
      { value: 1800000000, label: "Scheduled date", disabled: true },
    ],
  ];
  for (const [name, props] of cases)
    assert.ok(render(name, props).length > 0, name);
});
test("DataTable exposes caller cells, sorting state, selection and empty/loading content", () => {
  const html = render("DataTable", {
    caption: "People",
    rows: [{ id: "alex", name: "Alex", status: "Active" }],
    columns: [
      { key: "name", label: "Name", sortable: true },
      {
        key: "status",
        label: "Status",
        render: (value) => React.createElement("strong", null, value),
      },
    ],
    sort: { key: "name", direction: "asc" },
    onSortChange() {},
    selectedKeys: ["alex"],
    onSelectionChange() {},
    rowActions: () => React.createElement("button", null, "View"),
  });
  assert.match(html, /aria-sort="ascending"/);
  assert.match(html, /<strong>Active<\/strong>/);
  assert.match(html, /data-selected="true"/);
  assert.match(html, /Select all rows/);
  assert.match(html, /View/);
  assert.match(
    render("DataTable", {
      columns: [{ key: "name", label: "Name" }],
      rows: [],
      emptyContent: "Nothing to show",
    }),
    /Nothing to show/,
  );
  assert.match(
    render("DataTable", {
      columns: [{ key: "name", label: "Name" }],
      rows: [],
      loading: true,
    }),
    /aria-busy="true"/,
  );
});
test("bundled catalog is extensive and contains safe SVG nodes in lazy chunks", async () => {
  const { iconNames } = await import("../react/icons/names.js");
  const { loaders } = await import("../react/icons/loaders.js");
  assert.ok(iconNames.length >= 2000);
  assert.equal(new Set(iconNames).size, iconNames.length);
  let count = 0;
  for (const load of Object.values(loaders)) {
    const { default: icons } = await load();
    for (const nodes of Object.values(icons)) {
      count++;
      for (const [tag, attrs] of nodes) {
        assert.ok(
          [
            "path",
            "circle",
            "rect",
            "line",
            "polyline",
            "polygon",
            "ellipse",
          ].includes(tag),
          tag,
        );
        assert.ok(
          Object.keys(attrs).every(
            (key) => !key.toLowerCase().startsWith("on"),
          ),
        );
      }
    }
  }
  assert.equal(count, UI.iconNames.length);
});
test("custom SVG glyphs use the same accessible Icon API", () => {
  const html = renderToStaticMarkup(
    React.createElement(
      UI.IconProvider,
      { icons: { brand: React.createElement("path", { d: "M4 4h16v16H4Z" }) } },
      React.createElement(UI.Icon, {
        name: "brand",
        size: 32,
        label: "Company",
        motion: "draw",
      }),
    ),
  );
  assert.match(html, /aria-label="Company"/);
  assert.match(html, /width="32"/);
  assert.match(html, /data-motion="draw"/);
  assert.match(html, /M4 4h16v16H4Z/);
});

test("animated icons contain native SVG motion and no animated view wrapper", async () => {
  const html = await new Promise((resolve, reject) => {
    const output = new PassThrough();
    let text = "";
    output.on("data", (chunk) => {
      text += chunk;
    });
    output.on("end", () => resolve(text));
    const stream = renderToPipeableStream(
      React.createElement(
        React.Fragment,
        null,
        UI.iconNames.map((name) =>
          React.createElement(UI.Icon, {
            motion: "auto",
            key: name,
            name,
            size: 28,
            playing: true,
          }),
        ),
      ),
      {
        onAllReady() {
          stream.pipe(output);
        },
        onError: reject,
      },
    );
  });
  assert.ok(html.length > 0);
  for (const name of UI.iconNames) {
    const html = render("Icon", { motion: "auto", name, playing: true });
    assert.match(html, /<svg/);
    const { geometryMotionNames } =
      await import("../react/icons/motion-names.js");
    if (geometryMotionNames.includes(name)) assert.match(html, /<animate /);
    else assert.doesNotMatch(html, /<animate /);
    assert.doesNotMatch(html, /<div/);
    assert.doesNotMatch(html, /animation:/);
    assert.doesNotMatch(html, /animateTransform|attributeName="transform"/);
    for (const match of html.matchAll(/<animate\s[^>]*values="([^"]+)"/g)) {
      const values = match[1].split(";");
      assert.equal(
        values[0],
        values.at(-1),
        `${name}: loop must return to the same state`,
      );
    }
  }
  assert.match(
    render("Icon", { motion: "auto", name: "upload" }),
    /attributeName="d"/,
  );
  assert.match(
    render("Icon", { motion: "auto", name: "download" }),
    /attributeName="d"/,
  );
  assert.match(
    render("Icon", { name: "check", motion: "draw" }),
    /attributeName="stroke-dashoffset"/,
  );
});
test("new platform controls expose native interaction semantics", () => {
  const noop = () => {};
  const cases = [
    [
      "Popover",
      {
        open: false,
        onOpenChange: noop,
        trigger: (props) => React.createElement("button", props, "Details"),
        children: "Content",
      },
    ],
    ["PinInput", { value: "123", onValueChange: noop }],
    [
      "ToggleGroup",
      {
        items: [{ value: "a", label: "Bold" }],
        multiple: true,
        value: ["a"],
        multiple: true,
        onValueChange: noop,
      },
    ],
    ["Rating", { value: 4, onValueChange: noop }],
  ];
  for (const [name, props] of cases)
    assert.ok(render(name, props).length > 0, name);
  assert.match(
    render("PinInput", { value: "123", onValueChange: noop }),
    /autoComplete="one-time-code"/i,
  );
});

test("copyable component examples import existing public exports", async () => {
  const { collectionPages } = await import("../site/collection-data.js");
  const { motionPages } = await import("../site/motion-data.js");
  const { platformPages } = await import("../site/platform-data.js");
  for (const page of [...collectionPages, ...motionPages, ...platformPages])
    for (const raw of page.imports.split(",")) {
      const name = raw.trim();
      assert.match(name, /^[A-Za-z_$][\w$]*$/, page.id);
      assert.ok(name in UI, `${page.id}: missing ${name}`);
    }
});

test("every catalog icon has generated per-shape native SVG animation", async () => {
  const { loaders } = await import("../react/icons/loaders.js");
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(
    new URL("../react/icons/AnimatedShapes.jsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /attributeName="stroke-dashoffset"/);
  assert.doesNotMatch(source, /values="0;0;.55;0;0"/);
  assert.doesNotMatch(source, /strokeOpacity:\s*0?\.24/);
  assert.doesNotMatch(source, /<svg|<div|animation:/);
  const names = new Set(UI.iconNames);
  for (const name of UI.iconNames) assert.ok(names.has(name), name);
  let count = 0;
  const geometryNames = new Set();
  for (const loader of Object.values(loaders)) {
    const { default: icons } = await loader();
    for (const [name, nodes] of Object.entries(icons)) {
      geometryNames.add(name);
      assert.ok(nodes.length, name);
      for (const [tag] of nodes)
        assert.ok(
          [
            "path",
            "circle",
            "ellipse",
            "rect",
            "line",
            "polyline",
            "polygon",
          ].includes(tag),
          name + ": " + tag,
        );
      count++;
    }
  }
  assert.equal(count, UI.iconNames.length);
  for (const name of UI.iconNames) assert.ok(geometryNames.has(name), name);
});

test("gesture controls expose keyboard alternatives and controlled boundaries", () => {
  const noop = () => {};
  const reorder = render("ReorderList", {
    items: [
      { id: "a", label: "First" },
      { id: "b", label: "Second" },
    ],
    onReorder: noop,
  });
  assert.match(reorder, /aria-label="Move item 1 down"/);
  assert.match(reorder, /disabled="" aria-label="Move item 1 up"/);
  assert.match(reorder, /role="status"/);
  const swipe = render("SwipeActions", {
    actions: [{ value: "archive", label: "Archive", onSelect: noop }],
    children: "File",
  });
  assert.match(swipe, /aria-label="Show actions"/);
  assert.match(swipe, /inert=""/);
  const split = render("SplitPane", {
    value: 40,
    onValueChange: noop,
    first: "A",
    second: "B",
  });
  assert.match(split, /role="separator"/);
  assert.match(split, /aria-valuenow="40"/);
  const range = render("RangeSlider", {
    value: [20, 80],
    onValueChange: noop,
    label: "Budget",
  });
  assert.equal((range.match(/type="range"/g) || []).length, 2);
  assert.match(range, /aria-label="Budget minimum"/);
  assert.match(range, /aria-label="Budget maximum"/);
  const carousel = render("Carousel", {
    items: [
      { id: "a", title: "One" },
      { id: "b", title: "Two" },
    ],
    renderItem: (item) => item.title,
  });
  assert.match(carousel, /aria-roledescription="carousel"/);
  assert.match(carousel, /aria-label="Next slide"/);
  assert.match(carousel, /inert=""/);
});

test("DataGrid combines search, exact filters and stable numeric sorting", async () => {
  const { getGridRows, getWindow } = await import("../react/grid-model.js");
  const rows = [
    { id: "a", name: "Alex", role: "Editor", count: 10 },
    { id: "b", name: "Sam", role: "Viewer", count: 2 },
    { id: "c", name: "Alex", role: "Editor", count: 10 },
  ];
  const columns = [{ key: "name" }, { key: "role" }, { key: "count" }];
  assert.deepEqual(
    getGridRows(rows, columns, {
      query: "alex",
      filters: { role: "Editor" },
    }).map((row) => row.id),
    ["a", "c"],
  );
  assert.deepEqual(
    getGridRows(rows, columns, {
      sort: { key: "count", direction: "asc" },
    }).map((row) => row.id),
    ["b", "a", "c"],
  );
  assert.deepEqual(
    getGridRows(rows, columns, {
      sort: { key: "count", direction: "desc" },
    }).map((row) => row.id),
    ["a", "c", "b"],
  );
  assert.equal(getGridRows(rows, columns, { query: "missing" }).length, 0);
  assert.deepEqual(getWindow(0, 0, 40, 320), { start: 0, end: 0 });
  const window = getWindow(1500, 2800, 40, 320);
  assert.equal(window.start, 66);
  assert.equal(window.end - window.start, 16);
  assert.ok(window.end < 1500);
});

test("platform controls render compact semantics, data states and typed composition", () => {
  const noop = () => {};
  for (const [name, props] of [
    [
      "Textarea",
      { label: "Notes", value: "Text", onChange: noop, error: "Fix this" },
    ],
    [
      "Form",
      {
        initialValues: { name: "" },
        onSubmit: noop,
        children: ({ field }) => React.createElement("input", field("name")),
      },
    ],
    [
      "Combobox",
      {
        options: [{ value: "a", label: "Alex" }],
        value: "a",
        onValueChange: noop,
        label: "Assignee",
      },
    ],
    [
      "Combobox",
      {
        options: [{ value: "a", label: "Alex" }],
        multiple: true,
        value: ["a"],
        onValueChange: noop,
      },
    ],

    [
      "DateRangePicker",
      {
        value: { start: "2026-11-02", end: "2026-11-09" },
        onValueChange: noop,
      },
    ],
    ["TimePicker", { value: "09:00", onValueChange: noop }],
    [
      "UploadProgress",
      {
        files: [{ id: "1", name: "File", status: "error", error: "Retry" }],
        onRetry: noop,
      },
    ],
    [
      "DataGrid",
      {
        rows: [],
        columns: [{ key: "name", label: "Name" }],
        error: "Could not load",
        onRetry: noop,
      },
    ],
    [
      "WorkspaceSwitcher",
      {
        items: [{ value: "a", label: "Studio" }],
        value: "a",
        onValueChange: noop,
      },
    ],
    ["NotificationCenter", { items: [] }],
    [
      "AppShell",
      {
        items: [{ value: "a", label: "Home" }],
        value: "a",
        onValueChange: noop,
        children: "App",
      },
    ],
    [
      "BottomSheet",
      { open: false, onClose: noop, title: "Sheet", children: "Body" },
    ],
    [
      "ContextMenu",
      { items: [{ value: "a", label: "Open" }], children: "Target" },
    ],
    [
      "SettingsPanel",
      { sections: [{ id: "a", title: "General", children: "Fields" }] },
    ],
    ["TeamDirectory", { members: [] }],
    ["FileManager", { files: [] }],
    ["Timeline", { variant: "feed", items: [] }],
    ["SupportInbox", { threads: [], value: "", onValueChange: noop }],
  ])
    assert.ok(render(name, props).length > 0 || name === "BottomSheet", name);
  assert.match(
    render("Combobox", { options: [], value: "", onValueChange: noop }),
    /role="combobox"/,
  );
  assert.match(
    render("Combobox", {
      multiple: true,
      options: [{ value: "a", label: "Alex" }],
      multiple: true,
      value: ["a"],
      onValueChange: noop,
    }),
    /aria-label="Remove Alex"/,
  );
  const grid = render("DataGrid", {
    rows: Array.from({ length: 1500 }, (_, i) => ({
      id: i,
      name: "Member " + i,
    })),
    columns: [{ key: "name" }],
    virtual: true,
  });
  assert.match(grid, /aria-rowcount="1501"/);
  assert.ok((grid.match(/aria-rowindex=/g) || []).length <= 16);
});

test("visual regression comparison detects layout changes while tolerating small encoding noise", async () => {
  const { comparePixels } = await import("../scripts/compare-visuals.mjs");
  const image = { width: 100, height: 1, data: new Uint8Array(400).fill(128) };
  const same = { ...image, data: new Uint8Array(image.data) };
  same.data[0] += 5;
  assert.equal(comparePixels(image, same).pass, true);
  const different = { ...image, data: new Uint8Array(image.data) };
  different.data[0] = 255;
  assert.equal(comparePixels(image, different).pass, false);
  assert.equal(comparePixels(image, { ...image, width: 99 }).pass, false);
});

test("audit removes duplicate APIs and preserves canonical equivalents", () => {
  for (const name of [
    "Autocomplete",
    "Collapsible",
    "Stat",
    "Modal",
    "Steps",
    "Separator",
  ])
    assert.equal(name in UI, false, name);
  assert.match(
    render("Combobox", {
      options: [],
      value: "Custom",
      allowCustom: true,
      onValueChange: () => {},
    }),
    /Custom/,
  );
  assert.match(
    render("Accordion", {
      items: [{ value: "details", title: "Details", content: "Content" }],
      value: "details",
      onValueChange: () => {},
    }),
    /aria-expanded="true"/,
  );
  assert.match(
    render("StatCard", { variant: "inline", label: "Files", value: 24 }),
    /re-stat-inline/,
  );
});

test("command search ranks multi-term queries and preserves nested scope paths", async () => {
  const { searchCommands, matchesCommandShortcut } =
    await import("../react/command-model.js");
  const items = [
    {
      value: "files",
      label: "Files",
      group: "Navigate",
      description: "Browse team documents",
    },
    {
      value: "settings",
      label: "Settings",
      items: [
        {
          value: "appearance",
          label: "Appearance",
          items: [
            {
              value: "dark",
              label: "Dark theme",
              description: "Use a dark interface",
            },
          ],
        },
      ],
    },
    { value: "disabled", label: "Disabled", disabled: true },
  ];
  assert.deepEqual(
    searchCommands(items, "team documents").map((item) => item.value),
    ["files"],
  );
  const dark = searchCommands(items, "dark")[0];
  assert.equal(dark.value, "dark");
  assert.deepEqual(dark.path, ["settings", "appearance"]);
  assert.deepEqual(dark.trail, ["Settings", "Appearance"]);
  assert.equal(searchCommands(items, "disabled").length, 0);
  assert.equal(
    matchesCommandShortcut({ key: "n", altKey: true }, "Alt+N"),
    true,
  );
  assert.equal(matchesCommandShortcut({ key: "n" }, "N"), false);
  assert.equal(
    matchesCommandShortcut({ key: "1", metaKey: true }, "Mod+1"),
    true,
  );
  assert.equal(
    matchesCommandShortcut({ key: "n", ctrlKey: true }, "Alt+N"),
    false,
  );
});

test("implementation workbench emits complete parsable controlled React examples", async () => {
  const { implementationCode } = await import("../site/implementation-code.js");
  const { transformWithEsbuild } = await import("vite");
  const examples = [
    ["Textarea", { label: "Notes" }, { value: "", onChange() {} }],
    [
      "Combobox",
      { label: "Assignee" },
      {
        options: [{ value: "a", label: "Alex" }],
        value: "a",
        onValueChange() {},
      },
    ],
    [
      "Combobox",
      { label: "People" },
      {
        options: [{ value: "a", label: "Alex" }],
        multiple: true,
        value: ["a"],
        onValueChange() {},
      },
    ],
    ["TimePicker", {}, { value: "09:00", onValueChange() {} }],
    [
      "DateRangePicker",
      {},
      { value: { start: "", end: "" }, onValueChange() {} },
    ],
    ["Rating", { max: 5 }, { value: 3, onValueChange() {} }],
    [
      "RangeSlider",
      { min: 0, max: 100 },
      { value: [20, 80], onValueChange() {} },
    ],
    [
      "SplitPane",
      {},
      { value: 40, first: "Navigation", second: "Content", onValueChange() {} },
    ],
    [
      "DataGrid",
      { label: "Records" },
      {
        rows: [{ id: "1", name: "Alex" }],
        columns: [{ key: "name", label: "Name" }],
      },
    ],
    [
      "AppShell",
      { brand: "Studio" },
      {
        items: [{ value: "home", label: "Home" }],
        value: "home",
        onValueChange() {},
      },
    ],
  ];
  for (const [component, props, controlled] of examples) {
    const source = implementationCode(component, props, controlled);
    await transformWithEsbuild(source, "example.jsx", { loader: "jsx" });
    assert.match(source, /export default function Example/);
    if ("value" in controlled) {
      assert.match(source, /useState\(/);
      assert.match(
        source,
        component === "Textarea" ? /onChange=/ : /onValueChange=/,
      );
    }
    for (const key of ["options", "rows", "columns", "items"])
      if (key in controlled) assert.ok(source.includes(`const ${key} =`));
  }
});

test("compatibility icon names resolve real upstream geometry", async () => {
  const { default: icons } = await import("../react/icons/chunks/b.js");
  assert.ok(UI.iconNames.includes("bold"));
  assert.match(icons.bold[0][1].d, /M6 12h9/);
  for (const name of ["bold", "italic", "underline"]) {
    const html = render("Icon", { name });
    assert.match(html, /<path/);
    assert.doesNotMatch(html, /M9 9a3 3/);
  }
  assert.ok(!JSON.stringify(icons.bold).includes("M9 9a3 3"));
});

test("date ranges use shared custom calendar triggers instead of native browser date fields", () => {
  const html = render("DateRangePicker", {
    value: { start: "2026-11-02", end: "2026-11-09" },
    label: "Period",
    locale: "en-GB",
    onValueChange() {},
  });
  assert.doesNotMatch(html, /type="date"/);
  assert.equal((html.match(/class="dtp-field"/g) || []).length, 2);
  assert.match(html, /aria-label="Period: From"/);
  assert.match(html, /aria-label="Period: Until"/);
  assert.match(html, /2 Nov 2026/);
  const disabled = render("DateRangePicker", {
    value: { start: "", end: "" },
    disabled: true,
    onValueChange() {},
  });
  assert.equal((disabled.match(/disabled=""/g) || []).length, 3);
  assert.match(disabled, /Choose date/);
});

test("solid accent foreground chooses the higher contrast black or white", async () => {
  const { accentText } = await import("../react/accent.js");
  assert.equal(accentText("#000"), "#ffffff");
  assert.equal(accentText("#fff"), "#000000");
  assert.equal(accentText("#0066ff"), "#ffffff");
  assert.equal(accentText("#ffcc00"), "#000000");
  assert.equal(accentText("var(--custom)"), undefined);
});

test("sheet release distinguishes a short pull, a deliberate distance, and a flick", async () => {
  const { shouldDismissSheet } = await import("../react/sheet-motion.js");
  assert.equal(shouldDismissSheet(15, 2, 360), false);
  assert.equal(shouldDismissSheet(60, 0.1, 360), false);
  assert.equal(shouldDismissSheet(110, 0.1, 360), true);
  assert.equal(shouldDismissSheet(40, 0.8, 360), true);
  assert.equal(shouldDismissSheet(40, -0.8, 360), false);
  assert.equal(shouldDismissSheet(85, 0.1, 300), true);
  assert.equal(shouldDismissSheet(125, 0, 800), true);
});

test("split resistance stays bounded, increases smoothly and leaves valid ratios unchanged", async () => {
  const { elasticSplit } = await import("../react/split-motion.js");
  assert.equal(elasticSplit(50, 20, 80), 50);
  assert.ok(elasticSplit(10, 20, 80) < 20 && elasticSplit(10, 20, 80) > 14);
  assert.ok(elasticSplit(0, 20, 80) < elasticSplit(10, 20, 80));
  assert.ok(elasticSplit(90, 20, 80) > 80 && elasticSplit(90, 20, 80) < 86);
  assert.equal(elasticSplit(-200, 0, 100), 0);
  assert.equal(elasticSplit(300, 0, 100), 100);
});

test("geometry motion preserves arc flags, relative paths and visible native attributes", async () => {
  const { morphPath, shapeMotion } =
    await import("../react/icons/motion-profiles.js");
  assert.equal(morphPath("M2 3h4v5", { dx: 1, dy: 2 }), "M 3 5 h 4 v 5");
  assert.equal(morphPath("m2 3 4 5", { dx: 1 }), "m 3 3 l 4 5");
  assert.equal(
    morphPath("M2 3a4 5 0 0 1 6 7", { scale: 2 }),
    "M -8 -6 a 8 10 0 0 1 12 14",
  );
  const { loaders } = await import("../react/icons/loaders.js");
  for (const loader of Object.values(loaders))
    for (const [name, nodes] of Object.entries((await loader()).default))
      for (const [index, [tag, attributes]] of nodes.entries()) {
        const result = shapeMotion(name, tag, attributes, index, nodes);
        assert.ok(
          ["d", "cy", "cx", "r", "x2", "height", "stroke-opacity"].includes(
            result.attributeName,
          ),
          name,
        );
        assert.ok(!/NaN|undefined|Infinity/.test(result.values), name);
        assert.equal(
          result.values.split(";")[0],
          result.values.split(";").at(-1),
          name,
        );
      }
});
test("recent hashed assets survive deployment without overwriting the current build", async (t) => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const path = await import("node:path");
  const { retainAssets } = await import("../scripts/retain-pages-assets.mjs");
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ui-asset-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const make = (name, files) => {
    const site = path.join(root, name);
    fs.mkdirSync(path.join(site, "assets"), { recursive: true });
    for (const [file, body] of Object.entries(files))
      fs.writeFileSync(path.join(site, "assets", file), body);
    return site;
  };
  const dest = make("current", {
    "main-new.js": "new",
    "shared.js": "current",
  });
  const previous = make("previous", {
    "catalog-old.js": "old",
    "shared.js": "previous",
  });
  const oldest = make("oldest", { "expired.js": "expired" });
  fs.writeFileSync(
    path.join(previous, "asset-history.json"),
    JSON.stringify({
      builds: [
        {
          id: "previous",
          createdAt: "2026-01-02",
          files: ["catalog-old.js", "shared.js", "../unsafe.js"],
        },
      ],
    }),
  );
  const result = retainAssets(
    dest,
    [
      { site: previous, id: "previous", createdAt: "2026-01-02" },
      { site: oldest, id: "oldest", createdAt: "2026-01-01" },
    ],
    { id: "current", createdAt: "2026-01-03" },
    2,
  );
  assert.equal(result.copied, 1);
  assert.equal(
    fs.readFileSync(path.join(dest, "assets", "shared.js"), "utf8"),
    "current",
  );
  assert.equal(
    fs.readFileSync(path.join(dest, "assets", "catalog-old.js"), "utf8"),
    "old",
  );
  assert.equal(fs.existsSync(path.join(dest, "assets", "expired.js")), false);
  const history = JSON.parse(
    fs.readFileSync(path.join(dest, "asset-history.json")),
  );
  assert.equal(history.builds.length, 2);
  assert.ok(
    history.builds.every((group) =>
      group.files.every((file) => !file.includes("/")),
    ),
  );
});

test("audited literal core icons render explicit SVG motion", async () => {
  const { readFile } = await import("node:fs/promises");
  const usage = JSON.parse(
    await readFile(
      new URL("../docs/icon-usage-audit.json", import.meta.url),
      "utf8",
    ),
  );
  const names = new Set(
    Object.values(usage)
      .filter((value) => typeof value === "object")
      .flatMap(Object.keys),
  );
  for (const name of names) {
    if (name === "brand" || name === "${selected}") continue;
    assert.match(
      render("Icon", { motion: "auto", name, playing: true }),
      /<animate /,
      name,
    );
  }
});

test("TimePicker uses the shared custom popup and keeps empty/disabled semantics", () => {
  const html = render("TimePicker", {
    value: "09:30",
    onValueChange() {},
    label: "Opening time",
  });
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /dtp-time/);
  assert.doesNotMatch(html, /type="time"/);
  const empty = render("TimePicker", {
    value: "",
    disabled: true,
    onValueChange() {},
  });
  assert.match(empty, /Choose time/);
  assert.match(empty, /disabled/);
});

test("page layouts expose fixed sides, proportional tracks and compact vertical rhythm", () => {
  const sidebar = render("Grid", {
    layout: "sidebar",
    sidebarWidth: 280,
    children: "Content",
  });
  assert.match(sidebar, /re-layout-grid-sidebar/);
  assert.match(sidebar, /--layout-sidebar:280px/);
  const split = render("Grid", {
    layout: "split",
    ratio: [2, 3],
    children: "Content",
  });
  assert.match(split, /--layout-leading:2fr/);
  assert.match(split, /--layout-trailing:3fr/);
  assert.match(
    render("Flex", { direction: "column", gap: 4, children: "Rows" }),
    /gap:4px/,
  );
  const tabs = render("Tabs", {
    items: [{ value: "one", label: "One" }],
    value: "one",
    onValueChange: () => {},
  });
  assert.match(tabs, /tabs-fit/);
  assert.match(
    render("Tabs", {
      items: [],
      value: "",
      width: "full",
      onValueChange: () => {},
    }),
    /tabs-full/,
  );
});
test("compact selection rows and preview uploads preserve their actual controls", () => {
  const row = render("Tile", {
    variant: "row",
    title: "Season",
    description: "28 Oct – 10 Nov",
    selected: true,
    onClick: () => {},
    meta: "Live",
  });
  assert.match(row, /re-tile-row/);
  assert.match(row, /aria-pressed="true"/);
  assert.match(row, /Live/);
  assert.doesNotMatch(row, /re-tile-footer/);
  const upload = render("FileDropzone", {
    variant: "compact",
    preview: "/logo.png",
    label: "Main logo",
    onFiles: () => {},
    accept: "image/png",
    multiple: false,
  });
  assert.match(upload, /re-dropzone-compact/);
  assert.match(upload, /src="\/logo.png"/);
  assert.match(upload, /type="file"/);
  const field = render("Field", {
    label: "Search",
    labelHidden: true,
    children: React.createElement("input", { id: "search" }),
  });
  assert.match(field, /for="search" class="re-sr-only"/);
});
test("masonry retains source order and intact item wrappers while flex exposes wrapping alignment", () => {
  const html = render("Masonry", {
    min: 240,
    columns: 3,
    gap: 16,
    children: [
      React.createElement("section", { key: "a" }, "First card"),
      React.createElement("section", { key: "b" }, "Second card"),
    ],
  });
  assert.match(html, /--masonry-min:240px/);
  assert.match(html, /--masonry-columns:3/);
  assert.equal((html.match(/class="re-masonry-item"/g) || []).length, 2);
  assert.ok(html.indexOf("First card") < html.indexOf("Second card"));
  const flex = render("Flex", {
    justify: "between",
    align: "end",
    gap: 8,
    children: "Actions",
  });
  assert.match(flex, /justify-content:space-between/);
  assert.match(flex, /align-items:flex-end/);
  assert.match(flex, /flex-wrap:wrap/);
});

test("editor panels expose named native scroll regions and persistent control slots", () => {
  const html = renderToStaticMarkup(
    React.createElement(
      UI.Workbench,
      { leadingWidth: 240, trailingWidth: 260 },
      React.createElement(
        UI.ScrollArea,
        {
          label: "Object options",
          header: "Pinned title",
          footer: "Pinned action",
        },
        "Scrollable fields",
      ),
    ),
  );
  assert.match(html, /re-workbench/);
  assert.match(html, /--workbench-leading:240px/);
  assert.match(html, /role="region" aria-label="Object options" tabindex="0"/);
  assert.ok(html.indexOf("Pinned title") < html.indexOf("Scrollable fields"));
  assert.ok(html.indexOf("Pinned action") > html.indexOf("Scrollable fields"));
});

test("compact catalogue props preserve selection and hide only optional tile chrome", () => {
  const html = render("Grid", {
    columns: 3,
    min: 120,
    density: "compact",
    children: React.createElement(UI.Tile, {
      title: "Long catalogue title",
      density: "compact",
      imageSize: 32,
      titleLines: 2,
      showFooter: false,
      selected: true,
      onClick: () => {},
    }),
  });
  assert.match(html, /--layout-columns:3/);
  assert.match(html, /--layout-gap:8px/);
  assert.match(html, /--tile-image-size:32px/);
  assert.match(html, /aria-pressed="true"/);
  assert.doesNotMatch(html, /re-tile-footer/);
  assert.match(html, /Long catalogue title/);
});

test("flat tabs and section navigation preserve their distinct navigation semantics", () => {
  const tabs = render("Tabs", {
    variant: "flat",
    items: [{ value: "send", label: "Send", count: 6 }],
    value: "send",
    onValueChange: () => {},
  });
  assert.match(tabs, /tabs-flat/);
  assert.match(tabs, /role="tablist"/);
  const nav = render("SectionNav", {
    items: [{ id: "send", label: "Send", count: 6 }],
    offset: 64,
  });
  assert.match(nav, /href="#send"/);
  assert.match(nav, /aria-current="location"/);
  assert.match(nav, /--section-offset:64px/);
  assert.doesNotMatch(nav, /role="tab"/);
  const split = render("SplitPane", {
    value: 36,
    onValueChange: () => {},
    variant: "plain",
    first: "List",
    second: "Details",
  });
  assert.match(split, /re-split-plain/);
  assert.match(split, /aria-valuenow="36"/);
});

test("comparison keeps a controlled native range and meaningful image alternatives", () => {
  const html = render("ImageCompare", {
    before: { src: "before.svg", alt: "Original route" },
    after: { src: "after.svg", alt: "Revised route" },
    value: 125,
    onValueChange: () => {},
  });
  assert.match(html, /type="range"/);
  assert.match(html, /value="100"/);
  assert.match(html, /aria-valuetext="100% before, 0% after"/);
  assert.match(html, /alt="Original route"/);
  assert.match(html, /alt="Revised route"/);
});
test("tree expansion and selection remain separate and expose hierarchy levels", () => {
  const nodes = [
    {
      id: "root",
      label: "Artwork",
      children: [{ id: "file", label: "Logo.svg" }],
    },
  ];
  const open = render("TreeView", {
    nodes,
    expandedKeys: ["root"],
    onExpandedChange: () => {},
    value: "file",
    onValueChange: () => {},
  });
  assert.match(open, /aria-level="2"/);
  assert.match(open, /aria-selected="true"/);
  assert.match(open, /aria-expanded="true"/);
  const closed = render("TreeView", {
    nodes,
    expandedKeys: [],
    onExpandedChange: () => {},
    value: "file",
    onValueChange: () => {},
  });
  assert.doesNotMatch(closed, /Logo.svg/);
  assert.match(closed, /tabindex="0"/);
});
test("signature strokes remain vector data with explicit undo and clear controls", () => {
  const html = render("SignaturePad", {
    value: [
      [
        { x: 10, y: 20 },
        { x: 30, y: 40 },
      ],
    ],
    onValueChange: () => {},
    label: "Sample mark",
  });
  assert.match(html, /M10 20 L30 40/);
  assert.match(html, /viewBox="0 0 1000 400"/);
  assert.match(html, /Undo stroke/);
  assert.match(html, /Clear/);
  assert.match(html, /pointing device/);
});
test("heatmap dates align to Monday across a year boundary and retain textual values", () => {
  const html = render("ActivityHeatmap", {
    startDate: "2027-01-01",
    weeks: 1,
    values: [{ date: "2026-12-28", value: 8 }],
    value: "2026-12-28",
    onValueChange: () => {},
  });
  assert.match(html, /Monday, December 28, 2026: 8 events/);
  assert.match(html, /aria-pressed="true"/);
  assert.equal((html.match(/type="button"/g) || []).length, 7);
  const invalid = render("ActivityHeatmap", { startDate: "2026-02-30" });
  assert.match(invalid, /role="alert"/);
});

test("consolidated APIs retain defaults without exporting duplicate component names", () => {
  for (const name of [
    "MetricGrid",
    "Stack",
    "AnimatedIcon",
    "animatedIconNames",
    "MultiSelect",
    "ActivityFeed",
    "FeedbackProvider",
    "Chips",
  ])
    assert.equal(name in UI, false, name);
  assert.match(
    render("Grid", { preset: "metrics", children: "Metrics" }),
    /--layout-min:170px/,
  );
  const column = render("Flex", { direction: "column", children: "Rows" });
  assert.match(column, /align-items:stretch/);
  assert.match(column, /flex-wrap:nowrap/);
  const feed = render("Timeline", {
    variant: "feed",
    items: [],
    emptyText: "Nothing recorded",
  });
  assert.match(feed, /Recent activity/);
  assert.match(feed, /Nothing recorded/);
});
test("canonical toggle group preserves required chips, optional toggles and multiple selection", () => {
  let result;
  const make = (props) =>
    UI.ToggleGroup({
      items: [
        { value: "a", label: "A" },
        { value: "b", label: "B" },
      ],
      value: "a",
      onValueChange: (value) => (result = value),
      ...props,
    });
  make({ variant: "chips" }).props.children[0].props.onClick();
  assert.equal(result, "a");
  make({}).props.children[0].props.onClick();
  assert.equal(result, null);
  make({ multiple: true, value: ["a"] }).props.children[1].props.onClick();
  assert.deepEqual(result, ["a", "b"]);
  make({ multiple: true, value: ["a", "b"] }).props.children[0].props.onClick();
  assert.deepEqual(result, ["b"]);
});
test("shortcut normalization and conflict checks use semantic modifier order", async () => {
  const { normalizeShortcut, shortcutFromEvent, shortcutIssue } =
    await import("../react/review-model.js");
  assert.deepEqual(normalizeShortcut(["K", "Shift", "Ctrl", "Control"]), [
    "Control",
    "Shift",
    "K",
  ]);
  assert.deepEqual(
    shortcutFromEvent({ ctrlKey: true, shiftKey: true, key: "k" }),
    ["Control", "Shift", "K"],
  );
  assert.equal(
    shortcutIssue(["K", "Ctrl"], [{ keys: ["Control", "K"], label: "Search" }])
      .kind,
    "conflict",
  );
  assert.equal(shortcutIssue(["Meta", "W"]).kind, "reserved");
  assert.equal(shortcutIssue(["Control", "Alt", "K"]), null);
});
test("line diff retains both revisions across replacements, empty text and line endings", async () => {
  const { lineDiff, foldDiff, splitDiff } =
    await import("../react/review-model.js");
  const samples = [
    ["", ""],
    ["", "one\ntwo"],
    ["one\ntwo", ""],
    ["a\nb\nc", "a\nx\nc"],
    ["a\r\nb\r\n", "a\nb\n"],
    ["a\na\nb", "a\nb\na"],
    ["x\n", "x"],
  ];
  for (let i = 0; i < 80; i++) {
    const old = Array.from({ length: i % 13 }, (_, j) =>
        String((j * 7 + i) % 5),
      ).join("\n"),
      next = Array.from({ length: (i * 3) % 17 }, (_, j) =>
        String((j * 11 + i) % 7),
      ).join("\n");
    samples.push([old, next]);
  }
  for (const [old, next] of samples) {
    const diff = lineDiff(old, next);
    assert.equal(
      diff.rows
        .filter((x) => x.type !== "add")
        .map((x) => x.text)
        .join("\n"),
      old.replace(/\r\n?/g, "\n"),
    );
    assert.equal(
      diff.rows
        .filter((x) => x.type !== "remove")
        .map((x) => x.text)
        .join("\n"),
      next.replace(/\r\n?/g, "\n"),
    );
  }
  const diff = lineDiff("a\nb\nc", "a\nx\nc");
  assert.equal(diff.added, 1);
  assert.equal(diff.removed, 1);
  const coarse = lineDiff("x\ny", "a\nb", { cellBudget: 1 });
  assert.equal(coarse.coarse, true);
  assert.equal(coarse.rows.length, 4);
  const rows = lineDiff(
    Array.from({ length: 30 }, (_, i) => String(i)).join("\n"),
    Array.from({ length: 30 }, (_, i) =>
      i === 15 ? "changed" : String(i),
    ).join("\n"),
  ).rows;
  const folded = foldDiff(rows, 2);
  assert.ok(folded.some((x) => x.type === "fold"));
  assert.equal(
    foldDiff(
      rows,
      2,
      folded.filter((x) => x.type === "fold").map((x) => x.id),
    ).length,
    rows.length,
  );
  const pairs = splitDiff(diff.rows);
  assert.equal(pairs.length, 3);
  assert.equal(pairs[1].left.text, "b");
  assert.equal(pairs[1].right.text, "x");
});
test("diff rendering escapes code and exposes split, unified and unchanged context controls", () => {
  const props = {
    before: "<script>old</script>\nkeep",
    after: "<script>new</script>\nkeep",
    collapseUnchanged: false,
  };
  const split = render("TextDiffViewer", props);
  assert.match(split, /&lt;script&gt;new&lt;\/script&gt;/);
  assert.doesNotMatch(split, /<script>/);
  assert.match(split, /Previous text/);
  assert.match(split, /Revision text/);
  const unified = render("TextDiffViewer", { ...props, view: "unified" });
  assert.match(unified, /Unified changes/);
  assert.match(unified, /1 added/);
  assert.match(unified, /1 removed/);
});

test('color parsing preserves formats, alpha and HSV round trips without accepting malformed input', async () => {
  const {parseColor,colorHex,formatColor,rgbToHsv,hsvToRgb}=await import('../react/color-model.js');
  for(const [input,output] of [['#abc','#aabbcc'],['#abcd','#aabbccdd'],['rgb(255, 0, 128)','#ff0080'],['rgba(255, 0, 0, 0.5)','#ff000080'],['hsl(120, 100%, 50%)','#00ff00'],['hsla(-120, 100%, 50%, 0)','#0000ff00']])assert.equal(colorHex(parseColor(input),output.length===9),output);
  for(const bad of ['red','#12','#12345','#gggggg','rgb(256, 0, 0)','rgba(1,2,3,2)','hsl(20, 101%, 50%)','rgb(.,2,3)'])assert.equal(parseColor(bad),null,bad);
  for(let r=0;r<=255;r+=51)for(let g=0;g<=255;g+=51)for(let b=0;b<=255;b+=51){const hsv=rgbToHsv({r,g,b});assert.deepEqual(hsvToRgb(hsv.h,hsv.s,hsv.v),{r,g,b});}
  assert.equal(formatColor(parseColor('#ff000080'),'rgb',true),'rgba(255, 0, 0, 0.502)');
  assert.equal(formatColor(parseColor('#00ff00'),'hsl'),'hsl(120, 100%, 50%)');
});
test('input group preserves native form attributes and Field validation on its input',()=>{
  const html=render('Field',{id:'price',label:'Amount',error:'Required',children:React.createElement(UI.InputGroup,{prefix:'SRD',suffix:'each',name:'price',type:'number',required:true,defaultValue:'2',disabled:true})});
  assert.match(html,/<label for="price"/);
  assert.match(html,/<fieldset disabled/);
  assert.match(html,/<input(?=[^>]*name="price")(?=[^>]*type="number")(?=[^>]*required)/);
  assert.match(html,/<input[^>]*id="price"[^>]*aria-describedby="price-hint"[^>]*aria-invalid="true"/);
});
test('color picker and button groups expose reusable controlled semantics',()=>{
  const html=render('ColorPicker',{value:'#007aff80',onValueChange:()=>{},label:'Brand',variant:'inline',alpha:true,disabled:true,swatches:[{value:'#007aff80',label:'Blue'},'invalid']});
  assert.match(html,/<fieldset[^>]*disabled/);
  assert.match(html,/aria-label="Brand opacity"/);
  assert.match(html,/aria-label="Blue" aria-pressed="true"/);
  assert.doesNotMatch(html,/aria-label="invalid"/);
  assert.match(html,/value="#007aff80"/);
  const group=render('ButtonGroup',{label:'Save actions',attached:true,orientation:'vertical',children:React.createElement(UI.Button,{disabled:true,children:'Save'})});
  assert.match(group,/role="group" aria-label="Save actions"/);
  assert.match(group,/data-orientation="vertical" data-attached="true"/);
  assert.match(group,/<button[^>]*disabled/);
});

test('section headings keep their semantic hierarchy and section navigation marks the selected anchor',()=>{
 const title=render('CardHeader',{title:'Related actions',headingLevel:3});
 assert.match(title,/<h3>Related actions<\/h3>/);
 const fallback=render('CardHeader',{title:'Default'});
 assert.match(fallback,/<h2>Default<\/h2>/);
 const nav=render('SectionNav',{items:[{id:'send',label:'Send',count:6},{id:'share',label:'Share',count:6}],value:'share'});
 assert.match(nav,/<a href="#share" aria-current="location"/);
 assert.doesNotMatch(nav,/<a href="#send" aria-current/);
});

test('every core catalog entry has a render route, including the Card regression', async()=>{
 const fs=await import('node:fs');
 const source=fs.readFileSync(new URL('../site/main.jsx',import.meta.url),'utf8');
 const core=source.slice(source.indexOf('const components = ['),source.indexOf('function Demo'));
 const ids=[...core.matchAll(/^    id: "([^"]+)"/gm)].map(match=>match[1]);
 const demo=source.slice(source.indexOf('function Demo'),source.indexOf('function Code'));
 for(const id of ids)assert.ok(demo.includes(`case "${id}":`),`Missing core preview: ${id}`);
 assert.ok(demo.includes('return <CardsDemo />;'));
});
test('split re-grabs use rendered geometry while preserving both drag directions', async()=>{
 const {renderedSplit}=await import('../react/split-motion.js');
 assert.deepEqual(renderedSplit({left:100,width:1016},{left:500,width:16}),{value:40,width:1000});
 const start=renderedSplit({left:100,width:1016},{left:500,width:16});
 assert.equal(start.value+(-100/start.width)*100,30);
 assert.equal(start.value+(100/start.width)*100,50);
 assert.equal(renderedSplit({left:0,width:16},{left:0,width:16}).width,1);
});
test('stepper value motion is directional, cancellable, and absent for typing or reduced motion', async()=>{
 const fs=await import('node:fs');
 const {build}=await import('vite');
 const output=await build({configFile:false,logLevel:'silent',build:{ssr:'react/hooks/value-motion.js',write:false,rollupOptions:{external:['react']}}});
 const js=output.output.find(file=>file.type==='chunk').code;
 const temp=new URL('../.test-build/value-motion.mjs',import.meta.url);fs.writeFileSync(temp,js);
 const {animateValue}=await import(temp.href);
 const before=globalThis.matchMedia;
 let reduced=false,cancelled=false,calls=[];
 globalThis.matchMedia=()=>({matches:reduced});
 const node={ownerDocument:{activeElement:null},animate:(frames,options)=>{calls.push({frames,options});return{cancel:()=>cancelled=true};}};
 try{
  const up=animateValue(node,1,2);assert.match(calls[0].frames[0].transform,/6px/);assert.equal(calls[0].options.duration,240);up.cancel();assert.equal(cancelled,true);
  animateValue(node,2,1);assert.match(calls[1].frames[0].transform,/-6px/);
  assert.equal(animateValue(node,1,1),null);
  node.ownerDocument.activeElement=node;assert.equal(animateValue(node,1,2),null);
  node.ownerDocument.activeElement=null;reduced=true;assert.equal(animateValue(node,1,2),null);
  assert.equal(calls.length,2);
 }finally{if(before===undefined)delete globalThis.matchMedia;else globalThis.matchMedia=before;}
});

test('drawer and sheet exits stay opaque and travel a full edge distance',async()=>{
 const {modalExitMotion}=await import('../react/send/hooks/modal-motion.js');
 for(const className of ['re-drawer re-drawer-left','re-drawer re-drawer-right','re-bottom-sheet']){
  const exit=modalExitMotion(className);assert.equal(exit.opacity,1);assert.equal(exit.duration,300);assert.match(exit.offset,/100%/);
  const reduced=modalExitMotion(className,true);assert.equal(reduced.opacity,1);assert.equal(reduced.duration,0);assert.equal(reduced.offset,'');
 }
 assert.match(modalExitMotion('re-drawer re-drawer-left').offset,/-100% - 24px/);
 assert.match(modalExitMotion('re-drawer re-drawer-right').offset,/100% \+ 24px/);
 assert.match(modalExitMotion('re-bottom-sheet').offset,/translateY/);
 assert.equal(modalExitMotion('dialog').opacity,0);
});

test('Header and AppShell expose numeric and caller-owned navigation badges',()=>{
 const header=render('Header',{brand:{name:'Studio'},items:[{value:'files',label:'Files',href:'/files',count:0},{value:'activity',label:'Activity',href:'/activity',badge:React.createElement('strong',{},'New')}],activeValue:'files'});
 assert.match(header,/class="nav-badge">0/);assert.match(header,/nav-badge-slot/);assert.match(header,/<strong>New<\/strong>/);
 const shell=render('AppShell',{brand:'Studio',items:[{value:'room',label:'Room',count:3,badge:React.createElement('span',{},'Live')}],value:'room',onValueChange:()=>{}});
 assert.match(shell,/nav-badge-slot/);assert.match(shell,/>Live</);
});
test('conversation grouping respects authors, chronology, system entries and explicit breaks',async()=>{
 const {groupMessages}=await import('../react/conversation-model.js');
 const base={id:'a',author:'Alex',authorId:'alex',text:'One',time:'10:00'};
 const cases=[base,{...base,id:'b',time:'10:02'},{...base,id:'c',time:'10:08'},{...base,id:'d',authorId:'sam',time:'10:09'},{...base,id:'e',type:'system',time:'10:10'},{...base,id:'f',time:'10:11'},{...base,id:'g',time:'10:12',groupWithPrevious:false},{...base,id:'h',time:'10:13',own:true}];
 assert.deepEqual(groupMessages(cases).map(x=>x.grouped),[false,true,false,false,false,false,false,false]);
 assert.equal(groupMessages([base,{...base,id:'b',time:'unknown',groupWithPrevious:true}])[1].grouped,true);
 assert.equal(groupMessages([{...base,dateTime:'2026-11-03T10:00:00Z'},{...base,id:'b',dateTime:'2026-11-03T10:01:00Z'}])[1].grouped,true);
 assert.equal(groupMessages([base,{...base,id:'b',time:'09:59'}])[1].grouped,false);
});
test('channel templates keep avatars, grouped text and custom content in one inbox API',()=>{
 const messages=[{id:'a',author:'Alex',authorId:'alex',text:'One',time:'10:00'},{id:'b',author:'Alex',authorId:'alex',text:'Two',time:'10:01'}];
 const thread={id:'room',kind:'channel',group:'Channels',name:'general',participants:[{id:'alex',name:'Alex',avatar:'/alex.png'}],messages};
 const html=render('SupportInbox',{threads:[thread],value:'room',onValueChange:()=>{},template:'channel',onReply:()=>{},renderMessage:message=>React.createElement('em',{},message.text),renderComposer:context=>React.createElement('button',{type:'button'},`Send to ${context.thread.name}`)});
 assert.match(html,/data-template="channel"/);assert.match(html,/data-grouped="true"/);assert.match(html,/src="\/alex.png"/);assert.match(html,/<em>Two<\/em>/);assert.match(html,/Send to general/);assert.match(html,/Channels/);
 const embedded=render('SupportInbox',{threads:[thread],value:'room',onValueChange:()=>{},showSidebar:false,showAvatars:false});assert.doesNotMatch(embedded,/<aside>/);assert.doesNotMatch(embedded,/re-support-message-avatar/);
});

test("image previews stay lazy and retain accessible open controls", () => {
  let calls = 0;
  const html = render("ImageThumbnail", {src:"/private.jpg",load:async () => {calls++;return "/private.jpg";},label:"Open receipt #12"});
  assert.match(html, /aria-label="Open receipt #12"/);
  assert.doesNotMatch(html, /src="\/private.jpg"/);
  assert.equal(calls,0);
  assert.equal(render("ImageGallery", {items:[],open:false,onOpenChange(){},index:0,onIndexChange(){}}), "");
});
