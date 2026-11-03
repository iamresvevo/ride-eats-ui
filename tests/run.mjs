import {build} from "vite";
import {spawnSync} from "node:child_process";
import {rmSync} from "node:fs";
try {
  await build({
    configFile: false,
    logLevel: "error",
    build: {
      ssr: "react/index.jsx",
      outDir: ".test-build",
      emptyOutDir: true,
      rollupOptions: { external: ["react", "react-dom"] },
    },
  });
  const result = spawnSync(
    process.execPath,
    ["--test", "tests/react.test.mjs"],
    { stdio: "inherit" },
  );
  process.exitCode = result.status || 0;
} finally {
  rmSync(".test-build", { recursive: true, force: true });
}
