import type { CorequeryConfig } from "../index.js";

export type LintableConfig = Omit<CorequeryConfig, "assets" | "port">;

export type LintIssue = {
  readonly scope: string | null;
  readonly message: string;
};

export type LintOptions = {
  /** Whether to throw an error when an issue is found. (Default: `false`) */
  readonly throwOnFailure?: boolean;

  /** Whether to print issues to the console, if found. (Default: `true`) */
  readonly printOnFailure?: boolean;

  readonly stops?: {
    /** Regex that all stop names must match. (Default: A-Z only, title case.) */
    readonly stopNameRegex?: RegExp;

    // TODO: Provide a way to opt specific stops out of the naming check.
  };

  readonly lines?: {
    /** Regex that all line names must match. (Default: A-Z only, title case.) */
    readonly lineNameRegex?: RegExp;

    // TODO: Provide a way to opt specific lines out of the naming check.
  };

  readonly linesPage?: {
    /** Lines which are exempt from appearing on the lines page. */
    readonly ignoreMissingLines?: readonly number[];

    /** Lines which are allowed to appear multiple times on the lines page. */
    readonly ignoreDuplicatedLines?: readonly number[];
  };
};
