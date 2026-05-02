import { useState } from "react";

export default function ProjectForm({ onSubmit }) {
  const [form, setForm] = useState({ title: "", description: "", githubUrl: "", status: "ongoing" });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
    setForm({ title: "", description: "", githubUrl: "", status: "ongoing" });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40"
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        rows={3}
        className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40"
      />
      <input
        placeholder="GitHub URL"
        value={form.githubUrl}
        onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
        className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40"
      />
      <button
        type="submit"
        className="w-fit rounded-xl gradient-accent px-6 py-3 text-sm font-semibold text-white shadow-lg"
      >
        Add project
      </button>
    </form>
  );
}
