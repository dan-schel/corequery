import type { SERVICE_V0 } from "@/shared/apis/index.js";
import type {
  ApiContext,
  ServerFodaSyncedResultOf,
} from "@/server/api/types.js";
import type { ServerArgsOf, ServerResultOf } from "@/server/api/types.js";
import type { ServiceMovement } from "@/server/data/index.js";
import { assertNever } from "@dan-schel/js-utils";
import { applyFodaSyncedResult } from "@/server/api/handlers/foda-synced-handler.js";

type ApiMovement = NonNullable<
  ServerFodaSyncedResultOf<typeof SERVICE_V0>["service"]
>["movements"][number];

export async function handle<CustomContextType>(
  ctx: ApiContext<CustomContextType>,
  args: ServerArgsOf<typeof SERVICE_V0>,
): Promise<ServerResultOf<typeof SERVICE_V0>> {
  return applyFodaSyncedResult(ctx, async () => {
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
  });
}

function toApiMovement(x: ServiceMovement): ApiMovement {
  if (x.type === "originating") {
    return {
      stopId: x.stopId,
      positionId: x.currentPositionId,
      arrival: null,
      departure: {
        timeType: x.departureTimeType,
        time: x.departureTime.toString(),
        formerTime: x.formerDepartureTime?.toString() ?? null,
      },
    };
  } else if (x.type === "regular") {
    return {
      stopId: x.stopId,
      positionId: x.currentPositionId,
      arrival: {
        timeType: x.arrivalTimeType,
        time: x.arrivalTime.toString(),
        formerTime: x.formerArrivalTime?.toString() ?? null,
      },
      departure: {
        timeType: x.departureTimeType,
        time: x.departureTime.toString(),
        formerTime: x.formerDepartureTime?.toString() ?? null,
      },
    };
  } else if (x.type === "terminating") {
    return {
      stopId: x.stopId,
      positionId: x.currentPositionId,
      arrival: {
        timeType: x.arrivalTimeType,
        time: x.arrivalTime.toString(),
        formerTime: x.formerArrivalTime?.toString() ?? null,
      },
      departure: null,
    };
  } else if (x.type === "passing") {
    return {
      stopId: x.stopId,
      positionId: null,
      arrival: null,
      departure: null,
    };
  } else {
    assertNever(x);
  }
}
