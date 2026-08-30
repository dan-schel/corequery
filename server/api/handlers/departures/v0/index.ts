import type { DEPARTURES_V0 } from "@/shared/apis/index.js";
import type { ApiContext } from "@/server/api/types.js";
import type { ArgsOf, ResultOf } from "@/shared/apis/types.js";
import type { Departure } from "@/server/data/service/departure.js";
import type { Corequery } from "@/server/corequery.js";

type ApiDeparture = ResultOf<typeof DEPARTURES_V0>["departures"][number];

export async function handle(
  ctx: ApiContext,
  args: ArgsOf<typeof DEPARTURES_V0>,
): Promise<ResultOf<typeof DEPARTURES_V0>> {
  // TODO: The v1 API should return some sort of error object.
  if (args.count < 1 || args.count > 50) return { departures: [] };

  const now = getStartOfCurrentMinute();

  const iterator = ctx.app.services.getDeparturesIterator(
    args.stopId,
    now,
    "forwards",
  );

  const results: Departure[] = [];

  while ((await iterator.peek()) != null && results.length < args.count) {
    const dep = await iterator.take();
    results.push(dep);
  }

  return {
    departures: results.map((x) => toApiResult(ctx.app, x)),
  };
}

function getStartOfCurrentMinute() {
  return Temporal.Now.zonedDateTimeISO("UTC")
    .round({
      smallestUnit: "minute",
      roundingMode: "floor",
    })
    .toInstant();
}

function toApiResult(app: Corequery, dep: Departure): ApiDeparture {
  const terminusName = app.stops.require(dep.service.termination.stopId).name;

  return {
    sourceId: dep.service.sourceId,
    intrasourceId: dep.service.intrasourceId,

    // TODO: Crawl the connections until either the chain ends, or we find a
    // servicing movement at a stop which was already serviced. Once we find
    // that repeated servicing movement, we use the previous servicing movement
    // as the "destination".
    primaryDestinationText: terminusName,
    secondaryDestinationText: null,

    lineIds: dep.service.lineIds,
    color: dep.service.getColorHexCodes(),

    isCancelled: dep.service.isCancelled,

    movement: {
      index: dep.movementIndex,
      positionId: dep.movement.positionId,
      time: dep.movement.timeRelevantToDeparturesAlgorithm.toString(),

      formerTime:
        dep.movement.formerTimeRelevantToDeparturesAlgorithm?.toString() ??
        null,
    },
  };
}
