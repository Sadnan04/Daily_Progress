import User from "../models/User.js";
import Tracker from "../models/Tracker.js";
import {
  TOTAL_DAYS,
  taskKey,
  calcStreak,
  calcDaysCompleted,
  calcWeeklyProgressPercent,
  dayIndexFromStart,
  dailyCompletionSeries,
  getDayCompletion,
  getTasksForDay,
  TASK_DEFS,
  DAY_TYPES,
  DAYS,
  tasksPlain
} from "../utils/trackerMath.js";

async function getOrCreateTracker(userId) {
  let doc = await Tracker.findOne({ userId });
  if (!doc) {
    doc = await Tracker.create({ userId, tasks: {} });
  }
  return doc;
}

export async function getSummary(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const tracker = await getOrCreateTracker(user._id);
    const trackerTasks = tasksPlain(tracker.tasks);
    const now = new Date();
    const dayIdx = dayIndexFromStart(user.programStartDate, now);
    const currentWeek = Math.floor(dayIdx / 7);
    const summary = {
      streak: calcStreak(trackerTasks, user.programStartDate, now),
      daysCompleted: calcDaysCompleted(trackerTasks, user.programStartDate, now),
      weeklyProgressPercent: calcWeeklyProgressPercent(trackerTasks, currentWeek, user.programStartDate, now),
      currentWeek: currentWeek + 1,
      currentWeekIndex: currentWeek,
      dayOfProgram: dayIdx + 1,
      overallPercent: Math.round(((dayIdx + 1) / TOTAL_DAYS) * 100),
      programStartDate: user.programStartDate
    };
    const w = currentWeek;
    const d = dayIdx % 7;
    const todayCompletion = getDayCompletion(trackerTasks, w, d);
    const todayTasks = getTasksForDay(d).map((t) => ({
      ...t,
      done: Boolean(trackerTasks[taskKey(w, d, t.id)])
    }));
    return res.json({
      summary,
      todayPreview: {
        weekIndex: w,
        dayInWeek: d,
        dayLabel: DAYS[d],
        completion: todayCompletion,
        tasks: todayTasks
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load summary" });
  }
}

export async function getState(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const tracker = await getOrCreateTracker(user._id);
    const trackerTasks = tasksPlain(tracker.tasks);
    return res.json({
      trackerTasks,
      programStartDate: user.programStartDate,
      taskDefs: TASK_DEFS,
      dayTypes: DAY_TYPES,
      days: DAYS,
      totalDays: TOTAL_DAYS
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load tracker" });
  }
}

export async function toggleTask(req, res) {
  try {
    const { week, day, taskId } = req.body;
    if (week === undefined || day === undefined || !taskId) {
      return res.status(400).json({ error: "week, day, and taskId required" });
    }
    const w = Number(week);
    const d = Number(day);
    if (w < 0 || w > 29 || d < 0 || d > 6) {
      return res.status(400).json({ error: "Invalid week or day" });
    }
    if (!TASK_DEFS.find((t) => t.id === taskId)) {
      return res.status(400).json({ error: "Invalid task" });
    }
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const now = new Date();
    const todayIdx = dayIndexFromStart(user.programStartDate, now);
    if (w * 7 + d > todayIdx) {
      return res.status(400).json({ error: "Cannot toggle future days" });
    }
    const allowed = getTasksForDay(d).some((t) => t.id === taskId);
    if (!allowed) {
      return res.status(400).json({ error: "Task not applicable for this day" });
    }
    const tracker = await getOrCreateTracker(user._id);
    if (!tracker.tasks || typeof tracker.tasks !== "object") {
      tracker.tasks = {};
    }
    const key = taskKey(w, d, taskId);
    const cur = tracker.tasks[key];
    tracker.tasks[key] = !cur;
    tracker.markModified("tasks");
    await tracker.save();
    const trackerTasks = tasksPlain(tracker.tasks);
    return res.json({ trackerTasks, toggled: key, value: Boolean(trackerTasks[key]) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Toggle failed" });
  }
}

export async function resetWeek(req, res) {
  try {
    const week = Number(req.params.week);
    if (week < 0 || week > 29) return res.status(400).json({ error: "Invalid week" });
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const tracker = await getOrCreateTracker(user._id);
    if (!tracker.tasks || typeof tracker.tasks !== "object") {
      tracker.tasks = {};
    }
    for (const k of Object.keys(tracker.tasks)) {
      if (k.startsWith(`w${week}d`)) delete tracker.tasks[k];
    }
    tracker.markModified("tasks");
    await tracker.save();
    return res.json({ trackerTasks: tasksPlain(tracker.tasks) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Reset week failed" });
  }
}

export async function getAnalytics(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const tracker = await getOrCreateTracker(user._id);
    const trackerTasks = tasksPlain(tracker.tasks);
    const now = new Date();
    const series = dailyCompletionSeries(trackerTasks, user.programStartDate, now);
    const weeklyBuckets = {};
    for (const point of series) {
      if (!weeklyBuckets[point.week]) {
        weeklyBuckets[point.week] = { sum: 0, count: 0 };
      }
      weeklyBuckets[point.week].sum += point.percent;
      weeklyBuckets[point.week].count += 1;
    }
    const weeklyTrend = Object.entries(weeklyBuckets)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([week, { sum, count }]) => ({
        week: Number(week) + 1,
        avgCompletion: count ? Math.round(sum / count) : 0
      }));
    const streakHistory = [];
    let run = 0;
    for (const point of series) {
      if (point.isDone) {
        run += 1;
        streakHistory.push({ dayIndex: point.dayIndex, streakLength: run });
      } else {
        run = 0;
        streakHistory.push({ dayIndex: point.dayIndex, streakLength: 0 });
      }
    }
    const heatmap = series.map((p) => ({
      dayIndex: p.dayIndex,
      week: p.week,
      dayInWeek: p.dayInWeek,
      percent: p.percent,
      isDone: p.isDone
    }));
    return res.json({
      dailyCompletion: series.map((p) => ({ day: p.dayIndex + 1, percent: p.percent, isDone: p.isDone })),
      weeklyTrend,
      streakHistory,
      heatmap
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Analytics failed" });
  }
}
