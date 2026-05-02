import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { getSummary } from "../services/trackerService.js";

function StatCard({ icon, label, value, sub, gradient }) {
  return (
    <div
      className={`rounded-2xl p-5 text-white shadow-xl transition hover:-translate-y-0.5 ${gradient}`}
    >
      <div className="text-2xl">{icon}</div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-sm font-medium opacity-90">{label}</p>
      {sub && <p className="mt-2 text-xs opacity-80">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getSummary()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((e) => {
        if (!cancelled) setError(e.response?.data?.error || "Failed to load dashboard");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="text-red-300">{error}</p>;
  if (!data) return <p className="text-slate-500">Loading dashboard…</p>;

  const { summary, todayPreview } = data;
  const focusLines = [
    "One focused block beats ten distracted hours.",
    "Ship a small ML win today — notebook, metric, or diagram.",
    "Consistency compounds. Show up, then optimize."
  ];
  const focus = focusLines[summary.dayOfProgram % focusLines.length];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="🔥"
          label="Day streak"
          value={summary.streak}
          sub="Keep the chain alive"
          gradient="bg-gradient-to-br from-orange-500 to-amber-500"
        />
        <StatCard
          icon="✅"
          label="Days completed"
          value={summary.daysCompleted}
          sub="Strong days in your 210"
          gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
        />
        <StatCard
          icon="📈"
          label="Weekly progress"
          value={`${summary.weeklyProgressPercent}%`}
          sub="This week’s task completion"
          gradient="bg-gradient-to-br from-violet-600 to-blue-600"
        />
        <StatCard
          icon="📅"
          label="Current week"
          value={summary.currentWeek}
          sub="Of 30 weeks"
          gradient="bg-gradient-to-br from-sky-500 to-indigo-600"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Overall progress</h2>
              <p className="text-sm text-slate-400">210-day AI/ML engineer track</p>
            </div>
            <p className="text-sm font-medium text-violet-300">
              {summary.overallPercent}% · {summary.daysCompleted} strong days
            </p>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-700"
              style={{ width: `${summary.overallPercent}%` }}
            />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white">Today’s focus</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{focus}</p>
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-sm font-medium text-amber-100">Stay consistent 🚀</p>
            <p className="mt-1 text-xs text-amber-200/80">
              Small daily reps beat occasional marathons.
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white">Today at a glance</h2>
        <p className="mt-1 text-sm text-slate-400">Read-only — edit in Weekly Planner</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="rounded-xl bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Completion</p>
            <p className="text-2xl font-bold text-white">{todayPreview.completion.percent}%</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {todayPreview.tasks.length === 0 ? (
              <p className="text-sm text-slate-500">Rest day — recharge for the week ahead.</p>
            ) : (
              todayPreview.tasks.map((t) => (
                <span
                  key={t.id}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    t.done ? "bg-emerald-500/20 text-emerald-200" : "bg-slate-700/50 text-slate-400"
                  }`}
                  title={t.label}
                >
                  {t.emoji} {t.label}
                </span>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
