import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
const root = "node_modules/lucide-static/";
const nodes = JSON.parse(readFileSync(root + "icon-nodes.json", "utf8"));
// Lucide ships compatibility SVG names that are absent from icon-nodes.json (e.g. bold).
// Vendor those local, licensed paths as well; never silently render a question mark.
const canonicalCount = Object.keys(nodes).length;
const aliases = [];
for (const file of readdirSync(root + "icons").filter(file => file.endsWith(".svg"))) {
  const name = file.slice(0, -4);
  if (nodes[name]) continue;
  const svg = readFileSync(root + "icons/" + file, "utf8");
  const shapes = [...svg.matchAll(/<(path|circle|rect|line|polyline|polygon|ellipse)\b([^>]*)\/?>/g)].map(([,tag,source]) => {
    const attributes = {};
    for (const [,key,value] of source.matchAll(/([\w-]+)="([^"]*)"/g)) {
      if (!/^(d|points|cx|cy|r|rx|ry|x|y|x1|x2|y1|y2|width|height|fill|fill-rule|clip-rule|stroke-width|stroke-linecap|stroke-linejoin)$/.test(key)) throw Error("Unsupported SVG attribute " + name + ":" + key);
      attributes[key.replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase())] = value;
    }
    return [tag,attributes];
  });
  if (!shapes.length) throw Error("Missing icon geometry: " + name);
  nodes[name] = shapes;
  aliases.push(name);
}
const tags = JSON.parse(readFileSync(root + "tags.json", "utf8"));
const pkg = JSON.parse(readFileSync(root + "package.json", "utf8"));
const purposeAliases = {
  headset: ["support", "helpdesk", "customer service", "contact center"],
  "life-buoy": ["support", "help"],
  "layout-dashboard": ["internal", "platform", "admin", "dashboard"],
  "credit-card": ["payments", "billing", "finance"],
  users: ["team", "staff", "members"],
  "shield-check": ["security", "permissions", "approval"],
  workflow: ["automation", "process", "internal"],
};
for (const [name, values] of Object.entries(purposeAliases))
  tags[name] = [...new Set([...(tags[name] || []), ...values])];

const groups = {};
for (const [name, data] of Object.entries(nodes)) {
  const key = name[0];
  (groups[key] ??= {})[name] = data;
}
mkdirSync("react/icons/chunks", { recursive: true });
for (const [key, data] of Object.entries(groups))
  writeFileSync(
    `react/icons/chunks/${key}.js`,
    `// Lucide ${pkg.version}, ISC. See ../LICENSE.lucide.\nexport default ${JSON.stringify(data)};\n`,
  );
writeFileSync(
  "react/icons/loaders.js",
  `export const loaders={${Object.keys(groups)
    .map(
      (key) =>
        JSON.stringify(key) +
        ":()=>import(" +
        JSON.stringify("./chunks/" + key + ".js") +
        ")",
    )
    .join(",")}};\n`,
);
writeFileSync(
  "react/icons/names.js",
  `export const iconNames=${JSON.stringify(Object.keys(nodes).sort())};\n`,
);
writeFileSync(
  "react/icons/search.js",
  `export const iconTags=${JSON.stringify(tags)};\n`,
);
copyFileSync(root + "LICENSE", "react/icons/LICENSE.lucide");
writeFileSync(
  "react/icons/NOTICE.md",
  `# Icon catalog\n\n${canonicalCount} canonical Lucide glyphs and ${aliases.length} compatibility names vendored from lucide-static ${pkg.version}, ISC. The included LICENSE.lucide preserves all upstream copyright and Feather-derived icon notices. Existing Send glyphs remain in react/send/Icon.jsx. These icons are third-party artwork behind Ride Eats UI's own component API.\n\nRegenerate with npm run icons:generate. Letter chunks load on demand; names and search tags are separate exports.\n`,
);
console.log(
  `Generated ${Object.keys(nodes).length} icons in ${Object.keys(groups).length} lazy chunks.`,
);
