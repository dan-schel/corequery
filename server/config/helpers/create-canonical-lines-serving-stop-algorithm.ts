import type { GetCanonicalLinesServingStopConfig } from "@/server/config/types/get-canonical-lines-serving-stop-config-func.js";
import type { Line } from "@/server/data/line.js";

type Options = {
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

  /**
   * Whether to ignore stops on routes marked as `hidden-unless-stopped-at`.
   * (Default: `false`)
   */
  readonly includeHiddenStops?: boolean;
};

export function createCanonicalLinesServingStopAlgorithm(
  options: Options,
): GetCanonicalLinesServingStopConfig {
  const tierLinesByTag = options.tierLinesByTag ?? [];
  const includeHiddenStops = options.includeHiddenStops ?? false;

  return (stopId, lines) => {
    const allCandidateLines = lines.filter((line) =>
      line.anyRouteStopsAt(stopId, { includeHiddenStops }),
    );

    if (tierLinesByTag.length === 0 || allCandidateLines.length === 0) {
      return allCandidateLines.map((line) => line.id);
    }

    // Assign each line to a tier, using 0 as the default if tier unclear.
    const linesByTier = new Map<number, Line[]>();
    for (const line of allCandidateLines) {
      const foundTier = tierLinesByTag.findIndex((tag) => line.tags.has(tag));
      const tier = foundTier === -1 ? 0 : foundTier;
      linesByTier.set(tier, [...(linesByTier.get(tier) ?? []), line]);
    }

    const highestTier = Math.min(...linesByTier.keys());
    const highestTierLines = linesByTier.get(highestTier) ?? [];
    return highestTierLines.map((line) => line.id);
  };
}
