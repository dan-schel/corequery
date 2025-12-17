import { tryReadPackageJson } from "../setup/package-json";
import {
  logInfo,
  notifyOfMissingDemoAppConfiguration,
  runDemoAppWithCommand,
} from "../utils";

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
