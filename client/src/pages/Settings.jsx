import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  changePasswordRequest,
  resetProgressRequest,
  updateProfileRequest,
  updateSettingsRequest
} from "../services/authService.js";

const REMINDER_FIELDS = [
  { id: "morning_study", label: "Morning study" },
  { id: "coding_session", label: "Coding session" },
  { id: "project_time", label: "Project work" },
  { id: "night_review", label: "Night review" }
];

export default function Settings() {
  const { user, logout, refreshUser, updateLocalUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [msg, setMsg] = useState("");
  const [reminders, setReminders] = useState(null);
  const [notifEnabled, setNotifEnabled] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setReminders(user.settings?.reminders || {});
      setNotifEnabled(user.settings?.notificationsEnabled !== false);
    }
  }, [user]);

  async function saveProfile(e) {
    e.preventDefault();
    setMsg("");
    const u = await updateProfileRequest({ name, email });
    updateLocalUser(u);
    setMsg("Profile updated.");
  }

  async function savePassword(e) {
    e.preventDefault();
    setMsg("");
    await changePasswordRequest(curPw, newPw);
    setCurPw("");
    setNewPw("");
    setMsg("Password changed.");
  }

  async function saveReminders() {
    setMsg("");
    const u = await updateSettingsRequest({ reminders, notificationsEnabled: notifEnabled });
    updateLocalUser(u);
    await refreshUser();
    setMsg("Settings saved.");
  }

  async function resetProgress() {
    if (!confirm("Reset all progress and restart the 210-day clock from today?")) return;
    const u = await resetProgressRequest();
    updateLocalUser(u);
    await refreshUser();
    setMsg("Progress reset.");
  }

  async function requestNotif() {
    if (!("Notification" in window)) {
      setMsg("Notifications not supported in this browser.");
      return;
    }
    const p = await Notification.requestPermission();
    setMsg(p === "granted" ? "Notifications enabled." : `Permission: ${p}`);
  }

  if (!user || !reminders) {
    return <p className="text-slate-500">Loading settings…</p>;
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      {msg && (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
          {msg}
        </p>
      )}

      <Card>
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <p className="text-sm text-slate-400">
          Joined {new Date(user.joinDate).toLocaleDateString("en-GB", { dateStyle: "medium" })}
        </p>
        <form onSubmit={saveProfile} className="mt-4 flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm"
          />
          <button
            type="submit"
            className="w-fit rounded-xl gradient-accent px-5 py-2.5 text-sm font-semibold text-white"
          >
            Save profile
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white">Change password</h2>
        <form onSubmit={savePassword} className="mt-4 flex flex-col gap-3">
          <input
            type="password"
            placeholder="Current password"
            value={curPw}
            onChange={(e) => setCurPw(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm"
          />
          <input
            type="password"
            placeholder="New password (min 8)"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm"
          />
          <button
            type="submit"
            className="w-fit rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Update password
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white">Reminders & notifications</h2>
        <p className="text-sm text-slate-400">Browser alerts at the times you choose</p>
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={notifEnabled}
              onChange={(e) => setNotifEnabled(e.target.checked)}
            />
            Enable reminder notifications
          </label>
          {REMINDER_FIELDS.map((r) => {
            const cfg = reminders[r.id] || { enabled: false, time: "08:00" };
            return (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-900/40 px-4 py-3"
              >
                <span className="text-sm text-slate-200">{r.label}</span>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={cfg.time}
                    onChange={(e) =>
                      setReminders((prev) => ({
                        ...prev,
                        [r.id]: { ...cfg, time: e.target.value }
                      }))
                    }
                    className="rounded-lg border border-white/10 bg-slate-950 px-2 py-1.5 text-sm"
                  />
                  <label className="flex items-center gap-2 text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={cfg.enabled}
                      onChange={(e) =>
                        setReminders((prev) => ({
                          ...prev,
                          [r.id]: { ...cfg, enabled: e.target.checked }
                        }))
                      }
                    />
                    On
                  </label>
                </div>
              </div>
            );
          })}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveReminders}
              className="rounded-xl gradient-accent px-5 py-2.5 text-sm font-semibold text-white"
            >
              Save reminders
            </button>
            <button
              type="button"
              onClick={requestNotif}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white hover:bg-white/10"
            >
              Enable browser notifications
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white">Danger zone</h2>
        <p className="mt-2 text-sm text-slate-400">Reset clears tasks and restarts your 210-day timeline.</p>
        <button
          type="button"
          onClick={resetProgress}
          className="mt-4 rounded-xl border border-orange-500/40 bg-orange-500/10 px-5 py-2.5 text-sm font-medium text-orange-100"
        >
          Reset progress
        </button>
        <button
          type="button"
          onClick={logout}
          className="mt-3 block w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10"
        >
          Log out
        </button>
      </Card>
    </div>
  );
}
