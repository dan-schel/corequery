import type { FrontendDeparture } from "@/web/data/frontend-departure";
import { formatDuration, formatRelativeTime } from "@/web/data/time-formatting";

export type FrontendDepartureTimeStringsDelay = {
  readonly text: string;
  readonly color: "green" | "yellow" | "red";
};

type FrontendDepartureTimeStringsFields = {
  readonly primary: string;
  readonly struckout: string | null;
  readonly delay: FrontendDepartureTimeStringsDelay | null;
  readonly schedule: string | null;
};

export class FrontendDepartureTimeStrings {
  readonly primary: string;
  readonly struckout: string | null;
  readonly delay: FrontendDepartureTimeStringsDelay | null;
  readonly schedule: string | null;

  constructor(fields: FrontendDepartureTimeStringsFields) {
    this.primary = fields.primary;
    this.struckout = fields.struckout;
    this.delay = fields.delay;
    this.schedule = fields.schedule;
  }

  static build(
    departure: FrontendDeparture,
    now: Temporal.Instant,
    formatTimezone: string,
  ) {
    const { time, formerTime, timeType } = departure;

    const nowLocal = this._inFormatTimezone(now, formatTimezone);

    if (timeType === "scheduled-time" || formerTime == null) {
      const timeLocal = this._inFormatTimezone(time, formatTimezone);
      const formattedTime = formatRelativeTime(timeLocal, nowLocal);

      return new FrontendDepartureTimeStrings({
        primary: formattedTime,
        struckout: null,
        delay: null,
        schedule: null,
      });
    }

    const durationFromNow = time.since(now);
    const delay = this._getDelay(time.since(formerTime));

    if (durationFromNow.total({ unit: "minutes" }) > 60) {
      const timeLocal = this._inFormatTimezone(time, formatTimezone);
      const formattedTime = formatRelativeTime(timeLocal, nowLocal);

      return new FrontendDepartureTimeStrings({
        primary: formattedTime,
        struckout: null,
        delay,
        schedule: null,
      });
    }

    const formerDurationFromNow = formerTime.since(now);
    const primary = this._formatDurationWithNow(durationFromNow);
    const struckout = this._formatDurationWithNow(formerDurationFromNow);

    const formerTimeLocal = this._inFormatTimezone(formerTime, formatTimezone);
    const formattedFormerTime = formatRelativeTime(formerTimeLocal, nowLocal);

    return new FrontendDepartureTimeStrings({
      primary,
      struckout: primary !== struckout ? struckout : null,
      delay,
      schedule: formattedFormerTime,
    });
  }

  private static _getDelay(
    delayDuration: Temporal.Duration,
  ): FrontendDepartureTimeStringsDelay {
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
