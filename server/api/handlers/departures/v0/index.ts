import type { DEPARTURES_V0 } from "@/shared/apis/index.js";
import type {
  ApiContext,
  ServerFodaSyncedResultOf,
} from "@/server/api/types.js";
import type { ServerArgsOf, ServerResultOf } from "@/server/api/types.js";
import { applyFodaSyncedResult } from "@/server/api/handlers/foda-synced-handler.js";
import { ArgsError } from "@/server/api/args-error.js";
import { itsOk } from "@dan-schel/js-utils";
import type { Departure } from "@/server/data/index.js";
import { toApiResult } from "@/server/api/handlers/departures/v0/to-api-result.js";

type DeparturesV0ApiResult = ServerFodaSyncedResultOf<typeof DEPARTURES_V0>;
type DeparturesV0ApiFeedResult = DeparturesV0ApiResult["feeds"][number];
export type DeparturesV0ApiDeparture =
  DeparturesV0ApiFeedResult["departures"][number];

type DeparturesV0ApiArgs = ServerArgsOf<typeof DEPARTURES_V0>;
type DeparturesV0ApiFeedArgs = DeparturesV0ApiArgs["feeds"][number];
type DeparturesV0ApiSkips = DeparturesV0ApiFeedArgs["skips"][number];

export async function handle(
  ctx: ApiContext,
  args: ServerArgsOf<typeof DEPARTURES_V0>,
): Promise<ServerResultOf<typeof DEPARTURES_V0>> {
  return applyFodaSyncedResult(ctx, async () => {
    ensureFeedsReasonable(args.feeds);
    const instant = parseInstant(args.instant);

    const results: Departure[][] = args.feeds.map(() => []);
    const stopIds = new Set(args.feeds.map((feed) => feed.stopId));

    for (const stopId of stopIds) {
      const iterator = ctx.app.services.getDeparturesIterator(
        stopId,
        instant,
        args.direction,
      );

      while (
        !allFeedsSatisfied(results, args.feeds, stopId) &&
        (await iterator.peek()) != null
      ) {
        const dep = await iterator.take();

        for (let i = 0; i < args.feeds.length; i++) {
          const feed = itsOk(args.feeds[i]);
          const resultsSubarray = itsOk(results[i]);

          if (feed.stopId !== stopId) continue;
          if (resultsSubarray.length >= feed.desiredCount) continue;
          if (!isAcceptedByFilter(dep, feed.filterTokens)) continue;
          if (skipped(dep, feed.skips)) continue;

          resultsSubarray.push(dep);
        }
      }
    }

    return {
      feeds: results.map((x) => ({
        departures: x.map((y) => toApiResult(ctx.app, y)),
      })),
    };
  });
}

function ensureFeedsReasonable(feeds: DeparturesV0ApiFeedArgs[]) {
  if (feeds.length < 1) throw new ArgsError("No feeds provided.");
  if (feeds.length > 4) throw new ArgsError("Too many feeds.");

  for (const feed of feeds) {
    if (feed.desiredCount < 1) throw new ArgsError("Desired count too low.");
    if (feed.desiredCount > 50) throw new ArgsError("Desired count too high.");
  }
}

function parseInstant(instant: string) {
  try {
    return Temporal.Instant.from(instant);
  } catch {
    throw new ArgsError(`Couldn't convert "${instant}" to an instant.`);
  }
}

function allFeedsSatisfied(
  results: Departure[][],
  feeds: DeparturesV0ApiFeedArgs[],
  stopId: number,
) {
  for (let i = 0; i < feeds.length; i++) {
    const feed = itsOk(feeds[i]);
    if (feed.stopId !== stopId) continue;

    const resultsCount = itsOk(results[i]).length;
    const desiredCount = feed.desiredCount;

    if (resultsCount < desiredCount) return false;
  }
  return true;
}

function isAcceptedByFilter(_x: Departure, _filterTokens: string[]) {
  // I'll also have to pass the list of filters for this stop, and some logic
  // that knows what they mean.

  // TODO: Implement this.
  return true;
}

function skipped(x: Departure, skips: DeparturesV0ApiSkips[]) {
  return skips.some(
    (s) =>
      s.sourceId === x.service.sourceId &&
      s.intrasourceId === x.service.intrasourceId,
  );
}
