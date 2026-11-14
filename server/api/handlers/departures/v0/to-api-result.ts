import type { DeparturesV0ApiDeparture } from "@/server/api/handlers/departures/v0/index.js";
import type { Corequery } from "@/server/corequery.js";
import type { Departure } from "@/server/data/index.js";

export async function toApiResult<CustomContextType>(
  app: Corequery<CustomContextType>,
  departure: Departure,
): Promise<DeparturesV0ApiDeparture> {
  const { service, movement } = departure;

  const destinationTexts = await computeDestinationTexts(app, service);

  return {
    sourceId: service.sourceId,
    intrasourceId: service.intrasourceId,

    primaryDestinationText: destinationTexts.primary,
    secondaryDestinationText: destinationTexts.secondary,

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

async function computeDestinationTexts<CustomContextType>(
  app: Corequery<CustomContextType>,
  service: Departure["service"],
) {
  const myTerminus = app.stops.require(service.termination.stopId).name;

  const nextService = await getNextServiceIfApplicable(app, service);
  if (nextService == null) {
    return { primary: myTerminus, secondary: null };
  }

  // TODO: Crawl the connections until either the chain ends, or we find a
  // servicing movement at a stop which was already serviced. Once we find
  // that repeated servicing movement, we use the previous servicing movement
  // as the "destination".
  const nextTerminus = app.stops.require(nextService.termination.stopId).name;

  return {
    primary: nextTerminus,
    secondary: `via ${myTerminus}`,
  };
}

async function getNextServiceIfApplicable<CustomContextType>(
  app: Corequery<CustomContextType>,
  service: Departure["service"],
) {
  if (service.nextServiceOfEntireVehicle == null) return null;

  const connection = service.nextServiceOfEntireVehicle;
  const sourceId = connection.direction;
  const intrasourceId = connection.otherServiceIntrasourceId;
  const other = await app.services.requireService(sourceId, intrasourceId);
  return other.isCancelled ? null : other;
}
