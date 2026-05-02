import Note from "../models/Note.js";

export async function listNotes(req, res) {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ updatedAt: -1 });
    return res.json({ notes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to list notes" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, body, tags } = req.body;
    const note = await Note.create({
      userId: req.userId,
      title: title?.trim() || "Untitled",
      body: body ?? "",
      tags: Array.isArray(tags) ? tags.map((t) => String(t).trim()).filter(Boolean) : []
    });
    return res.status(201).json({ note });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Create failed" });
  }
}

export async function updateNote(req, res) {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json({ error: "Not found" });
    const { title, body, tags } = req.body;
    if (title !== undefined) note.title = String(title).trim() || "Untitled";
    if (body !== undefined) note.body = String(body);
    if (tags !== undefined) {
      note.tags = Array.isArray(tags) ? tags.map((t) => String(t).trim()).filter(Boolean) : [];
    }
    await note.save();
    return res.json({ note });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Update failed" });
  }
}

export async function deleteNote(req, res) {
  try {
    const result = await Note.deleteOne({ _id: req.params.id, userId: req.userId });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Delete failed" });
  }
}
