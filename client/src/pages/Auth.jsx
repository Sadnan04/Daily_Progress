import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const modeFromUrl = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState(modeFromUrl);

  useEffect(() => {
    setMode(modeFromUrl);
  }, [modeFromUrl]);
  const { login, signup } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup({ name, email, password });
      }
      nav("/");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <div className="glass w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl gradient-accent text-2xl">
            🧠
          </div>
          <h1 className="font-display text-2xl font-semibold text-white">Daily Progress Tracker</h1>
          <p className="mt-1 text-sm text-slate-400">
            {mode === "login" ? "Sign in to continue" : "Create your account"}
          </p>
        </div>

        <div className="mb-6 flex rounded-xl bg-slate-900/80 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              mode === "login" ? "bg-white/15 text-white" : "text-slate-500"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              mode === "register" ? "bg-white/15 text-white" : "text-slate-500"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}
          {mode === "register" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none ring-violet-500/30 focus:ring-2"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none ring-violet-500/30 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none ring-violet-500/30 focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="mt-2 rounded-xl gradient-accent py-3 font-semibold text-white shadow-lg transition hover:opacity-95"
          >
            {mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link to="/" className="text-violet-400 hover:text-violet-300">
            ← Back to app
          </Link>{" "}
          · code name <span className="text-slate-500">daily_progress_tracker</span>
        </p>
      </div>
    </div>
  );
}
