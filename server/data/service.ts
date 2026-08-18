import type { Color } from "@/server/data/color.js";
import type { Tags } from "@/server/data/tags.js";

type Departure = {
  readonly service: Service;
  readonly movementIndex: number;
};

type ServiceLiveDataType = "scheduled" | "updated" | "added";

type Service = {
  readonly sourceId: string;
  readonly intrasourceId: string;

  readonly lineIds: readonly number[];
  readonly tags: Tags;
  readonly color: Color | null;

  readonly liveDataType: ServiceLiveDataType;
  readonly movements: ServiceMovement;
  readonly isCancelled: boolean;

  // Can have multiple, e.g. a previous service and a next service.
  readonly connections: readonly ServiceConnection[];
};

type ServiceMovement =
  | ServiceOriginatingMovement
  | ServiceRegularMovement
  | ServiceTerminatingMovement
  | ServicePassingMovement;

type ServiceTimeType = "scheduled" | "live-provided" | "live-interpolated";

type ServiceOriginatingMovement = {
  readonly stopId: number;
  readonly originalPositionId: number | null;
  readonly updatedPositionId: number | null;

  readonly departureTimeType: ServiceTimeType;
  readonly departureTime: Temporal.Instant;
  readonly formerDepartureTime: Temporal.Instant | null;
};

type ServiceRegularMovement = {
  readonly stopId: number;
  readonly originalPositionId: number | null;
  readonly updatedPositionId: number | null;

  readonly arrivalTimeType: ServiceTimeType;
  readonly arrivalTime: Temporal.Instant;
  readonly formerArrivalTime: Temporal.Instant | null;

  readonly departureTimeType: ServiceTimeType;
  readonly departureTime: Temporal.Instant;
  readonly formerDepartureTime: Temporal.Instant | null;

  readonly picksUp: boolean;
  readonly dropsOff: boolean;
};

type ServiceTerminatingMovement = {
  readonly stopId: number;
  readonly originalPositionId: number | null;
  readonly updatedPositionId: number | null;

  readonly arrivalTimeType: ServiceTimeType;
  readonly arrivalTime: Temporal.Instant;
  readonly formerArrivalTime: Temporal.Instant | null;
};

type ServicePassingMovement = {
  readonly stopId: number;
};

// If "entire-vehicle-forms-next-service", then corequery knows it should lookup
// the next service repeatedly until it finds a serviced stop in common, so that
// it can show the final (useful) destination of the service.
type ServiceConnectionType = "entire-vehicle-forms-next-service" | "other";

type ServiceConnection = {
  readonly connectionType: ServiceConnectionType;
  readonly connectingServiceSourceId: string;
  readonly connectingServiceIntrasourceId: string;

  readonly fromMovementIndex: number;
  readonly toMovementIndex: number;
};
