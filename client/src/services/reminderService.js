const LABELS = {
  morning_study: "Morning study",
  coding_session: "Coding session",
  project_time: "Project work",
  night_review: "Night review"
};

export function reminderBody(label) {
  return `Time for ${label.toLowerCase()} 🚀 Stay consistent!`;
}

/** Polls user.settings.reminders against current time (Browser Notification API). */
export function startReminderScheduler(getUser, intervalMs = 30000) {
  const fired = {};

  function tick() {
    const user = getUser();
    if (!user?.settings?.reminders || user.settings.notificationsEnabled === false) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;

    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const dayKey = now.toISOString().slice(0, 10);

    Object.entries(user.settings.reminders).forEach(([id, cfg]) => {
      if (!cfg?.enabled || cfg.time !== hhmm) return;
      const lock = `${dayKey}-${id}-${hhmm}`;
      if (fired[lock]) return;
      fired[lock] = true;
      const label = LABELS[id] || id;
      new Notification("Daily Progress Tracker", { body: reminderBody(label) });
    });
  }

  const id = setInterval(tick, intervalMs);
  tick();
  return () => clearInterval(id);
}
