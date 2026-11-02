import { sourceForPage } from "../site/component-source.js";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import postcss from "postcss";
import { iconNames } from "../react/icons/names.js";
import { collectionPages } from "../site/collection-data.js";
import { motionPages } from "../site/motion-data.js";
import { platformPages } from "../site/platform-data.js";
const errors = [];
const files = fs
  .readdirSync("css")
  .filter((f) => f.endsWith(".css"))
  .map((f) => "css/" + f)
  .concat("site/style.css");
const foundation = new Set();
postcss.parse(fs.readFileSync("css/tokens.css", "utf8")).walkDecls((d) => {
  if (d.prop.startsWith("--")) foundation.add(d.prop);
});
for (const file of files) {
  const ast = postcss.parse(fs.readFileSync(file, "utf8"), { from: file });
  ast.walkDecls((d) => {
    const at = `${file}:${d.source.start.line}`;
    if (file !== "css/tokens.css" && foundation.has(d.prop))
      errors.push(at + " foundation token outside tokens.css: " + d.prop);
    if (
      file !== "css/tokens.css" &&
      d.prop === "border-radius" &&
      /\d(?:px|%|em)/.test(d.value)
    )
      errors.push(at + " local radius instead of shape token");
    if (
      /--(?:brand|good|wait|bad)-soft$/.test(d.prop) &&
      d.value !== "var(--raised)"
    )
      errors.push(at + " tinted semantic surface");
    if (file !== "css/tokens.css" && d.value.includes("cubic-bezier("))
      errors.push(at + " local motion curve");
    if (d.prop === "background" || d.prop === "background-color") {
      for (const color of d.value.matchAll(/rgba?\(([^)]+)\)/g)) {
        const values = color[1]
          .split(/[,\s/]+/)
          .filter(Boolean)
          .slice(0, 3)
          .map(Number);
        if (values.some((v) => v !== values[0]))
          errors.push(at + " colored translucent fill");
      }
      if (/color-mix\([^)]*var\(--brand/.test(d.value))
        errors.push(at + " locally mixed accent background");
    }
  });
}
const roots = ["site", "react"];
const sourceFiles = [];
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory() && !p.includes("/icons/chunks")) walk(p);
    else if (item.isFile() && /\.(jsx|js)$/.test(p)) sourceFiles.push(p);
  }
}
roots.forEach(walk);
const iconSource = fs.readFileSync("react/send/Icon.jsx", "utf8");
const builtins = [
  ...iconSource
    .slice(
      iconSource.indexOf("const PATHS"),
      iconSource.indexOf("export default"),
    )
    .matchAll(/^\s+(?:"([^"]+)"|([a-zA-Z][\w-]*)):\s*/gm),
].map((m) => m[1] || m[2]);
const known = new Set([...iconNames, ...builtins]);
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, "utf8");
  const registered = new Set(known);
  for (const match of source.matchAll(/icons=\{\{\s*["']?([a-z][a-z0-9-]*)["']?\s*:/g)) registered.add(match[1]);
  if (/easing:\s*["']cubic-bezier/.test(source))
    errors.push(file + " local JavaScript easing curve");
  for (const pattern of [
    /\bicon:\s*["']([a-z][a-z0-9-]*)["']/g,
    /<(?:UI\.)?Icon\s+name=["']([a-z][a-z0-9-]*)["']/g,
  ])
    for (const m of source.matchAll(pattern))
      if (!registered.has(m[1]))
        errors.push(file + " unknown literal icon: " + m[1]);
}
const main = fs.readFileSync("site/main.jsx", "utf8");
const primary = [
  ...main.matchAll(
    /id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*group:\s*"([^"]+)"/g,
  ),
].map((m) => ({ id: m[1], name: m[2], group: m[3] }));
const pages = [
  ...primary,
  ...collectionPages,
  ...motionPages,
  ...platformPages,
].map(({ id, name, group, imports }) => ({ id, name, group, imports }));
for (const page of pages) {
  page.source = sourceForPage(page.id);
  if (!fs.existsSync(page.source))
    errors.push("Missing implementation: " + page.source);
}
const ids = pages.map((p) => p.id);
if (ids.length !== new Set(ids).size)
  errors.push("duplicate component documentation IDs");
const api = [
  ...fs
    .readFileSync("react/index.d.ts", "utf8")
    .matchAll(/export (?:declare )?(?:function|const) (\w+)/g),
]
  .map((m) => m[1])
  .sort();
const contract = JSON.parse(fs.readFileSync("design/contract.json", "utf8"));
for (const name of api)
  if (!Object.values(contract.families).some((f) => f.apis.includes(name)))
    errors.push("Public API missing audit family: " + name);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
const report = {
  version: JSON.parse(fs.readFileSync("package.json")).version,
  cssFiles: files.length,
  publicApis: api,
  documentationPages: pages,
  sourceEvidence: contract.sources,
  checks: [
    "one foundation owner",
    "tokenized corners",
    "neutral semantic supporting surfaces",
    "shared CSS easing",
    "literal demo icons resolve",
    "all public APIs have a design family",
    "unique component page IDs",
  ],
};
if (process.argv.includes("--write"))
  fs.writeFileSync(
    "docs/design-audit.json",
    JSON.stringify(report, null, 2) + "\n",
  );
console.log(
  `Design contract passed: ${api.length} public APIs, ${pages.length} pages, ${files.length} stylesheets.`,
);
