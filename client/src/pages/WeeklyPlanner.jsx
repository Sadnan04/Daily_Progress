import { useCallback, useEffect, useState } from "react";
import WeekView from "../features/tracker/WeekView.jsx";
import { clampProgramWeek } from "../features/tracker/trackerSlice.js";
import { getState, getSummary, toggleTask, resetWeek } from "../services/trackerService.js";

export default function WeeklyPlanner() {
  const [state, setState] = useState(null);
  const [summary, setSummary] = useState(null);
  const [week, setWeek] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [st, sm] = await Promise.all([getState(), getSummary()]);
    setState(st);
    setSummary(sm.summary);
    setWeek(clampProgramWeek(sm.summary.currentWeekIndex));
    setLoading(false);
  }, []);

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, [load]);

  async function handleToggle(day, taskId) {
    await toggleTask(week, day, taskId);
    await load();
  }

  async function handleResetWeek() {
    if (!confirm("Reset all tasks for this week?")) return;
    await resetWeek(week);
    await load();
  }

  if (loading || !state || !summary) {
    return <p className="text-slate-500">Loading planner…</p>;
  }

  const todayProgramIndex = summary.dayOfProgram - 1;

  return (
    <WeekView
      week={week}
      onWeekChange={setWeek}
      tracker={state.trackerTasks}
      days={state.days}
      dayTypes={state.dayTypes}
      taskDefs={state.taskDefs}
      todayProgramIndex={todayProgramIndex}
      onToggleTask={handleToggle}
      onResetWeek={handleResetWeek}
    />
  );
}
