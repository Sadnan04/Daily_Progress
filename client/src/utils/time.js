export function getUserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function formatNowLong(now, { timeZone, hour12 }) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone,
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12
    }).format(now);
  } catch {
    return now.toLocaleString();
  }
}

export function getHourInTimeZone(now, timeZone) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      hour12: false
    }).formatToParts(now);
    const h = parts.find((p) => p.type === "hour")?.value;
    return Number(h ?? now.getHours());
  } catch {
    return now.getHours();
  }
}

export function getYmdInTimeZone(now, timeZone) {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(now);
    const y = parts.find((p) => p.type === "year")?.value;
    const m = parts.find((p) => p.type === "month")?.value;
    const d = parts.find((p) => p.type === "day")?.value;
    return `${y}-${m}-${d}`;
  } catch {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
}

export function isSameLocalDay(a, b, timeZone) {
  return getYmdInTimeZone(a, timeZone) === getYmdInTimeZone(b, timeZone);
}

function getWeekdayIndexMon0(now, timeZone) {
  try {
    const weekday = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short"
    }).format(now);
    const map = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
    return map[weekday] ?? ((now.getDay() + 6) % 7);
  } catch {
    return (now.getDay() + 6) % 7;
  }
}

export function startOfWeekMonday(now, timeZone) {
  // Create a date in local time, then shift by weekday index in the chosen TZ.
  const d = new Date(now);
  d.setHours(12, 0, 0, 0); // noon to reduce DST edge risks
  const idx = getWeekdayIndexMon0(now, timeZone);
  d.setDate(d.getDate() - idx);
  return d;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function diffCalendarDays(a, b) {
  // b - a in whole calendar days, using UTC midnight to avoid DST issues
  const au = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const bu = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((bu - au) / (1000 * 60 * 60 * 24));
}

