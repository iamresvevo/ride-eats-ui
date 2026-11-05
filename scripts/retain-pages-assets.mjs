import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const safeAsset = (name) =>
  typeof name === "string" &&
  /^[a-zA-Z0-9_.-]+$/.test(name) &&
  name !== "." &&
  name !== "..";
const assetsIn = (site) =>
  fs.existsSync(path.join(site, "assets"))
    ? fs
        .readdirSync(path.join(site, "assets"))
        .filter(
          (name) =>
            safeAsset(name) &&
            fs.lstatSync(path.join(site, "assets", name)).isFile(),
        )
    : [];

export function retainAssets(destination, previous, current, limit = 5) {
  const currentFiles = assetsIn(destination);
  if (!currentFiles.length)
    throw Error("Build assets before preserving deployment history");
  const sources = new Map(
    currentFiles.map((name) => [name, path.join(destination, "assets", name)]),
  );
  const groups = [{ ...current, files: currentFiles }];
  for (const prior of previous) {
    const files = assetsIn(prior.site);
    for (const name of files)
      if (!sources.has(name))
        sources.set(name, path.join(prior.site, "assets", name));
    const manifest = path.join(prior.site, "asset-history.json");
    let history;
    try {
      history = JSON.parse(fs.readFileSync(manifest, "utf8")).builds;
    } catch {}
    if (Array.isArray(history)) groups.push(...history);
    else groups.push({ id: prior.id, createdAt: prior.createdAt, files });
  }
  const unique = new Map();
  for (const group of groups)
    if (
      group &&
      typeof group.id === "string" &&
      Array.isArray(group.files) &&
      !unique.has(group.id)
    )
      unique.set(group.id, group);
  const builds = [
    unique.get(current.id),
    ...Array.from(unique.values())
      .filter((g) => g.id !== current.id)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
  ]
    .filter(Boolean)
    .slice(0, limit)
    .map((group) => ({
      ...group,
      files: [...new Set(group.files)].filter(
        (name) => safeAsset(name) && sources.has(name),
      ),
    }));
  let copied = 0;
  for (const name of new Set(builds.flatMap((group) => group.files))) {
    const target = path.join(destination, "assets", name);
    if (!fs.existsSync(target)) {
      fs.copyFileSync(sources.get(name), target);
      copied++;
    }
  }
  fs.writeFileSync(
    path.join(destination, "asset-history.json"),
    JSON.stringify({ builds }, null, 2) + "\n",
  );
  return { copied, builds: builds.length };
}

function gh(args) {
  const result = spawnSync("gh", args, {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
  if (result.status !== 0)
    throw Error(result.stderr || "GitHub artifact request failed");
  return result.stdout;
}
async function main() {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ui-pages-assets-"));
  const previous = [];
  try {
    const runs = JSON.parse(
      gh([
        "run",
        "list",
        "--workflow",
        "pages.yml",
        "--branch",
        "main",
        "--status",
        "success",
        "--limit",
        "4",
        "--json",
        "databaseId,headSha,createdAt",
      ]),
    );
    for (const run of runs) {
      const directory = path.join(temporary, String(run.databaseId));
      try {
        gh([
          "run",
          "download",
          String(run.databaseId),
          "--name",
          "github-pages",
          "--dir",
          directory,
        ]);
      } catch (error) {
        // Pages artifacts expire independently of successful workflow history.
        // Missing history must not prevent publishing the current documentation.
        if (!/no valid artifacts found to download/i.test(error.message))
          throw error;
        console.warn(
          `Previous Pages artifact ${run.databaseId} has expired; skipping it.`,
        );
        continue;
      }
      const site = path.join(directory, "site");
      fs.mkdirSync(site);
      const result = spawnSync(
        "tar",
        ["-xf", path.join(directory, "artifact.tar"), "-C", site],
        { encoding: "utf8" },
      );
      if (result.status !== 0)
        throw Error(result.stderr || "Unable to extract previous deployment");
      previous.push({ site, id: run.headSha, createdAt: run.createdAt });
    }
    const result = retainAssets(path.resolve("dist"), previous, {
      id: process.env.GITHUB_SHA || "local",
      createdAt: new Date().toISOString(),
    });
    console.log(
      `Preserved ${result.copied} hashed assets across ${result.builds} builds.`,
    );
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
)
  await main();
