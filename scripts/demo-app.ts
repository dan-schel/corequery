import { execSync } from "child_process";
import fsp from "fs/promises";
import path from "path";

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
  console.log("Running demo app with hot-reloading...");
  execSync("npm run dev", { cwd: DEMO_APP_PATH, stdio: "inherit" });
}

async function start() {
  console.log("Starting demo app...");
  execSync("npm run start", { cwd: DEMO_APP_PATH, stdio: "inherit" });
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

main();
