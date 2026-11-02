import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import jpeg from "jpeg-js";
export function comparePixels(
  before,
  after,
  { channelTolerance = 20, maxChangedRatio = 0.004 } = {},
) {
  if (before.width !== after.width || before.height !== after.height)
    return { pass: false, reason: "Image dimensions changed", changedRatio: 1 };
  let changed = 0;
  const total = before.width * before.height;
  for (let i = 0; i < before.data.length; i += 4)
    if (
      Math.max(
        ...[0, 1, 2].map((channel) =>
          Math.abs(before.data[i + channel] - after.data[i + channel]),
        ),
      ) > channelTolerance
    )
      changed++;
  const changedRatio = changed / total;
  return {
    pass: changedRatio <= maxChangedRatio,
    changedPixels: changed,
    totalPixels: total,
    changedRatio,
  };
}
async function run() {
  const [baseline, candidate] = process.argv.slice(2);
  if (!baseline || !candidate)
    throw Error(
      "Usage: npm run visual:compare -- <baseline-directory> <candidate-directory>",
    );
  const files = (await readdir(baseline)).filter((file) =>
    file.endsWith(".jpg"),
  );
  if (!files.length) throw Error("No JPEG baselines found.");
  let failed = false;
  for (const file of files) {
    let result;
    try {
      const before = jpeg.decode(await readFile(resolve(baseline, file)), {
          useTArray: true,
        }),
        after = jpeg.decode(await readFile(resolve(candidate, file)), {
          useTArray: true,
        });
      result = comparePixels(before, after);
    } catch (error) {
      result = { pass: false, reason: error.message };
    }
    console.log(JSON.stringify({ file, ...result }));
    if (!result.pass) failed = true;
  }
  if (failed) process.exitCode = 1;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  run().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
