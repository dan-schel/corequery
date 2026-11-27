import type { FrontendDeparture } from "@/web/data/departure/frontend-departure";
import type {
  FrontendServiceMovement,
  FrontendServiceTimeType,
} from "@/web/data/service/frontend-service-movement";
import {
  formatDuration,
  formatRelativeTime,
  formatTime,
} from "@/web/data/time-formatting";

export type FormattedServiceDelay = {
  readonly text: string;
  readonly color: "green" | "yellow" | "red";
};

type FormattedServiceTimesFields = {
  readonly primary: string | null;
  readonly struckout: string | null;
  readonly delay: FormattedServiceDelay | null;
  readonly schedule: string | null;
  readonly showLiveIcon: boolean;
  readonly showAsterisk: boolean;
};

export class FormattedServiceTimes {
  readonly primary: string | null;
  readonly struckout: string | null;
  readonly delay: FormattedServiceDelay | null;
  readonly schedule: string | null;
  readonly showLiveIcon: boolean;
  readonly showAsterisk: boolean;

  constructor(fields: FormattedServiceTimesFields) {
    this.primary = fields.primary;
    this.struckout = fields.struckout;
    this.delay = fields.delay;
    this.schedule = fields.schedule;
    this.showLiveIcon = fields.showLiveIcon;
    this.showAsterisk = fields.showAsterisk;
  }

  asCancelled() {
    return new FormattedServiceTimes({
      primary: null,
      struckout: this.primary,
      delay: null,
      schedule: null,
      showLiveIcon: false,
      showAsterisk: false,
    });
  }

  static fromDeparture(
    departure: FrontendDeparture,
    now: Temporal.Instant,
    formatTimezone: string,
  ) {
    const { time, formerTime, timeType } = departure;
    const r = this._fromTimes(time, formerTime, timeType, now, formatTimezone);
    return departure.isCancelled ? r.asCancelled() : r;
  }

  static fromServiceMovement(
    movement: FrontendServiceMovement,
    isCancelled: boolean,
    now: Temporal.Instant,
    formatTimezone: string,
  ) {
    const { time, formerTime, timeType } = movement.servicePageTime;
    const r = this._fromTimes(time, formerTime, timeType, now, formatTimezone, {
      neverUseDurations: true,
    });
    return isCancelled ? r.asCancelled() : r;
  }

  private static _fromTimes(
    time: Temporal.Instant,
    formerTime: Temporal.Instant | null,
    timeType: FrontendServiceTimeType,
    now: Temporal.Instant,
    formatTimezone: string,
    { neverUseDurations = false }: { neverUseDurations?: boolean } = {},
  ) {
    const nowLocal = this._inFormatTimezone(now, formatTimezone);
    const timeLocal = this._inFormatTimezone(time, formatTimezone);
    const timeStr = formatRelativeTime(timeLocal, nowLocal, {
      suppressEarlierToday: true,
    });
    const durationFromNow = time.since(now);
    const primary = this._formatDurationWithNow(durationFromNow);
    const departsSoon = durationFromNow.total({ unit: "minutes" }) <= 60;
    const useDuration = departsSoon && !neverUseDurations;

    if (timeType === "scheduled-time" || formerTime == null) {
      return new FormattedServiceTimes({
        primary: useDuration ? primary : timeStr,
        struckout: null,
        delay: null,
        schedule: useDuration ? null : timeStr,
        showLiveIcon: false,
        showAsterisk: false,
      });
    }

    const formerTimeLocal = this._inFormatTimezone(formerTime, formatTimezone);
    const formerTimeStr = formatRelativeTime(formerTimeLocal, nowLocal, {
      suppressEarlierToday: true,
    });

    const delay = this._getDelay(time.since(formerTime));

    const showAsterisk = timeType === "interpolated-live-time";

    if (!useDuration) {
      // If a departure just after midnight is delayed, but it's still an hour
      // before midnight, I'd prefer it to show "~~12:05am~~ 12:08am tonight"
      // rather than "~~12:05am tonight~~ 12:08am tonight".
      const formerTimeStrShort = formatTime(formerTimeLocal.toPlainTime());

      return new FormattedServiceTimes({
        primary: timeStr,

        // `timeStr !== formerTimeStr` is intentional, because
        // `formerTimeStrShort` might differ from `formerTimeStr`, even though
        // `timeStr` and `formerTimeStr` are the same.
        struckout: timeStr !== formerTimeStr ? formerTimeStrShort : null,

        delay,
        schedule: null,
        showLiveIcon: true,
        showAsterisk,
      });
    }

    const formerDurationFromNow = formerTime.since(now);
    const struckout = this._formatDurationWithNow(formerDurationFromNow);

    return new FormattedServiceTimes({
      primary,
      struckout: primary !== struckout ? struckout : null,
      delay,
      schedule: formerTimeStr,
      showLiveIcon: true,
      showAsterisk,
    });
  }

  private static _getDelay(
    delayDuration: Temporal.Duration,
  ): FormattedServiceDelay {
    const minutes = delayDuration.total({ unit: "minutes" });
    const formatted = formatDuration(delayDuration, { suppressAgo: true });

    if (minutes < 0) {
      return {
        text: `${formatted} early`,
        color: "green",
      };
    } else if (minutes === 0) {
      return {
        text: `On time`,
        color: "green",
      };
    } else {
      return {
        text: `${formatted} late`,
        color: this._getDelayColor(minutes),
      };
    }
  }

  private static _getDelayColor(minsLate: number) {
    if (minsLate < 3) {
      return "green";
    } else if (minsLate < 15) {
      return "yellow";
    } else {
      return "red";
    }
  }

  private static _formatDurationWithNow(duration: Temporal.Duration) {
    if (duration.sign >= 0 && duration.total({ unit: "minutes" }) < 1) {
      return "Now";
    } else {
      return formatDuration(duration);
    }
  }

  private static _inFormatTimezone(
    instant: Temporal.Instant,
    formatTimezone: string,
  ) {
    return instant.toZonedDateTimeISO(formatTimezone).toPlainDateTime();
  }
}
