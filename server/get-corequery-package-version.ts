import { serverFolderPath } from "@/server/dirname.js";
import fs from "fs";
import path from "path";
import z from "zod";

const packageJsonSchema = z.object({
  version: z.string(),
});

export function getCorequeryPackageVersion(): string {
  const packageJsonPath = path.resolve(
    serverFolderPath,
    "../../../package.json",
  );
  const packageJsonStr = fs.readFileSync(packageJsonPath, "utf-8");
  const parseResult = packageJsonSchema.parse(JSON.parse(packageJsonStr));
  return parseResult.version;
}
