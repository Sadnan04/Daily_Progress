import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";

function Heatmap({ heatmap, maxWeek }) {
  const byWeek = useMemo(() => {
    const m = {};
    for (const cell of heatmap) {
      if (!m[cell.week]) m[cell.week] = Array(7).fill(null);
      m[cell.week][cell.dayInWeek] = cell;
    }
    return m;
  }, [heatmap]);

  const weeks = [];
  for (let w = 0; w <= maxWeek; w += 1) weeks.push(w);

  function color(pct, isDone) {
    if (isDone && pct >= 80) return "bg-emerald-500";
    if (pct >= 60) return "bg-emerald-600/70";
    if (pct >= 30) return "bg-slate-600";
    if (pct > 0) return "bg-slate-700";
    return "bg-slate-800/80";
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="inline-flex min-w-full flex-col gap-1">
        <div className="flex gap-1 pl-8 text-[10px] text-slate-500">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={`${d}-${i}`} className="w-3 text-center">
              {d}
            </span>
          ))}
        </div>
        {weeks.map((w) => (
          <div key={w} className="flex items-center gap-1">
            <span className="w-7 shrink-0 text-[10px] text-slate-500">W{w + 1}</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5, 6].map((d) => {
                const cell = byWeek[w]?.[d];
                const pct = cell?.percent ?? 0;
                const isDone = cell?.isDone;
                const title = cell ? `Day ${cell.dayIndex + 1}: ${pct}%` : "—";
                return (
                  <div
                    key={d}
                    title={title}
                    className={`h-3 w-3 rounded-sm ${color(pct, isDone)} ring-1 ring-white/5`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProgressCharts({ analytics, maxWeek }) {
  const { dailyCompletion, weeklyTrend, streakHistory, heatmap } = analytics;

  return (
    <div className="flex flex-col gap-6">
      <section className="glass p-6">
        <h2 className="text-lg font-semibold text-white">Daily completion</h2>
        <p className="text-sm text-slate-400">% of tasks completed each program day</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyCompletion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Line type="monotone" dataKey="percent" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass p-6">
          <h2 className="text-lg font-semibold text-white">Weekly trend</h2>
          <p className="text-sm text-slate-400">Average daily completion per week</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="avgCompletion" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass p-6">
          <h2 className="text-lg font-semibold text-white">Streak history</h2>
          <p className="text-sm text-slate-400">Running streak length by day</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={streakHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="dayIndex" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Line type="stepAfter" dataKey="streakLength" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="glass p-6">
        <h2 className="text-lg font-semibold text-white">Completion heatmap</h2>
        <p className="text-sm text-slate-400">GitHub-style view</p>
        <div className="mt-4">
          <Heatmap heatmap={heatmap} maxWeek={maxWeek} />
        </div>
      </section>
    </div>
  );
}
