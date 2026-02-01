import type { FoundationalData } from "../../data/foundational-data.js";
import type { LintingCheck } from "./checks/check.js";
import type { LintingReporter } from "./linting-reporter.js";
import type { LintableConfig, LintOptions } from "./types.js";

export class LintingContext {
  constructor(
    readonly config: LintableConfig,
    readonly options: LintOptions,
    readonly reporter: LintingReporter,
    readonly foundationalData: FoundationalData,
  ) {}

  run(check: LintingCheck) {
    if (check.scope != null) {
      this.reporter.scope(check.scope, () => {
        check.fn(this);
      });
    } else {
      check.fn(this);
    }
  }

  report(message: string) {
    this.reporter.report(message);
  }
}
