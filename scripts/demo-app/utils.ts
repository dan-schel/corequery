import { execSync } from "child_process";
import chalk from "chalk";

export const DEMO_APP_PATH = "./demo-app";

export function logInfo(...message: any[]) {
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
