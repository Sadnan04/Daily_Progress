import DayCard from "./DayCard.jsx";
import { clampProgramWeek } from "./trackerSlice.js";

const MAX_WEEK = 29;

export default function WeekView({
  week,
  onWeekChange,
  tracker,
  days,
  dayTypes,
  taskDefs,
  todayProgramIndex,
  onToggleTask,
  onResetWeek
}) {
  const todayIdx = todayProgramIndex;

  return (
    <div className="flex flex-col gap-4">
      <div className="glass flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Week {week + 1}</h2>
          <p className="text-sm text-slate-400">Mon–Sun cards · toggles sync to the server</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onWeekChange(clampProgramWeek(week - 1))}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => onWeekChange(clampProgramWeek(week + 1))}
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
        {[0, 1, 2, 3, 4, 5, 6].map((d) => (
          <DayCard
            key={d}
            day={d}
            week={week}
            dayLabel={days[d]}
            dayType={dayTypes[d]}
            taskDefs={taskDefs}
            dayTypes={dayTypes}
            tracker={tracker}
            isToday={week * 7 + d === todayIdx}
            isFuture={week * 7 + d > todayIdx}
            onToggleTask={onToggleTask}
          />
        ))}
      </div>
    </div>
  );
}
