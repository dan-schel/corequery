import { createInterface } from "readline";
import { formatSetupArgs, SetupArgs } from "./setup-args";
import chalk from "chalk";

export async function askSetupArgs(
  existingSetup: SetupArgs | null,
): Promise<SetupArgs> {
  if (existingSetup != null) {
    showExistingSetupNotice(existingSetup);
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

function showExistingSetupNotice(existingSetup: SetupArgs) {
  const formattedArgs = formatSetupArgs(existingSetup);

  console.log(chalk.cyanBright.bold("Notice:"));
  console.log(`Found existing demo app: ${chalk.white.bold(formattedArgs)}`);
  console.log(
    "If you'd like to update this local copy, continue the setup, otherwise press Ctrl+C to abort.",
  );

  console.log();
}

async function askGitRepoQuestion(existing: SetupArgs | null): Promise<string> {
  if (existing != null) {
    const gitRepoUrl = await ask("Git repository URL", existing.gitRepoUrl);
    return gitRepoUrl ?? existing.gitRepoUrl;
  }

  const gitRepoUrl = await ask("Git repository URL", null);
  if (gitRepoUrl == null) throw new Error("Git repository URL is required.");
  return gitRepoUrl;
}

async function askBranchQuestion(
  existing: SetupArgs | null,
): Promise<string | null> {
  if (existing != null) {
    const branch = await ask("Branch", existing.branch ?? "default branch");
    return branch ?? existing.branch;
  }

  return (await ask("Branch", "leave empty for default branch")) ?? null;
}

function ask(field: string, hint: string | null): Promise<string | null> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const hintText = hint != null ? ` ${chalk.gray(`(${hint})`)}` : "";

    rl.question(`${field}${hintText}: `, (answer) => {
      rl.close();

      if (answer.length === 0) {
        resolve(null);
      } else {
        resolve(answer);
      }
    });
  });
}
