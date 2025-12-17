import { tryReadPackageJson } from "../setup/package-json";
import {
  logInfo,
  notifyOfMissingDemoAppConfiguration,
  runDemoAppWithCommand,
} from "../utils";

logInfo("Running demo app (with hot-reloading)...");

const packageJson = await tryReadPackageJson();

const devScriptName = packageJson?.corequeryDemoApp?.scripts?.dev;

if (devScriptName != null) {
  // Two aspects of hot-reloading:
  //
  // - `COREQUERY_HOT_RELOAD=true` to tell the server to use the vite dev
  //   middleware and therefore have hot-reloading for the frontend.
  //
  // - Use the demo app's "dev script" (probably `npm run dev`), which is
  //   probably configured to hot-reload the server code.
  runDemoAppWithCommand(`COREQUERY_HOT_RELOAD=true npm run ${devScriptName}`);
} else {
  console.log();
  notifyOfMissingDemoAppConfiguration("dev");
}
