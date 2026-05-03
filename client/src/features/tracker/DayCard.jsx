import { forwardRef } from "react";
import ToggleButton from "../../components/ToggleButton.jsx";
import { getApplicableTasks, groupTasksBySection } from "./trackerSlice.js";

const DayCard = forwardRef(function DayCard(
  {
    calendarDateLabel,
    dayType,
    programWeek,
    programDay,
    taskDefs,
    tracker,
    isToday,
    isFuture,
    isOutOfRange,
    activeTaskId,
    onToggleTask
  },
  ref
) {
  const applicable = getApplicableTasks(programDay, taskDefs, []);
  const bySection = groupTasksBySection(applicable);
  let done = 0;
  const total = applicable.length || 1;
  for (const t of applicable) {
    const k = `w${programWeek}d${programDay}t${t.id}`;
    if (tracker[k]) done += 1;
  }
  const pct = Math.round((done / total) * 100);

  return (
    <article
      ref={ref}
      className={`glass flex flex-col p-4 ${
        isToday ? "ring-2 ring-blue-400/60" : ""
      } ${isOutOfRange ? "opacity-40" : isFuture ? "opacity-60" : ""} ${
        isToday ? "md:col-span-2" : ""
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-white">{calendarDateLabel}</p>
            {isToday && (
              <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-200">
                Today
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">{dayType} day · {pct}%</p>
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
                const k = `w${programWeek}d${programDay}t${t.id}`;
                const on = Boolean(tracker[k]);
                const isActiveNow = isToday && t.id === activeTaskId;
                return (
                  <div
                    key={t.id}
                    title={t.label}
                    className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 transition ${
                      on
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : isActiveNow
                          ? "border-blue-400/40 bg-blue-500/10"
                          : "border-white/5 bg-slate-900/40"
                    }`}
                  >
                    <p className="min-w-0 truncate text-sm text-slate-200">
                      {t.emoji} {t.label}
                    </p>
                    <ToggleButton
                      on={on}
                      disabled={isFuture || isOutOfRange}
                      ariaLabel={t.label}
                      onToggle={() => onToggleTask(t.id)}
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
});

export default DayCard;
