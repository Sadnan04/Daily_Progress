import { useEffect, useState } from "react";
import ProgressCharts from "../features/tracker/ProgressCharts.jsx";
import { getAnalytics, getSummary } from "../services/trackerService.js";

export default function Progress() {
  const [analytics, setAnalytics] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAnalytics(), getSummary()])
      .then(([a, s]) => {
        if (!cancelled) {
          setAnalytics(a);
          setSummary(s.summary);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.response?.data?.error || "Failed to load analytics");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="text-red-300">{error}</p>;
  if (!analytics || !summary) return <p className="text-slate-500">Loading analytics…</p>;

  const maxWeek = Math.floor((summary.dayOfProgram - 1) / 7);

  return <ProgressCharts analytics={analytics} maxWeek={maxWeek} />;
}
