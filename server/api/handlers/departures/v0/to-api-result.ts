import type { DeparturesV0ApiDeparture } from "@/server/api/handlers/departures/v0/index.js";
import type { Corequery } from "@/server/corequery.js";
import type { Departure } from "@/server/data/index.js";

export function toApiResult<CustomContextType>(
  app: Corequery<CustomContextType>,
  departure: Departure,
): DeparturesV0ApiDeparture {
  const { service, movement } = departure;
  const terminusName = app.stops.require(service.termination.stopId).name;

  return {
    sourceId: service.sourceId,
    intrasourceId: service.intrasourceId,

    // TODO: Crawl the connections until either the chain ends, or we find a
    // servicing movement at a stop which was already serviced. Once we find
    // that repeated servicing movement, we use the previous servicing movement
    // as the "destination".
    primaryDestinationText: terminusName,
    secondaryDestinationText: null,

    lineIds: service.lineIds,
    color: service.getColorHexCodes(),

    isCancelled: service.isCancelled,

    movement: {
      index: departure.movementIndex,
      positionId: movement.currentPositionId,
      time: movement.timeRelevantToDeparturesAlgorithm.toString(),

      formerTime:
        movement.formerTimeRelevantToDeparturesAlgorithm?.toString() ?? null,
    },
  };
}
