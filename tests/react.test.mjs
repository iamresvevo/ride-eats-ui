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
