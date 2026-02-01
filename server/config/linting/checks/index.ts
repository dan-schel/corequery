import type { LintingCheck } from "./check.js";
import { linesPageCheck } from "./lines-page/index.js";
import { linesCheck } from "./lines/index.js";
import { stopsCheck } from "./stops/index.js";

export const checks: readonly LintingCheck[] = [
  linesCheck,
  linesPageCheck,
  stopsCheck,
];
