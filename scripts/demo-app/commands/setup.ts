import { logInfo } from "@/scripts/demo-app/utils.js";
import { doSetup } from "@/scripts/demo-app/setup/do-setup.js";
import { detectExistingSetupArgs } from "@/scripts/demo-app/setup/package-json.js";
import { askSetupArgs } from "@/scripts/demo-app/setup/ask-setup-args.js";

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

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
