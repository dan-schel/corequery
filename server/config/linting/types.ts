import type { CorequeryConfig } from "../index.js";

export type LintableConfig = Omit<CorequeryConfig, "assets" | "port">;

export type LintIssue = {
  readonly scope: string | null;
  readonly message: string;
};
