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

export async function handle<CustomContextType>(
  ctx: ApiContext<CustomContextType>,
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
        const departure = await iterator.take();

        for (let i = 0; i < args.feeds.length; i++) {
          const feed = itsOk(args.feeds[i]);
          const resultsSubarray = itsOk(results[i]);

          if (feed.stopId !== stopId) continue;
          if (resultsSubarray.length >= feed.desiredCount) continue;
          if (!isAcceptedByFilter(departure, feed.filterExpression)) continue;
          if (isSkipped(departure, feed.skips)) continue;

          resultsSubarray.push(departure);
        }
      }
    }

    return {
      feeds: results.map((x) => ({
        departures: x.map((y) => toApiResult(ctx.app, y)),
      })),
      invalidFilterTokens: [],
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

function isAcceptedByFilter(_x: Departure, _filterExpression: string) {
  // I'll also have to pass the list of filters for this stop, and some logic
  // that knows what they mean.

  // TODO: Implement this.

  // Filter types:
  //
  // - `arr`: Movement is an arrival (typically used as `!arr`).
  //
  // - `sdo`: Movement is set down only (typically used as `!sdo`).
  //
  // - `line:X`: Line X is in the departure's lines array.
  //
  // - `position:X`: Movement is at position X.
  //
  // - `service-tag:X`: Service tag X is in the departure's service tags array.
  //
  // - `line-tag:X`: A line in the departure's lines array has tag X.
  //
  // - `stops-at:X`: Future movements of this service stop at stop X. (It's
  //   unclear whether transfers should be followed, and if so, whether stops
  //   after the "relevancy cutoff" should be included.)
  //
  // Filter expression syntax:
  //
  // - "!" to negate, e.g. "!line:10".
  //
  // - "|" for OR, e.g. "line:10|line:15".
  //
  // - " " for AND, e.g. "line:10 line:15".
  //
  // - Filters are expected to be in CNF, so "a|b c|d", and therefore
  //   parentheses are not allowed.

  return true;
}

function isSkipped(departure: Departure, skips: DeparturesV0ApiSkips[]) {
  return skips.some(
    (s) =>
      s.sourceId === departure.service.sourceId &&
      s.intrasourceId === departure.service.intrasourceId,
  );
}
