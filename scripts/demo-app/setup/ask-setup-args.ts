import { createInterface } from "readline";
import { formatSetupArgs, SetupArgs } from "./setup-args";
import chalk from "chalk";

export async function askSetupArgs(
  existingSetup: SetupArgs | null
): Promise<SetupArgs> {
  if (existingSetup != null) {
    const formattedArgs = formatSetupArgs(existingSetup);
    console.log(chalk.cyanBright.bold("NOTICE:"));
    console.log(`Found existing demo app: ${chalk.white.bold(formattedArgs)}`);
    console.log(
      "Continue the setup to update this local copy, otherwise press Ctrl+C to abort."
    );
    console.log();
  }

  const gitRepoUrl = await askGitRepoQuestion(existingSetup);
  console.log();
  const branch = await askBranchQuestion(existingSetup);

  return {
    source: "git",
    gitRepoUrl,
    branch,
  };
}

async function askGitRepoQuestion(
  existingSetup: SetupArgs | null
): Promise<string> {
  if (existingSetup != null) {
    const defaultValue = chalk.gray(`(${existingSetup.gitRepoUrl})`);
    return (
      (await ask(`Git repository URL ${defaultValue}: `)) ??
      existingSetup.gitRepoUrl
    );
  }

  const response = await ask(`Git repository URL: `);
  if (response == null) {
    throw new Error("Git repository URL is required.");
  }
  return response;
}

async function askBranchQuestion(existingSetup: SetupArgs | null) {
  if (existingSetup != null) {
    const defaultValue = chalk.gray(
      `(${existingSetup.branch ?? "default branch"})`
    );
    return (await ask(`Branch ${defaultValue}: `)) ?? existingSetup.branch;
  }

  const response = await ask(
    `Branch ${chalk.gray("(leave empty for default branch)")}: `
  );
  return response;
}

function ask(query: string): Promise<string | null> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();

      if (answer.length === 0) {
        resolve(null);
      } else {
        resolve(answer);
      }
    });
  });
}
