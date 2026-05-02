import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import NoteCard from "../features/notes/NoteCard.jsx";
import NoteEditor from "../features/notes/NoteEditor.jsx";
import * as noteService from "../services/noteService.js";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", body: "", tags: "" });

  async function load() {
    const list = await noteService.listNotes();
    setNotes(list);
    setLoading(false);
  }

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  function startNew() {
    setEditingId("new");
    setForm({ title: "", body: "", tags: "" });
  }

  function startEdit(note) {
    setEditingId(note._id);
    setForm({
      title: note.title,
      body: note.body,
      tags: note.tags.join(", ")
    });
  }

  async function saveNote() {
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (editingId === "new") {
      await noteService.createNote({ title: form.title, body: form.body, tags });
    } else {
      await noteService.updateNote(editingId, { title: form.title, body: form.body, tags });
    }
    setEditingId(null);
    await load();
  }

  async function removeNote() {
    if (editingId === "new" || !editingId) return;
    if (!confirm("Delete note?")) return;
    await noteService.deleteNote(editingId);
    setEditingId(null);
    await load();
  }

  if (loading) return <p className="text-slate-500">Loading notes…</p>;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <Card className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-white">Notes</h2>
          <button
            type="button"
            onClick={startNew}
            className="rounded-xl gradient-accent px-4 py-2 text-sm font-semibold text-white"
          >
            New note
          </button>
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {notes.map((n) => (
            <li key={n._id}>
              <NoteCard note={n} active={editingId === n._id} onSelect={startEdit} />
            </li>
          ))}
        </ul>
      </Card>

      <Card className="w-full shrink-0 lg:w-[420px]">
        <NoteEditor
          mode={editingId}
          form={form}
          setForm={setForm}
          onSave={saveNote}
          onDelete={removeNote}
        />
      </Card>
    </div>
  );
}
