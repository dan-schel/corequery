import type { SERVICE_V0 } from "@/shared/apis/index.js";
import type { ApiContext } from "@/server/api/types.js";
import type { ArgsOf, ResultOf } from "@/shared/apis/types.js";
import type { ServiceMovement } from "@/server/data/index.js";
import { assertNever } from "@dan-schel/js-utils";

type ApiMovement = NonNullable<
  ResultOf<typeof SERVICE_V0>["service"]
>["movements"][number];

export async function handle(
  ctx: ApiContext,
  args: ArgsOf<typeof SERVICE_V0>,
): Promise<ResultOf<typeof SERVICE_V0>> {
  const service = await ctx.app.services.getService(
    args.sourceId,
    args.intrasourceId,
  );

  if (service == null) return { service: null };

  const lastStop = ctx.app.stops.require(service.termination.stopId).name;

  return {
    service: {
      sourceId: service.sourceId,
      intrasourceId: service.intrasourceId,

      primaryDestinationText: lastStop,

      lineIds: service.lineIds,
      color: service.getColorHexCodes(),

      isCancelled: service.isCancelled,

      movements: service.movements.map((x) => toApiMovement(x)),
    },
  };
}

function toApiMovement(x: ServiceMovement): ApiMovement {
  if (x.type === "originating") {
    return {
      stopId: x.stopId,
      positionId: x.positionId,
      arrivalTime: null,
      formerArrivalTime: null,
      departureTime: x.departureTime.toString(),
      formerDepartureTime: x.formerDepartureTime?.toString() ?? null,
    };
  } else if (x.type === "regular") {
    return {
      stopId: x.stopId,
      positionId: x.positionId,
      arrivalTime: x.arrivalTime.toString(),
      formerArrivalTime: x.formerArrivalTime?.toString() ?? null,
      departureTime: x.departureTime.toString(),
      formerDepartureTime: x.formerDepartureTime?.toString() ?? null,
    };
  } else if (x.type === "terminating") {
    return {
      stopId: x.stopId,
      positionId: x.positionId,
      arrivalTime: x.arrivalTime.toString(),
      formerArrivalTime: x.formerArrivalTime?.toString() ?? null,
      departureTime: null,
      formerDepartureTime: null,
    };
  } else if (x.type === "passing") {
    return {
      stopId: x.stopId,
      positionId: null,
      arrivalTime: null,
      formerArrivalTime: null,
      departureTime: null,
      formerDepartureTime: null,
    };
  } else {
    assertNever(x);
  }
}
