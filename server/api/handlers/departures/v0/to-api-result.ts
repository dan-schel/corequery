import type { DeparturesV0ApiDeparture } from "@/server/api/handlers/departures/v0/index.js";
import type { Corequery } from "@/server/corequery.js";
import type { Departure } from "@/server/data/index.js";

export function toApiResult<CustomContextType>(
  app: Corequery<CustomContextType>,
  dep: Departure,
): DeparturesV0ApiDeparture {
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
      positionId: dep.movement.currentPositionId,
      time: dep.movement.timeRelevantToDeparturesAlgorithm.toString(),

      formerTime:
        dep.movement.formerTimeRelevantToDeparturesAlgorithm?.toString() ??
        null,
    },
  };
}
