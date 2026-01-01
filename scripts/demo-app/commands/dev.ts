import { spawn } from "child_process";
import { tryReadPackageJson } from "../setup/package-json.js";
import {
  logInfo,
  notifyOfMissingDemoAppConfiguration,
  runDemoAppWithCommand,
} from "../utils.js";

logInfo("Running demo app (with hot-reloading)...");

const packageJson = await tryReadPackageJson();

const devScriptName = packageJson?.corequeryDemoApp?.scripts?.dev;

if (devScriptName != null) {
  // Three aspects of hot-reloading:
  //
  // - Start the Typescript compiler in watch mode to hot-reload the code built
  //   in the `server/dist` folder.
  //
  // - `COREQUERY_HOT_RELOAD=true` to tell the server to use the vite dev
  //   middleware and therefore have hot-reloading for the frontend.
  //
  // - Use the demo app's "dev script" (probably configured to `npm run dev` or
  //   similar), to tell the consumer package to hot-reload when it notices
  //   changes to its code or the code within its inner
  //   `node_modules/corequery/server/dist` folder.

  const tsc = spawn("npx", ["tsc", "-p", "server/tsconfig.json", "--watch"]);

  console.log("");
  console.log("Waiting for initial server build to complete...");

  // Wait until we see "Watching for file changes." in the output from tsc.
  await new Promise<void>((resolve) => {
    tsc.stdout.on("data", (data) => {
      if (data.toString().includes("Watching for file changes.")) resolve();
    });
  });

  console.log("");
  console.log("Ok, done. Triggering demo app dev script...");

  runDemoAppWithCommand(`COREQUERY_HOT_RELOAD=true npm run ${devScriptName}`);
} else {
  console.log();
  notifyOfMissingDemoAppConfiguration("dev");
}
