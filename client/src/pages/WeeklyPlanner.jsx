import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WeekView from "../features/tracker/WeekView.jsx";
import { clampProgramWeek, getScheduleAreaForHour } from "../features/tracker/trackerSlice.js";
import { getState, getSummary, toggleTask, resetWeek } from "../services/trackerService.js";
import {
  addDays,
  diffCalendarDays,
  formatNowLong,
  getHourInTimeZone,
  getUserTimeZone,
  getYmdInTimeZone,
  startOfWeekMonday
} from "../utils/time.js";

export default function WeeklyPlanner() {
  const [state, setState] = useState(null);
  const [summary, setSummary] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current calendar week (Mon–Sun)
  const [now, setNow] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const todayCardRef = useRef(null);
  const lastAutoScrolledWeekRef = useRef(null);
  const timeZone = getUserTimeZone();
  const hour12Pref = useMemo(() => {
    const v = localStorage.getItem("dpt_hour12");
    if (v === "true") return true;
    if (v === "false") return false;
    return undefined; // use locale default
  }, []);

  const load = useCallback(async () => {
    const [st, sm] = await Promise.all([getState(), getSummary()]);
    setState(st);
    setSummary(sm.summary);
    setLoading(false);
  }, []);

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  async function handleToggle(programWeek, programDay, taskId) {
    await toggleTask(programWeek, programDay, taskId);
    await load();
  }

  async function handleResetWeek() {
    if (!confirm("Reset all tasks for this week?")) return;
    // Reset the program week containing "today" within the visible calendar week.
    const today = calendarDays.find((d) => d.isToday) ?? calendarDays[0];
    if (!today || today.isOutOfRange) return;
    await resetWeek(today.programWeek);
    await load();
  }

  const todayYmd = getYmdInTimeZone(now, timeZone);
  const weekStart = useMemo(
    () => startOfWeekMonday(addDays(now, weekOffset * 7), timeZone),
    [timeZone, todayYmd, weekOffset]
  );
  const activeHour = getHourInTimeZone(now, timeZone);
  const activeScheduleArea = getScheduleAreaForHour(activeHour);

  const greeting = useMemo(() => {
    if (activeHour >= 6 && activeHour < 12) return "Good Morning 🌅";
    if (activeHour >= 12 && activeHour < 16) return "Good Afternoon ☀️";
    if (activeHour >= 16 && activeHour < 19) return "Good Afternoon 🌤️";
    if (activeHour >= 19 && activeHour < 22) return "Good Evening 🌙";
    return "Good Night 🌙";
  }, [activeHour]);

  const timeLabel = formatNowLong(now, { timeZone, hour12: hour12Pref });

  const calendarDays = useMemo(() => {
    const safeStartDate = state?.programStartDate ? new Date(state.programStartDate) : new Date();
    const start = new Date(safeStartDate);
    start.setHours(0, 0, 0, 0);
    const days = [];
    const totalDays = Number(state?.totalDays ?? 210);
    const dayTypes = state?.dayTypes ?? [];
    for (let i = 0; i < 7; i += 1) {
      const date = addDays(weekStart, i);
      const ymd = getYmdInTimeZone(date, timeZone);
      const programIndex = diffCalendarDays(start, date);
      const isOutOfRange = programIndex < 0 || programIndex >= totalDays;
      const programWeek = clampProgramWeek(Math.floor(Math.max(0, programIndex) / 7));
      const programDay = ((programIndex % 7) + 7) % 7;

      let calendarLabel;
      try {
        calendarLabel = new Intl.DateTimeFormat(undefined, {
          timeZone,
          weekday: "short",
          month: "short",
          day: "numeric"
        }).format(date);
      } catch {
        calendarLabel = date.toDateString();
      }

      const isToday = ymd === todayYmd;
      const isFuture = ymd > todayYmd;

      days.push({
        ymd,
        date,
        calendarLabel,
        dayType: dayTypes[programDay] ?? "Full",
        isToday,
        isFuture,
        isOutOfRange,
        programWeek,
        programDay
      });
    }
    return days;
  }, [state?.dayTypes, state?.programStartDate, state?.totalDays, timeZone, todayYmd, weekStart]);

  useEffect(() => {
    // Auto scroll only once per week offset to avoid scroll-lock while user navigates.
    const d = calendarDays.find((x) => x.isToday);
    if (!d) return;
    if (lastAutoScrolledWeekRef.current === weekOffset) return;
    const el = todayCardRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    lastAutoScrolledWeekRef.current = weekOffset;
  }, [calendarDays, weekOffset]);

  if (loading || !state || !summary) {
    return <p className="text-slate-500">Loading planner…</p>;
  }

  return (
    <WeekView
      weekOffset={weekOffset}
      onWeekOffsetChange={setWeekOffset}
      calendarDays={calendarDays}
      timeLabel={timeLabel}
      greeting={greeting}
      activeScheduleArea={activeScheduleArea}
      tracker={state.trackerTasks}
      taskDefs={state.taskDefs}
      onToggleTask={handleToggle}
      onResetWeek={handleResetWeek}
      todayCardRef={todayCardRef}
    />
  );
}
