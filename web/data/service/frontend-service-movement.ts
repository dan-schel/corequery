import type { ServiceFromApi } from "@/web/data/service/frontend-service";
import { FrontendServiceMovementTimeStrings } from "@/web/data/service/frontend-service-movement-time-strings";

type ServiceMovementFromApi = ServiceFromApi["movements"][number];

export type FrontendServiceTimeType =
  "scheduled-time" | "provided-live-time" | "interpolated-live-time";

type FrontendServiceTime = {
  readonly timeType: FrontendServiceTimeType;
  readonly time: Temporal.Instant;
  readonly formerTime: Temporal.Instant | null;
};

type FrontendServiceMovementFields = {
  readonly stopId: number;
  readonly positionId: number | null;
  readonly arrival: FrontendServiceTime | null;
  readonly departure: FrontendServiceTime | null;
};

export class FrontendServiceMovement {
  readonly stopId: number;
  readonly positionId: number | null;
  readonly arrival: FrontendServiceTime | null;
  readonly departure: FrontendServiceTime | null;

  constructor(fields: FrontendServiceMovementFields) {
    this.stopId = fields.stopId;
    this.positionId = fields.positionId;
    this.arrival = fields.arrival;
    this.departure = fields.departure;
  }

  get isPassing() {
    return this.arrival == null && this.departure == null;
  }

  get servicePageTime() {
    const time = this.departure ?? this.arrival;
    if (time == null) {
      throw new Error("servicePageTime called on passing movement.");
    }

    return time;
  }

  getTimeStrings(now: Temporal.Instant, formatTimezone: string) {
    return FrontendServiceMovementTimeStrings.fromServiceMovement(
      this,
      now,
      formatTimezone,
    );
  }

  static wrap(movement: ServiceMovementFromApi) {
    return new FrontendServiceMovement({
      stopId: movement.stopId,
      positionId: movement.positionId,
      arrival: FrontendServiceMovement._wrapTime(movement.arrival),
      departure: FrontendServiceMovement._wrapTime(movement.departure),
    });
  }

  static wrapAll(movements: readonly ServiceMovementFromApi[]) {
    return movements.map((movement) => FrontendServiceMovement.wrap(movement));
  }

  private static _wrapTime(time: ServiceMovementFromApi["arrival"]) {
    if (time == null) return null;

    return {
      timeType: time.timeType,
      time: Temporal.Instant.from(time.time),
      formerTime:
        time.formerTime != null ? Temporal.Instant.from(time.formerTime) : null,
    };
  }
}
