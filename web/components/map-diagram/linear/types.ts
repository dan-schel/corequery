import type { StopStructure } from "@/web/components/map-diagram/base/types";

export type LinearMapDiagramStructure = {
  readonly type: "linear";
  readonly stops: readonly StopStructure[];

  // TODO: Allow setting a threshold for the faded out section. Only linear
  // needs it, as it's only for the service page.

  // TODO: Allow "Trains typically start from/continue to [other lines]" for
  // the Pakenham, Cranbourne, and Sunbury lines (and Sandringham, Werribee, and
  // Williamstown lines in future). Only linear needs it for now, as it doesn't
  // make sense for loop lines, and V/Line (the only user of branch lines)
  // doesn't through run.
};
