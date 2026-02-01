import type { LintingCheck } from "./check.js";
import { linesPageCheck } from "./lines-page/index.js";

export const checks: readonly LintingCheck[] = [linesPageCheck];
