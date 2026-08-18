import type { ServiceTimeType } from "@/server/data/service/service-time-type.js";

type ServiceTerminatingMovementFields = {
  readonly stopId: number;
  readonly originalPositionId: number | null;
  readonly updatedPositionId: number | null;

  readonly arrivalTimeType: ServiceTimeType;
  readonly arrivalTime: Temporal.Instant;
  readonly formerArrivalTime: Temporal.Instant | null;
};

export class ServiceTerminatingMovement {
  readonly stopId: number;
  readonly originalPositionId: number | null;
  readonly updatedPositionId: number | null;

  readonly arrivalTimeType: ServiceTimeType;
  readonly arrivalTime: Temporal.Instant;
  readonly formerArrivalTime: Temporal.Instant | null;

  constructor(fields: ServiceTerminatingMovementFields) {
    this.stopId = fields.stopId;
    this.originalPositionId = fields.originalPositionId;
    this.updatedPositionId = fields.updatedPositionId;

    this.arrivalTimeType = fields.arrivalTimeType;
    this.arrivalTime = fields.arrivalTime;
    this.formerArrivalTime = fields.formerArrivalTime;
  }

  with(
    fields: Partial<ServiceTerminatingMovementFields>,
  ): ServiceTerminatingMovement {
    return new ServiceTerminatingMovement({ ...this, ...fields });
  }

  get type() {
    return "terminating" as const;
  }

  get isServicing() {
    return true as const;
  }

  get isNonTerminal() {
    return false as const;
  }
}
