/**
 * Pure helpers for tracker UI (no Redux). Keeps Weekly Planner logic testable.
 */

export function clampProgramWeek(week, maxWeek = 29) {
  return Math.max(0, Math.min(maxWeek, week));
}

/** Every calendar day shows all five tasks (matches backend getTasksForDay). */
export function getApplicableTasks(_dayIndex, taskDefs, _dayTypes) {
  return taskDefs;
}

export function groupTasksBySection(tasks) {
  const map = {};
  for (const t of tasks) {
    if (!map[t.section]) map[t.section] = [];
    map[t.section].push(t);
  }
  return map;
}

/**
 * Maps local hour to the current focus block of the day.
 * Keeps planner behavior time-aware without requiring backend polling.
 */
export function getScheduleAreaForHour(hour = new Date().getHours()) {
  // Spec blocks:
  // Morning (6AM–12PM), Midday (12PM–4PM), Afternoon (4PM–7PM), Evening (7PM–10PM), Night (10PM+)
  if (hour >= 6 && hour < 12) return { taskId: "concept", label: "Morning (6–12)" };
  if (hour >= 12 && hour < 16) return { taskId: "code", label: "Midday (12–4)" };
  if (hour >= 16 && hour < 19) return { taskId: "project", label: "Afternoon (4–7)" };
  if (hour >= 19 && hour < 22) return { taskId: "tools", label: "Evening (7–10)" };
  if (hour >= 22) return { taskId: "linkedin", label: "Night (10+)" };
  return { taskId: "concept", label: "Early (before 6)" };
}
