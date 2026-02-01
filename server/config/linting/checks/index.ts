import type { LintingCheck } from "./check.js";
import { linesPageCheck } from "./lines-page/index.js";
import { linesCheck } from "./lines/index.js";

export const checks: readonly LintingCheck[] = [linesCheck, linesPageCheck];
