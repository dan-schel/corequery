import type { LintingContext } from "../linting-context.js";

export type LintingCheck = {
  scope: string | null;
  fn: (ctx: LintingContext) => void;
};
