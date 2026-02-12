import type { CorequeryConfig } from "@/server/config/config.js";

export type LintIssue = {
  readonly message: string;
  readonly path?: string;
};

export type LintableConfig = {
  readonly stops: CorequeryConfig["stops"];
  readonly lines: CorequeryConfig["lines"];
  readonly terminology: CorequeryConfig["terminology"];
  readonly landingPage: CorequeryConfig["landingPage"];
  readonly footer: CorequeryConfig["footer"];
  readonly aboutPage: CorequeryConfig["aboutPage"];
  readonly linesPage: CorequeryConfig["linesPage"];
  readonly tags: CorequeryConfig["tags"];
};

export type LintOptions = {
  /** Options to control the lint rules for the stops config. */
  readonly stops?: Record<number, StopLintOptions>;

  /** Options to control the lint rules for the lines config. */
  readonly lines?: Record<number, LineLintOptions>;

  /** Options to control the lint rules for the lines page config. */
  readonly linesPage?: Record<number, LinesPageLineLintOptions>;
};

export type StopLintOptions = {
  /** Ignore this stop sharing the same name as other one. */
  readonly ignoreDuplicatedName?: boolean;

  /** Ignore duplicate position names within this stop. */
  readonly ignoreDuplicatedPositionName?: boolean;

  /** Ignore this stop missing a location when others have one. */
  readonly ignoreMissingLocation?: boolean;

  /** Ignore this stop missing positions when others have them. */
  readonly ignoreMissingPosition?: boolean;

  /** Ignore this stop not appearing in any route. */
  readonly ignoreUnusedStop?: boolean;
};

export type LineLintOptions = {
  /** Ignore this line sharing the same name as another line. */
  readonly ignoreDuplicatedName?: boolean;

  /** Ignore diagram stops that do not appear in any route for this line. */
  readonly ignoreDiagramStopNotInRoute?: boolean;

  /** Ignore this line having no diagram entries. */
  readonly ignoreMissingDiagramEntries?: boolean;

  /** Ignore this line missing a code when others have one. */
  readonly ignoreMissingCode?: boolean;

  /** Ignore this line having no routes. */
  readonly ignoreMissingRoutes?: boolean;

  /** Options to control the lint rules for routes on this line. */
  readonly routes?: Record<number, RouteLintOptions>;
};

export type RouteLintOptions = {
  /** Ignore this route sharing the same name as another route on this line. */
  readonly ignoreDuplicatedName?: boolean;

  /** Ignore this route missing a mirrored counterpart. */
  readonly ignoreMissingMirrored?: boolean;
};

export type LinesPageLineLintOptions = {
  /** Ignore this line not appearing on any lines page section. */
  readonly ignoreUnlistedLine?: boolean;

  /** Ignore this line appearing in multiple lines page sections. */
  readonly ignoreDuplicatedLine?: boolean;
};
