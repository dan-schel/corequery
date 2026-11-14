import type { DEPARTURES_V0 } from "@/shared/apis/index.js";
import type {
  ApiContext,
  ServerFodaSyncedResultOf,
} from "@/server/api/types.js";
import type { ServerArgsOf, ServerResultOf } from "@/server/api/types.js";
import { applyFodaSyncedResult } from "@/server/api/handlers/foda-synced-handler.js";
import { ArgsError } from "@/server/api/args-error.js";
import { itsOk, nonNull, unique } from "@dan-schel/js-utils";
import type { Departure } from "@/server/data/index.js";
import { toApiResult } from "@/server/api/handlers/departures/v0/to-api-result.js";
import type { Corequery } from "@/server/corequery.js";

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
    // Parse everything and throw if its invalid.
    ensureFeedsReasonable(args.feeds);
    const compiledFilters = ensureValidFeedFilters(ctx.app, args.feeds);
    const instant = parseInstant(args.instant);

    const results: Departure[][] = args.feeds.map(() => []);
    const stopIds = new Set(args.feeds.map((feed) => feed.stopId));
    const feedFilters = compiledFilters.map((x) => x.filterFunction);

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
          const passesFilter = itsOk(feedFilters[i]);
          const resultsSubarray = itsOk(results[i]);

          if (feed.stopId !== stopId) continue;
          if (resultsSubarray.length >= feed.desiredCount) continue;
          if (!passesFilter(departure)) continue;
          if (isSkipped(departure, feed.skips)) continue;

          resultsSubarray.push(departure);
        }
      }
    }

    return {
      feeds: results.map((x) => ({
        departures: x.map((y) => toApiResult(ctx.app, y)),
      })),
      invalidFilterTokens: collectInvalidFilterTokens(compiledFilters),
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

function ensureValidFeedFilters<CustomContextType>(
  app: Corequery<CustomContextType>,
  feeds: DeparturesV0ApiFeedArgs[],
) {
  const successfullyCompiled = feeds
    .map((f) => app.departureFilters.compile(f.filterExpression))
    .filter(nonNull);

  const someInvalid = successfullyCompiled.length < feeds.length;
  if (someInvalid) throw new ArgsError("Some feed filters were invalid.");

  return successfullyCompiled;
}

function collectInvalidFilterTokens<CustomContextType>(
  compilationResults: ReturnType<
    typeof ensureValidFeedFilters<CustomContextType>
  >,
): string[] {
  return unique(
    compilationResults.flatMap((x) => Array.from(x.invalidTokens)),
  ).map((x) => x.toString());
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

function isSkipped(departure: Departure, skips: DeparturesV0ApiSkips[]) {
  return skips.some(
    (s) =>
      s.sourceId === departure.service.sourceId &&
      s.intrasourceId === departure.service.intrasourceId,
  );
}
