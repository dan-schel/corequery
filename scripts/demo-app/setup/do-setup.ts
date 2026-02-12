import { DEMO_APP_PATH, logInfo } from "@/scripts/demo-app/utils.js";
import fsp from "fs/promises";
import { execSync } from "child_process";
import { updatePackageJson } from "@/scripts/demo-app/setup/package-json.js";
import path from "path";
import { type SetupArgs } from "@/scripts/demo-app/setup/setup-args.js";

export async function doSetup(args: SetupArgs) {
  await prepareEmptyDemoAppFolder();
  await loadCodeIntoFolder(args);
  await updatePackageJson(args);

  logInfo("Installing dependencies...");
  execSync("npm install", { cwd: DEMO_APP_PATH, stdio: "inherit" });
  console.log();
}

async function prepareEmptyDemoAppFolder() {
  await fsp.rm(DEMO_APP_PATH, { recursive: true, force: true });
  await fsp.mkdir(DEMO_APP_PATH, { recursive: true });
}

async function loadCodeIntoFolder(args: SetupArgs) {
  if (args.source === "git") {
    await loadCodeFromGit(args.gitRepoUrl, args.branch);
  } else {
    throw new Error(`Unknown setup source: ${args.source}`);
  }
}

async function loadCodeFromGit(gitRepoUrl: string, branch: string | null) {
  logInfo("Cloning repository...");
  console.log();

  const branchArg = branch ? ` -b ${branch}` : ``;
  execSync(`git clone${branchArg} ${gitRepoUrl} ${DEMO_APP_PATH}`, {
    stdio: "inherit",
  });

  await fsp.rm(path.join(DEMO_APP_PATH, ".git"), {
    recursive: true,
    force: true,
  });

  console.log();
}
