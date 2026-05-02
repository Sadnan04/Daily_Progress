import { NavLink } from "react-router-dom";
import { APP_ROUTES } from "../config/navigation.js";

export default function Sidebar() {
  return (
    <aside
      className="glass z-20 hidden w-full shrink-0 flex-col gap-2 p-4 lg:flex lg:w-full lg:max-w-[260px] lg:sticky lg:top-6 lg:self-start"
      aria-label="Main navigation"
    >
      <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-accent text-lg shadow-lg">
          🧠
        </div>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold leading-tight text-white">Daily Progress Tracker</p>
          <p className="mt-1 text-[11px] leading-snug text-slate-400">
            7-month journey to becoming an AI/ML Engineer
          </p>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {APP_ROUTES.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                isActive
                  ? "bg-white/15 text-white shadow-inner"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`
            }
          >
            <span className="w-5 shrink-0 text-center opacity-80" aria-hidden>
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
