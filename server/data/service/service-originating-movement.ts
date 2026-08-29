import type { ServiceTimeType } from "@/server/data/service/service-time-type.js";

type ServiceOriginatingMovementFields = {
  readonly stopId: number;
  readonly originalPositionId: number | null;
  readonly updatedPositionId: number | null;

  readonly departureTimeType: ServiceTimeType;
  readonly departureTime: Temporal.Instant;
  readonly formerDepartureTime: Temporal.Instant | null;
};

export class ServiceOriginatingMovement {
  readonly stopId: number;
  readonly originalPositionId: number | null;
  readonly updatedPositionId: number | null;

  readonly departureTimeType: ServiceTimeType;
  readonly departureTime: Temporal.Instant;
  readonly formerDepartureTime: Temporal.Instant | null;

  constructor(fields: ServiceOriginatingMovementFields) {
    this.stopId = fields.stopId;
    this.originalPositionId = fields.originalPositionId;
    this.updatedPositionId = fields.updatedPositionId;

    this.departureTimeType = fields.departureTimeType;
    this.departureTime = fields.departureTime;
    this.formerDepartureTime = fields.formerDepartureTime;
  }

  with(
    fields: Partial<ServiceOriginatingMovementFields>,
  ): ServiceOriginatingMovement {
    return new ServiceOriginatingMovement({ ...this, ...fields });
  }

  get type() {
    return "originating" as const;
  }

  get isServicing() {
    return true as const;
  }

  get isNonTerminal() {
    return false as const;
  }

  get timeTypeRelevantToDeparturesAlgorithm() {
    return this.departureTimeType;
  }

  get timeRelevantToDeparturesAlgorithm() {
    return this.departureTime;
  }

  get formerTimeRelevantToDeparturesAlgorithm() {
    return this.formerDepartureTime;
  }

  get positionId() {
    return this.updatedPositionId ?? this.originalPositionId;
  }
}
