import type { ServiceFromApi } from "@/web/data/service/frontend-service";

type ServiceMovementFromApi = ServiceFromApi["movements"][number];

type FrontendServiceMovementFields = {
  readonly stopId: number;
  readonly positionId: number | null;
  readonly arrivalTime: Temporal.Instant | null;
  readonly formerArrivalTime: Temporal.Instant | null;
  readonly departureTime: Temporal.Instant | null;
  readonly formerDepartureTime: Temporal.Instant | null;
};

export class FrontendServiceMovement {
  readonly stopId: number;
  readonly positionId: number | null;
  readonly arrivalTime: Temporal.Instant | null;
  readonly formerArrivalTime: Temporal.Instant | null;
  readonly departureTime: Temporal.Instant | null;
  readonly formerDepartureTime: Temporal.Instant | null;

  constructor(fields: FrontendServiceMovementFields) {
    this.stopId = fields.stopId;
    this.positionId = fields.positionId;
    this.arrivalTime = fields.arrivalTime;
    this.formerArrivalTime = fields.formerArrivalTime;
    this.departureTime = fields.departureTime;
    this.formerDepartureTime = fields.formerDepartureTime;
  }

  get isPassing() {
    return this.arrivalTime == null && this.departureTime == null;
  }

  static wrap(movement: ServiceMovementFromApi) {
    return new FrontendServiceMovement({
      stopId: movement.stopId,
      positionId: movement.positionId,
      arrivalTime:
        movement.arrivalTime != null
          ? Temporal.Instant.from(movement.arrivalTime)
          : null,
      formerArrivalTime:
        movement.formerArrivalTime != null
          ? Temporal.Instant.from(movement.formerArrivalTime)
          : null,
      departureTime:
        movement.departureTime != null
          ? Temporal.Instant.from(movement.departureTime)
          : null,
      formerDepartureTime:
        movement.formerDepartureTime != null
          ? Temporal.Instant.from(movement.formerDepartureTime)
          : null,
    });
  }

  static wrapAll(movements: readonly ServiceMovementFromApi[]) {
    return movements.map((movement) => FrontendServiceMovement.wrap(movement));
  }
}
