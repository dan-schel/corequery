import type { ServiceTimeType } from "@/server/data/service/service-time-type.js";

type ServiceRegularMovementFields = {
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

export class ServiceRegularMovement {
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

  constructor(fields: ServiceRegularMovementFields) {
    this.stopId = fields.stopId;
    this.originalPositionId = fields.originalPositionId;
    this.updatedPositionId = fields.updatedPositionId;

    this.arrivalTimeType = fields.arrivalTimeType;
    this.arrivalTime = fields.arrivalTime;
    this.formerArrivalTime = fields.formerArrivalTime;

    this.departureTimeType = fields.departureTimeType;
    this.departureTime = fields.departureTime;
    this.formerDepartureTime = fields.formerDepartureTime;

    this.picksUp = fields.picksUp;
    this.dropsOff = fields.dropsOff;
  }

  with(fields: Partial<ServiceRegularMovementFields>): ServiceRegularMovement {
    return new ServiceRegularMovement({ ...this, ...fields });
  }

  get type() {
    return "regular" as const;
  }

  get isServicing() {
    return true as const;
  }

  get isNonTerminal() {
    return true as const;
  }
}
