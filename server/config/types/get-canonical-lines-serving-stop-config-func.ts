import type { LineCollection } from "@/server/data/line-collection.js";

export type GetCanonicalLinesServingStopConfig = (
  stopId: number,
  lines: LineCollection,
) => readonly number[];
