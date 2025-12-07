import { createInterface } from "readline";
import { formatSetupArgs, SetupArgs } from "./setup-args";

export async function askSetupArgs(
  existingSetup: SetupArgs | null
): Promise<SetupArgs> {
  if (existingSetup != null) {
    console.log(`Found existing demo app: ${formatSetupArgs(existingSetup)}`);
    console.log(
      "Continue the setup to update this local copy, otherwise press Ctrl+C to abort."
    );
    console.log();
  }

  const gitRepoUrl = await askGitRepoQuestion(existingSetup);
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
    return (
      (await ask(`Git repository URL (${existingSetup.gitRepoUrl}): `)) ??
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
    return (
      (await ask(`Branch (${existingSetup.branch ?? "default branch"}): `)) ??
      existingSetup.branch
    );
  }

  const response = await ask(`Branch (leave empty for default branch): `);
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
