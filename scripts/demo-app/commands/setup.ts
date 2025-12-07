import { logInfo } from "../utils";
import { doSetup } from "../setup/do-setup";
import { detectExistingSetupArgs } from "../setup/package-json";
import { askSetupArgs } from "../setup/ask-setup-args";

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
