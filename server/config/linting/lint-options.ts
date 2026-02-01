export type LintOptions = {
  /** Whether to throw an error when an issue is found. (Default: `false`) */
  readonly throwOnFailure?: boolean;

  /** Whether to print issues to the console, if found. (Default: `true`) */
  readonly printOnFailure?: boolean;

  readonly stops?: {
    /** Regex that all stop names must match. (Default: A-Z only, title case.) */
    readonly stopNameRegex?: RegExp;

    /** Stops which are exempt from the naming check. */
    readonly ignoreMisnamedStops?: readonly number[];
  };

  readonly lines?: {
    /** Regex that all line names must match. (Default: A-Z only, title case.) */
    readonly lineNameRegex?: RegExp;

    /** Lines which are exempt from the naming check. */
    readonly ignoreMisnamedLines?: readonly number[];
  };

  readonly linesPage?: {
    /** Lines which are exempt from appearing on the lines page. */
    readonly ignoreMissingLines?: readonly number[];

    /** Lines which are allowed to appear multiple times on the lines page. */
    readonly ignoreDuplicatedLines?: readonly number[];
  };
};
