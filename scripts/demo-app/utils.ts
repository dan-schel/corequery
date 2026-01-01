import { execSync } from "child_process";
import chalk from "chalk";

export const DEMO_APP_PATH = "./demo-app";

export function logInfo(...message: unknown[]) {
  console.log(chalk.bgMagenta(" Demo App Runner "), ...message);
}

export function runDemoAppWithCommand(command: string) {
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

export function notifyOfMissingDemoAppConfiguration(script: "dev" | "start") {
  console.log(
    `❌ The demo-app's package.json does not specify a ${script} script.`,
  );
  console.log();
  console.log(
    `Please add a ${chalk.cyan(
      "corequeryDemoApp",
    )} field to the package.json like so:`,
  );
  console.log();

  console.log(
    chalk.cyan(`{
  // ...existing code...

  "scripts": {
    "dev": "tsx watch --clear-screen=false index.ts",
    "dev-corequery-demo-app": "tsx watch --clear-screen=false --exclude ../node_modules index.ts",
    "start": "tsx index.ts"
  },
  "corequeryDemoApp": {
    "scripts": {
      "dev": "dev-corequery-demo-app"
      "start": "start"
    }
  }
}`),
  );
}
