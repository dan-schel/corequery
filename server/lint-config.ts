import type { CorequeryConfig } from "./config/config.js";

export type LintableConfig = Omit<CorequeryConfig, "assets" | "port">;

export type LintOptions = {
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

/*

TODO: To lint:

- url names are as expected
- stops have at least one platform (or none do)
- no duplicate stop ids, line ids, platform ids within a stop, route ids within 
  a line
- asset paths exist on disk
- all lines have codes (or none do)
- no duplicate routes in the same line or across different lines
- routes have at least two non-hidden stops
- line diagrams have at least one entry
- line diagrams cover every non-hidden stop on every route
- order of stops on line diagram doesn't disagree with any routes
- all lines are covered by the lines page tags, and none are covered twice
- all stops have locations (or none do)

*/
