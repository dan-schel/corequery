import { execSync, type ChildProcessWithoutNullStreams } from "child_process";
import chalk from "chalk";

export const DEMO_APP_PATH = "./demo-app";

export function logInfo(...message: unknown[]) {
  console.log(chalk.bgMagenta(" Demo App Runner "), ...message);
}

export function runDemoAppWithCommand(command: string) {
  try {
    // This is kinda dumb, but when we set "--tsconfig" to run this script, it
    // sets this env var. By default execSync sets env to process.env, so if the
    // demo app ALSO uses tsx it'll think we're pointing it to the tsconfig for
    // this script lol.
    const env = { ...process.env };
    delete env.TSX_TSCONFIG_PATH;

    execSync(command, { cwd: DEMO_APP_PATH, stdio: "inherit", env });
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

export function waitForStdout(
  childProcess: ChildProcessWithoutNullStreams,
  message: string,
) {
  return new Promise<void>((resolve) => {
    childProcess.stdout.on("data", (data) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if ((data.toString() as string).includes(message)) resolve();
    });
  });
}
