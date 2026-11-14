import path from "path";
import fsp from "fs/promises";
import { DEMO_APP_PATH, logInfo } from "@/scripts/demo-app/utils.js";

const ENV_FILE_PATH = path.join(DEMO_APP_PATH, ".env");

export async function readEnvFile(): Promise<Buffer | null> {
  try {
    return await fsp.readFile(ENV_FILE_PATH);
  } catch {
    logInfo(`Unable to retain ${ENV_FILE_PATH} content, if it existed.`);
    return null;
  }
}

export async function writeEnvFile(content: Buffer) {
  await fsp.writeFile(ENV_FILE_PATH, content);
}
