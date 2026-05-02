import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { startReminderScheduler } from "./services/reminderService.js";
import Layout from "./components/Layout.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import WeeklyPlanner from "./pages/WeeklyPlanner.jsx";
import Progress from "./pages/Progress.jsx";
import Projects from "./pages/Projects.jsx";
import Notes from "./pages/Notes.jsx";
import Settings from "./pages/Settings.jsx";

/**
 * Guards child routes; must render <Outlet /> so nested layouts receive router context.
 */
function PrivateRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <Outlet />;
}

export default function App() {
  const { user } = useAuth();

  useEffect(() => {
    return startReminderScheduler(() => user);
  }, [user]);

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/signup" element={<Navigate to="/auth?mode=register" replace />} />

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="planner" element={<WeeklyPlanner />} />
          <Route path="progress" element={<Progress />} />
          <Route path="projects" element={<Projects />} />
          <Route path="notes" element={<Notes />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
