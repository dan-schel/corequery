import { logInfo } from "../utils.js";
import { doSetup } from "../setup/do-setup.js";
import { detectExistingSetupArgs } from "../setup/package-json.js";
import { askSetupArgs } from "../setup/ask-setup-args.js";

async function main() {
  logInfo("Hello, let's set up the demo app!");
  console.log();

  const existingSetupArgs = await detectExistingSetupArgs();
  const setupArgs = await askSetupArgs(existingSetupArgs);

  console.log();
  await doSetup(setupArgs);
  logInfo("✅ Setup complete!");
  console.log();
}

main();
