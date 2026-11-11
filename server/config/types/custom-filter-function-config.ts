import type { Corequery } from "@/server/corequery.js";
import type { Departure } from "@/server/data/index.js";

export type CustomFilterFunctionConfig<CustomContextType = unknown> = {
  readonly prefix: string;

  readonly isAccepted: (
    departure: Departure,
    app: Corequery<CustomContextType>,
  ) => boolean;
};
