import { serverFolderPath } from "@/server/dirname.js";
import fsp from "fs/promises";
import path from "path";
import z from "zod";

const packageJsonSchema = z.object({
  version: z.string(),
});

export async function getCorequeryPackageVersion(): Promise<string> {
  const relativePath = "../../../package.json";
  const packageJsonPath = path.resolve(serverFolderPath, relativePath);

  const packageJsonStr = await fsp.readFile(packageJsonPath, "utf-8");
  const packageJson = packageJsonSchema.parse(JSON.parse(packageJsonStr));

  return packageJson.version;
}
