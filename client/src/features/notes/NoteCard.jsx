export default function NoteCard({ note, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(note)}
      className={`flex w-full flex-col rounded-xl border px-4 py-3 text-left transition ${
        active
          ? "border-violet-500/50 bg-violet-500/10"
          : "border-white/5 bg-slate-900/30 hover:border-white/10"
      }`}
    >
      <span className="font-medium text-slate-100">{note.title}</span>
      <span className="mt-1 line-clamp-2 text-xs text-slate-500">{note.body || "Empty note"}</span>
      {note.tags?.length > 0 && (
        <span className="mt-2 text-[10px] text-violet-300">{note.tags.join(" · ")}</span>
      )}
    </button>
  );
}
