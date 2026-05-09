import type { GetCanonicalLinesServingStopConfig } from "@/server/config/types/get-canonical-lines-serving-stop-config-func.js";
import type {
  LineConfig,
  LineDiagramConfig,
  LineDiagramStopTypeConfig,
} from "@/server/config/types/line-config.js";
import type { TagSuccessionConfig } from "@/server/config/types/tags-config.js";
import { Tags } from "@/server/data/tags.js";
import { extractStopsFromLineDiagramShape } from "@/server/config/helpers/extract-stops-from-line-diagram-shape.js";

const isCanonicalMapping: Record<LineDiagramStopTypeConfig, boolean> = {
  "regular": true,
  "always-express": false,
};

type Options = {
  readonly lines: readonly LineConfig[];
  readonly lineTagSuccession: TagSuccessionConfig;

  /**
   * Defines tiers such that lines from a subsequent tier are ignored if the
   * stop is also served by lines from an earlier tier. In other words, tiers
   * are ordered by priority, with the first tier having the highest priority.
   * Any lines which don't fall into any tier are always included (as though
   * they were in the first tier).
   *
   * E.g. if set to `[tag.FULL_TIME, tag.PART_TIME]`, then lines tagged as
   * `PART_TIME` will only be listed for stops which aren't also served by lines
   * tagged as `FULL_TIME`.
   */
  readonly tierLinesByTag?: number[];
};

export function createCanonicalLinesServingStopAlgorithm(
  options: Options,
): GetCanonicalLinesServingStopConfig {
  const lines = options.lines.map((line) => ({
    ...line,
    tags: Tags.build(line.tags, options.lineTagSuccession),
  }));

  const tierLinesByTag = options.tierLinesByTag ?? [];

  return (stopId) => {
    const allCandidateLines = lines.filter((line) =>
      isStopInDiagram(stopId, line.diagram),
    );

    if (tierLinesByTag.length === 0 || allCandidateLines.length === 0) {
      return allCandidateLines.map((line) => line.id);
    }

    // Assign each line to a tier, using 0 as the default if tier unclear.
    const linesByTier = new Map<number, number[]>();
    for (const line of allCandidateLines) {
      const foundTier = tierLinesByTag.findIndex((tag) => line.tags.has(tag));
      const tier = foundTier === -1 ? 0 : foundTier;
      linesByTier.set(tier, [...(linesByTier.get(tier) ?? []), line.id]);
    }

    const highestTier = Math.min(...linesByTier.keys());
    return linesByTier.get(highestTier) ?? [];
  };
}

function isStopInDiagram(stopId: number, diagram: LineDiagramConfig): boolean {
  return diagram.entries
    .flatMap((entry) => extractStopsFromLineDiagramShape(entry.shape))
    .some((s) => s.stopId === stopId && isCanonicalMapping[s.type]);
}
