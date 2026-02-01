import type { CorequeryConfig } from "../index.js";

export type LintableConfig = Omit<CorequeryConfig, "assets" | "port">;

export type LintOptions = {
  /** Whether to throw an error when an issue is found. (Default: `false`) */
  readonly throwOnFailure?: boolean;
  /** Whether to print issues to the console, if found. (Default: `true`) */
  readonly printOnFailure?: boolean;

  readonly lines?: {
    readonly lineNameRegex?: RegExp;
  };

  readonly linesPage?: {
    readonly ignoreMissingLines?: readonly number[];
    readonly ignoreDuplicatedLines?: readonly number[];
  };
};

export type LintIssue = {
  readonly scope: string | null;
  readonly message: string;
};
