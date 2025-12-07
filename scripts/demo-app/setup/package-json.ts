import path from "path";
import { DEMO_APP_PATH } from "../utils";
import fsp from "fs/promises";
import z from "zod";
import { SetupArgs, setupArgsSchema } from "./setup-args";

const PACKAGE_JSON_PATH = path.join(DEMO_APP_PATH, "package.json");

export async function tryReadPackageJson() {
  try {
    const packageJsonPath = path.join(DEMO_APP_PATH, "package.json");
    const str = await fsp.readFile(packageJsonPath, "utf-8");
    return JSON.parse(str);
  } catch {
    return null;
  }
}

export async function updatePackageJson(args: SetupArgs) {
  const originalJson = await tryReadPackageJson();

  if (originalJson == null) throw new Error("Could not read package.json");

  const newJson = {
    ...originalJson,
    dependencies: {
      ...originalJson.dependencies,
      corequery: "file:../",
    },
    corequeryDemoApp: args,
  };

  const newStr = JSON.stringify(newJson, null, 2);
  await fsp.writeFile(PACKAGE_JSON_PATH, newStr, "utf-8");
}

export async function detectExistingSetupArgs(): Promise<SetupArgs | null> {
  const packageJson = await tryReadPackageJson();
  if (packageJson == null) return null;

  const schema = z.object({
    corequeryDemoApp: setupArgsSchema,
  });

  const result = schema.safeParse(packageJson);
  if (!result.success) return null;

  return result.data.corequeryDemoApp;
}
