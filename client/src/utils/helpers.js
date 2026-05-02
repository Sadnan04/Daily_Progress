/** @param {Date} [d] */
export function formatHeaderDate(d = new Date()) {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export function clampWeek(week, maxWeek = 29) {
  return Math.max(0, Math.min(maxWeek, week));
}

export function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}
