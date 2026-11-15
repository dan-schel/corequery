import { DEMO_APP_PATH, logInfo } from "@/scripts/demo-app/utils.js";
import fsp from "fs/promises";
import { execSync } from "child_process";
import { updatePackageJson } from "@/scripts/demo-app/setup/package-json.js";
import path from "path";
import { assertNever } from "@dan-schel/js-utils";
import { type SetupArgs } from "@/scripts/demo-app/setup/setup-args.js";
import {
  readEnvFile,
  writeEnvFile,
} from "@/scripts/demo-app/setup/env-file.js";

export async function doSetup(args: SetupArgs, oldArgs: SetupArgs | null) {
  const envContent = isSameRepo(args, oldArgs) ? await readEnvFile() : null;

  await prepareEmptyDemoAppFolder();
  await loadCodeIntoFolder(args);
  if (envContent != null) {
    await writeEnvFile(envContent);
  }
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
    assertNever(args.source);
  }
}

async function loadCodeFromGit(gitRepoUrl: string, branch: string | null) {
  logInfo("Cloning repository...");
  console.log();

  const branchArg = branch != null ? ` -b ${branch}` : ``;
  execSync(`git clone${branchArg} ${gitRepoUrl} ${DEMO_APP_PATH}`, {
    stdio: "inherit",
  });

  await fsp.rm(path.join(DEMO_APP_PATH, ".git"), {
    recursive: true,
    force: true,
  });

  console.log();
}

function isSameRepo(args: SetupArgs, oldArgs: SetupArgs | null) {
  if (oldArgs == null) return false;
  return oldArgs.gitRepoUrl === args.gitRepoUrl;
}
