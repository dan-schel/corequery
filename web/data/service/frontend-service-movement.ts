import type { ServiceFromApi } from "@/web/data/service/frontend-service";
import { FormattedServiceTimes } from "@/web/components/service-times/formatted-service-times";
import { formatTime } from "@/web/data/time-formatting";

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

  getFormattedScheduledTime(formatTimezone: string) {
    const { time, formerTime } = this.servicePageTime;

    const scheduledTime = formerTime ?? time;

    const plainTime = scheduledTime
      .toZonedDateTimeISO(formatTimezone)
      .toPlainTime();

    return formatTime(plainTime);
  }

  getFormattedTimes(
    isCancelled: boolean,
    now: Temporal.Instant,
    formatTimezone: string,
  ) {
    return FormattedServiceTimes.fromServiceMovement(
      this,
      isCancelled,
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
