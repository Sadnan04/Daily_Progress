import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { APP_ROUTES } from "../config/navigation.js";
import { getSummary } from "../services/trackerService.js";
import { formatHeaderDate } from "../utils/helpers.js";

export default function Navbar({ title: titleOverride }) {
  const { user } = useAuth();
  const location = useLocation();
  const titleMap = useMemo(
    () => Object.fromEntries(APP_ROUTES.map((r) => [r.path, r.label])),
    []
  );
  const title =
    titleOverride ?? titleMap[location.pathname] ?? "Daily Progress Tracker";
  const [dayOfProgram, setDayOfProgram] = useState("—");

  useEffect(() => {
    let cancelled = false;
    getSummary()
      .then((data) => {
        if (!cancelled) setDayOfProgram(String(data.summary.dayOfProgram));
      })
      .catch(() => {
        if (!cancelled) setDayOfProgram("—");
      });
    return () => {
      cancelled = true;
    };
  }, [user?.programStartDate, location.pathname]);

  const first = user?.name?.split(" ")[0] || "";

  return (
    <header className="glass flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-slate-400">Welcome back 👋 {first}</p>
        <h1 className="font-display text-xl font-semibold text-white md:text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{formatHeaderDate()}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          Day {dayOfProgram} of 210
        </span>
      </div>
    </header>
  );
}
