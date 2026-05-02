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
