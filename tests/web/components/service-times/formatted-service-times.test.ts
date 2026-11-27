import "temporal-polyfill/global";
import { describe, expect, it } from "vitest";
import { FormattedServiceTimes } from "@/web/components/service-times/formatted-service-times";

describe("FormattedServiceTimes", () => {
  describe("fromTimes", () => {
    it('formats a departure less than a minute away as "Now"', () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T10:00:30+11:00"),
        formerTime: null,
        timeType: "scheduled-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "Now",
        struckout: null,
        delay: null,
        schedule: "10:00am",
        showLiveIcon: false,
        showAsterisk: false,
      });
    });

    it("formats a departure one minute away as a duration", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T10:01:00+11:00"),
        formerTime: null,
        timeType: "scheduled-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "1 min",
        struckout: null,
        delay: null,
        schedule: "10:01am",
        showLiveIcon: false,
        showAsterisk: false,
      });
    });

    it("formats a departure exactly an hour away as a duration", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T11:00:00+11:00"),
        formerTime: null,
        timeType: "scheduled-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "1 hr",
        struckout: null,
        delay: null,
        schedule: "11:00am",
        showLiveIcon: false,
        showAsterisk: false,
      });
    });

    it("uses the scheduled time when the departure is more than an hour away", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T11:01:00+11:00"),
        formerTime: null,
        timeType: "scheduled-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "11:01am",
        struckout: null,
        delay: null,
        schedule: null,
        showLiveIcon: false,
        showAsterisk: false,
      });
    });

    it("ignores `formerTime` for a scheduled departure", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T10:20:00+11:00"),
        formerTime: Temporal.Instant.from("2026-11-28T10:10:00+11:00"),
        timeType: "scheduled-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "20 mins",
        struckout: null,
        delay: null,
        schedule: "10:20am",
        showLiveIcon: false,
        showAsterisk: false,
      });
    });

    it("uses a relative local time when durations are disabled", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T10:05:00+11:00"),
        formerTime: null,
        timeType: "scheduled-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: true,
      });

      expect(result).toEqual({
        primary: "10:05am",
        struckout: null,
        delay: null,
        schedule: null,
        showLiveIcon: false,
        showAsterisk: false,
      });
    });

    it("uses tonight for a shortly-after-midnight time in the local timezone", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-29T00:10:00+11:00"),
        formerTime: null,
        timeType: "scheduled-time",
        now: Temporal.Instant.from("2026-11-28T23:50:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: true,
      });

      expect(result).toEqual({
        primary: "12:10am tonight",
        struckout: null,
        delay: null,
        schedule: null,
        showLiveIcon: false,
        showAsterisk: false,
      });
    });

    it("shows a live delay and former time when both times are soon", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T10:20:00+11:00"),
        formerTime: Temporal.Instant.from("2026-11-28T10:10:00+11:00"),
        timeType: "provided-live-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "20 mins",
        struckout: "10 mins",
        delay: { text: "10 mins late", color: "yellow" },
        schedule: "10:10am",
        showLiveIcon: true,
        showAsterisk: false,
      });
    });

    it("formats an early live time", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T10:15:30+11:00"),
        formerTime: Temporal.Instant.from("2026-11-28T10:20:00+11:00"),
        timeType: "provided-live-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "15 mins, 30 secs",
        struckout: "20 mins",
        delay: { text: "4 mins, 30 secs early", color: "green" },
        schedule: "10:20am",
        showLiveIcon: true,
        showAsterisk: false,
      });
    });

    it("formats an on-time live time", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T10:20:00+11:00"),
        formerTime: Temporal.Instant.from("2026-11-28T10:20:00+11:00"),
        timeType: "provided-live-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "20 mins",
        struckout: null,
        delay: { text: "On time", color: "green" },
        schedule: "10:20am",
        showLiveIcon: true,
        showAsterisk: false,
      });
    });

    it("uses green for a delay of less than three minutes", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T10:22:59+11:00"),
        formerTime: Temporal.Instant.from("2026-11-28T10:20:00+11:00"),
        timeType: "provided-live-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "22 mins, 59 secs",
        struckout: "20 mins",
        delay: { text: "2 mins, 59 secs late", color: "green" },
        schedule: "10:20am",
        showLiveIcon: true,
        showAsterisk: false,
      });
    });

    it("uses yellow for a delay of three minutes", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T10:23:00+11:00"),
        formerTime: Temporal.Instant.from("2026-11-28T10:20:00+11:00"),
        timeType: "provided-live-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "23 mins",
        struckout: "20 mins",
        delay: { text: "3 mins late", color: "yellow" },
        schedule: "10:20am",
        showLiveIcon: true,
        showAsterisk: false,
      });
    });

    it("uses red for a delay of fifteen minutes", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T10:35:00+11:00"),
        formerTime: Temporal.Instant.from("2026-11-28T10:20:00+11:00"),
        timeType: "provided-live-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "35 mins",
        struckout: "20 mins",
        delay: { text: "15 mins late", color: "red" },
        schedule: "10:20am",
        showLiveIcon: true,
        showAsterisk: false,
      });
    });

    it("marks interpolated live times with an asterisk", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T10:20:00+11:00"),
        formerTime: Temporal.Instant.from("2026-11-28T10:10:00+11:00"),
        timeType: "interpolated-live-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "20 mins",
        struckout: "10 mins",
        delay: { text: "10 mins late", color: "yellow" },
        schedule: "10:10am",
        showLiveIcon: true,
        showAsterisk: true,
      });
    });

    it("does not show live details when a live time has no former time", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T10:20:00+11:00"),
        formerTime: null,
        timeType: "provided-live-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "20 mins",
        struckout: null,
        delay: null,
        schedule: "10:20am",
        showLiveIcon: false,
        showAsterisk: false,
      });
    });

    it("uses local clock times rather than durations for live times over an hour away", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T11:08:00+11:00"),
        formerTime: Temporal.Instant.from("2026-11-28T11:05:00+11:00"),
        timeType: "provided-live-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "11:08am",
        struckout: "11:05am",
        delay: { text: "3 mins late", color: "yellow" },
        schedule: null,
        showLiveIcon: true,
        showAsterisk: false,
      });
    });

    it("strikes out only the clock time when a delayed departure crosses midnight", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-29T00:08:00+11:00"),
        formerTime: Temporal.Instant.from("2026-11-29T00:05:00+11:00"),
        timeType: "provided-live-time",
        now: Temporal.Instant.from("2026-11-28T23:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: false,
      });

      expect(result).toEqual({
        primary: "12:08am tonight",
        struckout: "12:05am",
        delay: { text: "3 mins late", color: "yellow" },
        schedule: null,
        showLiveIcon: true,
        showAsterisk: false,
      });
    });

    it("uses relative clock times for live times when durations are disabled", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-28T10:20:00+11:00"),
        formerTime: Temporal.Instant.from("2026-11-28T10:10:00+11:00"),
        timeType: "provided-live-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: true,
      });

      expect(result).toEqual({
        primary: "10:20am",
        struckout: "10:10am",
        delay: { text: "10 mins late", color: "yellow" },
        schedule: null,
        showLiveIcon: true,
        showAsterisk: false,
      });
    });

    it("formats a departure tonight", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-29T01:00:00+11:00"),
        formerTime: null,
        timeType: "scheduled-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: true,
      });

      expect(result).toEqual({
        primary: "1:00am tonight",
        struckout: null,
        delay: null,
        schedule: null,
        showLiveIcon: false,
        showAsterisk: false,
      });
    });

    it("formats a departure tomorrow", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-29T03:00:00+11:00"),
        formerTime: null,
        timeType: "scheduled-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: true,
      });

      expect(result).toEqual({
        primary: "3:00am tomorrow",
        struckout: null,
        delay: null,
        schedule: null,
        showLiveIcon: false,
        showAsterisk: false,
      });
    });

    it("formats a departure by weekday", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-30T10:00:00+11:00"),
        formerTime: null,
        timeType: "scheduled-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: true,
      });

      expect(result).toEqual({
        primary: "10:00am Monday",
        struckout: null,
        delay: null,
        schedule: null,
        showLiveIcon: false,
        showAsterisk: false,
      });
    });

    it("formats a departure from yesterday", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-27T10:00:00+11:00"),
        formerTime: null,
        timeType: "scheduled-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: true,
      });

      expect(result).toEqual({
        primary: "10:00am yesterday",
        struckout: null,
        delay: null,
        schedule: null,
        showLiveIcon: false,
        showAsterisk: false,
      });
    });

    it("formats a departure from earlier in the week", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-11-25T10:00:00+11:00"),
        formerTime: null,
        timeType: "scheduled-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: true,
      });

      expect(result).toEqual({
        primary: "10:00am last Wednesday",
        struckout: null,
        delay: null,
        schedule: null,
        showLiveIcon: false,
        showAsterisk: false,
      });
    });

    it("formats a departure with its date when it is more than a week away", () => {
      const result = FormattedServiceTimes.fromTimes({
        time: Temporal.Instant.from("2026-12-08T10:00:00+11:00"),
        formerTime: null,
        timeType: "scheduled-time",
        now: Temporal.Instant.from("2026-11-28T10:00:00+11:00"),
        formatTimezone: "Australia/Melbourne",
        neverUseDurations: true,
      });

      expect(result).toEqual({
        primary: "10:00am (Tue, 8 Dec)",
        struckout: null,
        delay: null,
        schedule: null,
        showLiveIcon: false,
        showAsterisk: false,
      });
    });
  });
});
