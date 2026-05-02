export default function NoteEditor({ mode, form, setForm, onSave, onDelete }) {
  if (!mode) {
    return <p className="text-sm text-slate-500">Select a note or create a new one.</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="flex flex-col gap-3"
    >
      <h3 className="font-semibold text-white">{mode === "new" ? "Create" : "Edit"} note</h3>
      <input
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40"
      />
      <textarea
        rows={8}
        value={form.body}
        onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
        className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40"
      />
      <input
        placeholder="Tags: ML, Python, …"
        value={form.tags}
        onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
        className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/40"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-xl gradient-accent px-5 py-2.5 text-sm font-semibold text-white"
        >
          Save
        </button>
        {mode !== "new" && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-sm text-red-200"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
