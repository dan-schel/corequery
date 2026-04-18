import type { GetCanonicalLinesServingStopConfig } from "@/server/config/types/get-canonical-lines-serving-stop-config-func.js";
import type {
  LineConfig,
  RouteConfig,
  RouteStopTypeConfig,
} from "@/server/config/types/line-config.js";
import type { TagSuccessionConfig } from "@/server/config/types/tags-config.js";
import { Tags } from "@/server/data/tags.js";

const isHiddenMapping: Record<RouteStopTypeConfig, boolean> = {
  "regular": false,
  "hidden-unless-stopped-at": true,
};

type Options = {
  readonly lines: readonly LineConfig[];
  readonly lineTagSuccession: TagSuccessionConfig;
  readonly routeTagSuccession: TagSuccessionConfig;

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

  /** A list of route tags, the routes of which should be ignored. */
  readonly ignoreRoutesWithTags?: number[];

  /**
   * Whether to ignore stops on routes marked as `hidden-unless-stopped-at`.
   * (Default: `true`)
   */
  readonly ignoreHiddenStops?: boolean;
};

export function createCanonicalLinesServingStopAlgorithm(
  options: Options,
): GetCanonicalLinesServingStopConfig {
  const lines = options.lines.map((line) => ({
    ...line,
    tags: Tags.build(line.tags, options.lineTagSuccession),
  }));

  const tierLinesByTag = options.tierLinesByTag ?? [];
  const ignoreRoutesWithTags = options.ignoreRoutesWithTags ?? [];
  const ignoreHiddenStops = options.ignoreHiddenStops ?? true;

  return (stopId) => {
    const allCandidateLines = lines.filter((line) =>
      find({
        stopId,
        routes: line.routes,
        routeTagSuccession: options.routeTagSuccession,
        ignoreRoutesWithTags,
        ignoreHiddenStops,
      }),
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

function find({
  stopId,
  routes,
  routeTagSuccession,
  ignoreRoutesWithTags,
  ignoreHiddenStops,
}: {
  stopId: number;
  routes: readonly RouteConfig[];
  routeTagSuccession: TagSuccessionConfig;
  ignoreRoutesWithTags: number[];
  ignoreHiddenStops: boolean;
}): boolean {
  return routes.some((route) => {
    const routeTags = Tags.build(route.tags, routeTagSuccession);
    const ignored = ignoreRoutesWithTags.some((tag) => routeTags.has(tag));
    if (ignored) return false;

    const relevantStops = route.stops.filter((stop) => {
      const isHiddenStop = isHiddenMapping[stop.type];
      return !isHiddenStop || !ignoreHiddenStops;
    });

    return relevantStops.some((stop) => stop.stopId === stopId);
  });
}
