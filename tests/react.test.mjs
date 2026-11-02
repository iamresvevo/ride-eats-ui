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
  assert.doesNotMatch(html, />Save</);
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
  assert.equal(count, iconNames.length);
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
        UI.animatedIconNames.map((name) =>
          React.createElement(UI.AnimatedIcon, {
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
  for (const name of UI.animatedIconNames) {
    const html = render("AnimatedIcon", { name, playing: true });
    assert.match(html, /<svg/);
    assert.match(html, /<animate(?:Transform)? /);
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
  assert.match(render("AnimatedIcon", { name: "heart" }), /attributeName="d"/);
  assert.match(
    render("AnimatedIcon", { name: "check" }),
    /attributeName="stroke-dashoffset"/,
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
    ["Steps", { items: [{ value: "a", label: "Details" }], value: "a" }],
    ["PinInput", { value: "123", onValueChange: noop }],
    [
      "ToggleGroup",
      {
        items: [{ value: "a", label: "Bold" }],
        value: ["a"],
        multiple: true,
        onValueChange: noop,
      },
    ],
    ["Rating", { value: 4, onValueChange: noop }],
    ["ScrollArea", { header: "Search", children: "Rows" }],
    ["Separator", { label: "or" }],
  ];
  for (const [name, props] of cases)
    assert.ok(render(name, props).length > 0, name);
  assert.match(
    render("PinInput", { value: "123", onValueChange: noop }),
    /autoComplete="one-time-code"/i,
  );
  assert.match(
    render("Steps", { items: [{ value: "a", label: "Details" }], value: "a" }),
    /aria-current="step"/,
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
  assert.match(source, /values="0;0;.55;0;0"/);
  assert.match(source, /dur="2.4s"/);
  assert.match(source, /strokeOpacity:\s*0?\.24/);
  assert.doesNotMatch(
    source,
    /breathePath|attributeName="r"|attributeName="ry"/,
  );
  assert.doesNotMatch(source, /<svg|<div|animation:/);
  const names = new Set(UI.animatedIconNames);
  for (const name of UI.iconNames) assert.ok(names.has(name), name);
  let count = 0;
  for (const loader of Object.values(loaders)) {
    const { default: icons } = await loader();
    for (const [name, nodes] of Object.entries(icons)) {
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
  assert.equal(count, 2015);
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
      "MultiSelect",
      {
        options: [{ value: "a", label: "Alex" }],
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
    ["ActivityFeed", { items: [] }],
    ["SupportInbox", { threads: [], value: "", onValueChange: noop }],
  ])
    assert.ok(render(name, props).length > 0 || name === "BottomSheet", name);
  assert.match(
    render("Combobox", { options: [], value: "", onValueChange: noop }),
    /role="combobox"/,
  );
  assert.match(
    render("MultiSelect", {
      options: [{ value: "a", label: "Alex" }],
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
  for (const name of ["Autocomplete", "Collapsible", "Stat", "Modal"])
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

test('implementation workbench emits complete parsable controlled React examples', async () => {
  const { implementationCode } = await import('../site/implementation-code.js');
  const { transformWithEsbuild } = await import('vite');
  const examples = [
    ['Textarea', {label:'Notes'}, {value:'', onChange(){}}],
    ['Combobox', {label:'Assignee'}, {options:[{value:'a',label:'Alex'}],value:'a',onValueChange(){}}],
    ['MultiSelect', {label:'People'}, {options:[{value:'a',label:'Alex'}],value:['a'],onValueChange(){}}],
    ['TimePicker', {}, {value:'09:00',onValueChange(){}}],
    ['DateRangePicker', {}, {value:{start:'',end:''},onValueChange(){}}],
    ['Rating', {max:5}, {value:3,onValueChange(){}}],
    ['RangeSlider', {min:0,max:100}, {value:[20,80],onValueChange(){}}],
    ['SplitPane', {}, {value:40,first:'Navigation',second:'Content',onValueChange(){}}],
    ['DataGrid', {label:'Records'}, {rows:[{id:'1',name:'Alex'}],columns:[{key:'name',label:'Name'}]}],
    ['AppShell', {brand:'Studio'}, {items:[{value:'home',label:'Home'}],value:'home',onValueChange(){}}],
  ];
  for (const [component,props,controlled] of examples) {
    const source=implementationCode(component,props,controlled);
    await transformWithEsbuild(source,'example.jsx',{loader:'jsx'});
    assert.match(source,/export default function Example/);
    if ('value' in controlled) { assert.match(source,/useState\(/); assert.match(source,component==='Textarea'?/onChange=/:/onValueChange=/); }
    for(const key of ['options','rows','columns','items']) if(key in controlled) assert.ok(source.includes(`const ${key} =`));
  }
});
