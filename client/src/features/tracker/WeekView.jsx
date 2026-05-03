import DayCard from "./DayCard.jsx";
import { clampProgramWeek } from "./trackerSlice.js";

const MAX_WEEK = 29;

export default function WeekView({
  weekOffset,
  onWeekOffsetChange,
  tracker,
  calendarDays,
  timeLabel,
  greeting,
  activeScheduleArea,
  taskDefs,
  onResetWeek,
  onToggleTask,
  todayCardRef
}) {
  function prevWeek() {
    onWeekOffsetChange(clampProgramWeek(weekOffset - 1, MAX_WEEK));
  }

  function nextWeek() {
    onWeekOffsetChange(clampProgramWeek(weekOffset + 1, MAX_WEEK));
  }

  function onTouchStart(e) {
    const t = e.touches?.[0];
    if (!t) return;
    e.currentTarget.dataset.touchX = String(t.clientX);
  }

  function onTouchEnd(e) {
    const startX = Number(e.currentTarget.dataset.touchX || "0");
    const t = e.changedTouches?.[0];
    if (!t || !startX) return;
    const dx = t.clientX - startX;
    if (Math.abs(dx) < 60) return;
    if (dx > 0) prevWeek();
    else nextWeek();
  }

  return (
    <div className="flex flex-col gap-4" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="glass sticky top-3 z-10 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Weekly Planner</h2>
          <p className="text-sm text-slate-300">{timeLabel}</p>
          <p className="mt-1 text-xs text-slate-400">
            {greeting} · Focus now: <span className="text-blue-200/90">{activeScheduleArea.label}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={prevWeek}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={nextWeek}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Next →
          </button>
          <button
            type="button"
            onClick={onResetWeek}
            className="rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm text-orange-200 hover:bg-orange-500/20"
          >
            Reset week
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {calendarDays.map((day) => (
          <DayCard
            key={day.ymd}
            ref={day.isToday ? todayCardRef : undefined}
            calendarDateLabel={day.calendarLabel}
            dayType={day.dayType}
            programWeek={day.programWeek}
            programDay={day.programDay}
            taskDefs={taskDefs}
            tracker={tracker}
            isToday={day.isToday}
            isFuture={day.isFuture}
            isOutOfRange={day.isOutOfRange}
            activeTaskId={activeScheduleArea.taskId}
            onToggleTask={(taskId) => onToggleTask(day.programWeek, day.programDay, taskId)}
          />
        ))}
      </div>
    </div>
  );
}
