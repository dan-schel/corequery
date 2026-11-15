import { hour24To12 } from "@dan-schel/js-utils";

function formatTime(
  input: Temporal.PlainTime,
  { includeSeconds = false }: { includeSeconds?: boolean } = {},
) {
  const hour12 = hour24To12(input.hour);
  const hrs = hour12.hour.toFixed();
  const mins = input.minute.toFixed().padStart(2, "0");
  const half = hour12.half;
  if (includeSeconds) {
    const secs = input.second.toFixed().padStart(2, "0");
    return `${hrs}:${mins}:${secs}${half}`;
  }
  return `${hrs}:${mins}${half}`;
}

export function formatDuration(
  input: Temporal.Duration,
  { suppressAgo = false }: { suppressAgo?: boolean } = {},
) {
  const isNegative = input.sign === -1;
  const duration = input
    .abs()
    .round({ largestUnit: "day", smallestUnit: "second" });
  const { days: d, hours: h, minutes: m, seconds: s } = duration;

  const components = [];
  if (d !== 0) {
    components.push(d === 1 ? "1 day" : `${d.toFixed()} days`);
  }
  if (h !== 0) {
    components.push(h === 1 ? "1 hr" : `${h.toFixed()} hrs`);
  }
  if (m !== 0) {
    components.push(m === 1 ? "1 min" : `${m.toFixed()} mins`);
  }
  if (s !== 0 || components.length === 0) {
    components.push(s === 1 ? "1 sec" : `${s.toFixed()} secs`);
  }

  const addAgo = isNegative && !suppressAgo;
  return components.join(", ") + (addAgo ? " ago" : "");
}

function formatDate(
  date: Temporal.PlainDate,
  { includeYear = false }: { includeYear?: boolean } = {},
) {
  const dow = date.toLocaleString("en-US", { weekday: "short" });
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${dow}, ${date.day.toFixed()} ${month}${
    includeYear ? ` ${date.year.toFixed()}` : ""
  }`;
}

export function formatRelativeTime(
  input: Temporal.PlainDateTime,
  now: Temporal.PlainDateTime,
  { suppressEarlierToday = false }: { suppressEarlierToday?: boolean } = {},
) {
  const inputTime = input.toPlainTime();
  const inputDate = input.toPlainDate();
  const nowTime = now.toPlainTime();
  const nowDate = now.toPlainDate();

  const timeString = formatTime(inputTime);
  const dayDiff = inputDate.since(nowDate).days;

  if (dayDiff === 0) {
    const isEarlierToday = Temporal.PlainTime.compare(inputTime, nowTime) <= 0;
    return isEarlierToday && !suppressEarlierToday
      ? `${timeString} earlier today`
      : timeString;
  } else if (dayDiff === 1) {
    return inputTime.hour <= 2
      ? `${timeString} tonight`
      : `${timeString} tomorrow`;
  } else if (dayDiff === -1) {
    return `${timeString} yesterday`;
  } else if (dayDiff > 1 && dayDiff < 7) {
    const dow = inputDate.toLocaleString("en-US", { weekday: "long" });
    return `${timeString} ${dow}`;
  } else if (dayDiff < -1 && dayDiff >= -7) {
    const dow = inputDate.toLocaleString("en-US", { weekday: "long" });
    // TODO: This could be confusing, e.g. if today is Wednesday it will call
    // two days ago "last Monday" which could be confused for the week before.
    // Maybe consider "[time] this past [weekday]"?
    return `${timeString} last ${dow}`;
  } else {
    return `${timeString} (${formatDate(inputDate)})`;
  }
}
