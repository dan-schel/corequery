import { tryReadPackageJson } from "../setup/package-json.js";
import {
  logInfo,
  notifyOfMissingDemoAppConfiguration,
  runDemoAppWithCommand,
} from "../utils.js";

logInfo("Running demo app...");

runDemoAppWithCommand("npm run start");

const packageJson = await tryReadPackageJson();

const startScriptName = packageJson?.corequeryDemoApp?.scripts?.start;

if (startScriptName != null) {
  runDemoAppWithCommand(`npm run ${startScriptName}`);
} else {
  console.log();
  notifyOfMissingDemoAppConfiguration("start");
}
