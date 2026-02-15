import path from "path";
import { DEMO_APP_PATH } from "@/scripts/demo-app/utils.js";
import fsp from "fs/promises";
import z from "zod";
import {
  type SetupArgs,
  setupArgsSchema,
} from "@/scripts/demo-app/setup/setup-args.js";

const PACKAGE_JSON_PATH = path.join(DEMO_APP_PATH, "package.json");

const packageJsonSchema = z.looseObject({
  dependencies: z.looseObject({}).optional(),
  corequeryDemoApp: z
    .looseObject({
      scripts: z
        .looseObject({
          dev: z.string().optional(),
          start: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export async function tryReadPackageJson() {
  try {
    const packageJsonPath = path.join(DEMO_APP_PATH, "package.json");
    const str = await fsp.readFile(packageJsonPath, "utf-8");
    return packageJsonSchema.parse(JSON.parse(str));
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
    corequeryDemoApp: {
      ...(originalJson.corequeryDemoApp ?? {}),
      setup: args,
    },
  };

  const newStr = JSON.stringify(newJson, null, 2);
  await fsp.writeFile(PACKAGE_JSON_PATH, newStr, "utf-8");
}

export async function detectExistingSetupArgs(): Promise<SetupArgs | null> {
  const packageJson = await tryReadPackageJson();
  if (packageJson == null) return null;

  const schema = z.object({
    corequeryDemoApp: z.object({ setup: setupArgsSchema }),
  });

  const result = schema.safeParse(packageJson);
  if (!result.success) return null;

  return result.data.corequeryDemoApp.setup;
}
