import { NavLink } from "react-router-dom";
import { APP_ROUTES } from "../config/navigation.js";

export default function MobileNav() {
  return (
    <nav
      className="glass fixed bottom-3 left-3 right-3 z-50 flex justify-around gap-1 p-2 shadow-2xl lg:hidden"
      aria-label="Mobile navigation"
    >
      {APP_ROUTES.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) =>
            `min-w-0 flex-1 rounded-lg px-1 py-2 text-center text-[11px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
              isActive ? "bg-white/15 text-white" : "text-slate-500"
            }`
          }
        >
          <span className="mb-0.5 block text-sm" aria-hidden>
            {item.icon}
          </span>
          <span className="leading-tight">{item.shortLabel}</span>
        </NavLink>
      ))}
    </nav>
  );
}
