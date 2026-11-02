import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
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

test("animated icons contain native SVG motion and no animated view wrapper", () => {
  for (const name of UI.animatedIconNames) {
    const html = render("AnimatedIcon", { name, size: 28, playing: true });
    assert.match(html, /<svg/);
    assert.match(html, /<animate(?:Transform)? /);
    assert.doesNotMatch(html, /<div/);
    assert.doesNotMatch(html, /animation:/);
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
    [
      "Collapsible",
      {
        open: false,
        onOpenChange: noop,
        title: "Details",
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
  for (const page of [...collectionPages, ...motionPages])
    for (const raw of page.imports.split(",")) {
      const name = raw.trim();
      assert.match(name, /^[A-Za-z_$][\w$]*$/, page.id);
      assert.ok(name in UI, `${page.id}: missing ${name}`);
    }
});
