import { execSync } from "child_process";
import fsp from "fs/promises";
import path from "path";
import chalk from "chalk";

const DEMO_APP_PATH = "./demo-app";

async function main() {
  const action = process.argv[2];

  if (action === "setup") return setup();
  if (action === "dev") return dev();
  if (action === "start") return start();

  return help();
}

async function setup() {
  // TODO: Ask for git repo URL, and clone it to demo-app folder.

  await updatePackageJson();

  execSync("npm install", { cwd: DEMO_APP_PATH, stdio: "inherit" });
}

async function dev() {
  logInfo("Running demo app (with hot-reloading)...");

  // Two aspects of hot-reloading:
  // - `COREQUERY_HOT_RELOAD=true` to tell the server to use the vite dev
  //   middleware and therefore have hot-reloading for the frontend.
  // - `npm run dev` to hot-reload the server code.
  runDemoAppWithCommand("COREQUERY_HOT_RELOAD=true npm run dev");
}

async function start() {
  logInfo("Running demo app...");
  runDemoAppWithCommand("npm run start");
}

async function help() {
  console.log("Usage: tsx scripts/demo-app.ts <setup|dev|start>");
}

async function updatePackageJson() {
  const packageJsonPath = path.join(DEMO_APP_PATH, "package.json");
  const originalStr = await fsp.readFile(packageJsonPath, "utf-8");
  const originalJson = JSON.parse(originalStr);

  const newJson = {
    ...originalJson,
    dependencies: {
      ...originalJson.dependencies,
      corequery: "file:../",
    },
  };
  const newStr = JSON.stringify(newJson, null, 2);
  await fsp.writeFile(packageJsonPath, newStr, "utf-8");
}

function runDemoAppWithCommand(command: string) {
  try {
    execSync(command, { cwd: DEMO_APP_PATH, stdio: "inherit" });
  } catch (e) {
    console.log();
    if (
      e instanceof Error &&
      "status" in e &&
      (e.status === 130 || e.status === 0)
    ) {
      logInfo(`Demo app exited with status code ${e.status}.`);
    } else {
      logInfo(`Unexpected error!`, e);
    }
    console.log();
  }
}

function logInfo(...message: any[]) {
  console.log(chalk.bgMagenta(" Demo App Script "), ...message);
}

main();
