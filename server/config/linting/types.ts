export type LintIssue = {
  readonly message: string;
  readonly path?: string;
};

export type LintOptions = {
  readonly stops?: Record<number, StopLintOptions>;
  readonly lines?: Record<number, LineLintOptions>;
  readonly linesPage?: Record<number, LinesPageLineLintOptions>;
};

export type StopLintOptions = {
  readonly ignoreDuplicatedName?: boolean;
  readonly ignoreDuplicatedPositionName?: boolean;
  readonly ignoreMissingLocation?: boolean;
  readonly ignoreMissingPosition?: boolean;
  readonly ignoreUnusedStop?: boolean;
};

export type LineLintOptions = {
  readonly ignoreDuplicatedName?: boolean;
  readonly ignoreDiagramStopNotInRoute?: boolean;
  readonly ignoreMissingDiagramEntries?: boolean;
  readonly ignoreMissingCode?: boolean;
  readonly ignoreMissingRoutes?: boolean;
  readonly routes?: Record<number, RouteLintOptions>;
};

export type RouteLintOptions = {
  readonly ignoreDuplicatedName?: boolean;
  readonly ignoreMissingMirrored?: boolean;
};

export type LinesPageLineLintOptions = {
  readonly ignoreUnlistedLine?: boolean;
  readonly ignoreDuplicatedLine?: boolean;
};
