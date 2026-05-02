import ToggleButton from "../../components/ToggleButton.jsx";
import { getApplicableTasks, groupTasksBySection } from "./trackerSlice.js";

export default function DayCard({
  day,
  week,
  dayLabel,
  dayType,
  taskDefs,
  dayTypes,
  tracker,
  isToday,
  isFuture,
  onToggleTask
}) {
  const applicable = getApplicableTasks(day, taskDefs, dayTypes);
  const bySection = groupTasksBySection(applicable);
  let done = 0;
  const total = applicable.length || 1;
  for (const t of applicable) {
    const k = `w${week}d${day}t${t.id}`;
    if (tracker[k]) done += 1;
  }
  const pct = Math.round((done / total) * 100);

  return (
    <article
      className={`glass flex flex-col p-4 ${isToday ? "ring-2 ring-blue-400/60" : ""} ${
        isFuture ? "opacity-50" : ""
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-white">{dayLabel}</p>
          <p className="text-xs text-slate-500">{dayType} day</p>
        </div>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-violet-200">
          {pct}%
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {Object.entries(bySection).map(([section, tasks]) => (
          <div key={section}>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {section}
            </p>
            <div className="flex flex-col gap-2">
              {tasks.map((t) => {
                const k = `w${week}d${day}t${t.id}`;
                const on = Boolean(tracker[k]);
                return (
                  <div
                    key={t.id}
                    title={t.label}
                    className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 transition ${
                      on ? "border-emerald-500/40 bg-emerald-500/10" : "border-white/5 bg-slate-900/40"
                    }`}
                  >
                    <p className="min-w-0 truncate text-sm text-slate-200">
                      {t.emoji} {t.label}
                    </p>
                    <ToggleButton
                      on={on}
                      disabled={isFuture}
                      ariaLabel={t.label}
                      onToggle={() => onToggleTask(day, t.id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
