import type { Tags } from "@/server/data/tags.js";

export type GetCanonicalLinesServingStopConfig = (
  stopId: number,
  stopTags: Tags,
) => readonly number[];
