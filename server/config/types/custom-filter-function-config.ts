import type { Corequery } from "@/server/corequery.js";
import type { Departure } from "@/server/data/index.js";

export type CustomFilterFunctionConfig<CustomContextType = unknown> = {
  // The bit that goes before the args (if any), e.g. "line" in "line:10". Each
  // custom filter must have a unique prefix, and it obviously can't conflict
  // with a built-in one.
  readonly prefix: string;

  readonly isAccepted: (
    // "line:10" or just "line" if there's no args.
    filterToken: string,

    departure: Departure,
    app: Corequery<CustomContextType>,
  ) => boolean;

  // Whether to send this filter token to `invalidFilterTokens` and ignore it.
  // (If `false`, `isAccepted` won't be called, it'll just be taken as `true`.)
  readonly isValid: (
    filterToken: string,
    app: Corequery<CustomContextType>,
  ) => boolean;
};
