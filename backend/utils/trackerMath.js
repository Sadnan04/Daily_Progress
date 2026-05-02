export const TOTAL_DAYS = 210;
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
/** All week days use the same five task blocks (spec: Mon–Sun each includes Morning → Night). */
export const DAY_TYPES = ["Full", "Full", "Full", "Full", "Full", "Full", "Full"];

export const TASK_DEFS = [
  { id: "concept", section: "🌅 Morning", label: "Concept learned", emoji: "🌅" },
  { id: "code", section: "💻 Midday", label: "Coding practice", emoji: "💻" },
  { id: "project", section: "🚀 Afternoon", label: "Project work", emoji: "🚀" },
  { id: "tools", section: "🧠 Evening", label: "Tools / skills", emoji: "🧠" },
  { id: "linkedin", section: "🌙 Night", label: "LinkedIn / branding", emoji: "🌙" }
];

export function taskKey(week, day, taskId) {
  return `w${week}d${day}t${taskId}`;
}

export function getTasksForDay(_dayIndex) {
  return TASK_DEFS;
}

export function dayIndexFromStart(programStartDate, now = new Date()) {
  const start = new Date(programStartDate);
  start.setHours(0, 0, 0, 0);
  const n = new Date(now);
  n.setHours(0, 0, 0, 0);
  const diff = Math.floor((n - start) / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.min(diff, TOTAL_DAYS - 1));
}

export function getDayCompletion(trackerTasks, week, day) {
  const tasks = getTasksForDay(day);
  const total = tasks.length || 1;
  let done = 0;
  for (const t of tasks) {
    const k = taskKey(week, day, t.id);
    if (trackerTasks[k]) done += 1;
  }
  const percent = Math.round((done / total) * 100);
  const isDone = done >= Math.ceil(total * 0.8);
  return { done, total, isDone, percent };
}

export function calcStreak(trackerTasks, programStartDate, now = new Date()) {
  const today = dayIndexFromStart(programStartDate, now);
  let streak = 0;
  for (let i = today; i >= 0; i -= 1) {
    const w = Math.floor(i / 7);
    const d = i % 7;
    if (getDayCompletion(trackerTasks, w, d).isDone) streak += 1;
    else break;
  }
  return streak;
}

export function calcDaysCompleted(trackerTasks, programStartDate, now = new Date()) {
  const today = dayIndexFromStart(programStartDate, now);
  let count = 0;
  for (let i = 0; i <= today; i += 1) {
    const w = Math.floor(i / 7);
    const d = i % 7;
    if (getDayCompletion(trackerTasks, w, d).isDone) count += 1;
  }
  return count;
}

export function calcWeeklyProgressPercent(trackerTasks, currentWeek, programStartDate, now = new Date()) {
  const today = dayIndexFromStart(programStartDate, now);
  let done = 0;
  let total = 0;
  for (let d = 0; d < 7; d += 1) {
    const weekDayIndex = currentWeek * 7 + d;
    if (weekDayIndex > today) continue;
    const tasks = getTasksForDay(d);
    for (const t of tasks) {
      total += 1;
      if (trackerTasks[taskKey(currentWeek, d, t.id)]) done += 1;
    }
  }
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

export function dailyCompletionSeries(trackerTasks, programStartDate, now = new Date()) {
  const today = dayIndexFromStart(programStartDate, now);
  const series = [];
  for (let i = 0; i <= today; i += 1) {
    const w = Math.floor(i / 7);
    const d = i % 7;
    const { percent, isDone } = getDayCompletion(trackerTasks, w, d);
    series.push({ dayIndex: i, week: w, dayInWeek: d, percent, isDone });
  }
  return series;
}

export function tasksPlain(tasks) {
  if (!tasks || typeof tasks !== "object") return {};
  return { ...tasks };
}
