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
