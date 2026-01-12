import type { CorequeryConfig } from "./config/config.js";

type LintableConfig = Omit<CorequeryConfig, "assets" | "port">;

type LintOptions = {
  pass?: boolean;
  // ignoreStopsMissingPlatforms: boolean;
};

export function lintConfig(_config: LintableConfig, options: LintOptions = {}) {
  const pass = options.pass ?? false;

  if (pass) {
    return;
  }

  throw new Error("Config is invalid - not implemented yet!");
}
