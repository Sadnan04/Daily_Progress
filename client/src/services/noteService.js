import api from "./api.js";

export function listNotes() {
  return api.get("/notes").then((r) => r.data.notes);
}

export function createNote(body) {
  return api.post("/notes", body).then((r) => r.data.note);
}

export function updateNote(id, body) {
  return api.patch(`/notes/${id}`, body).then((r) => r.data.note);
}

export function deleteNote(id) {
  return api.delete(`/notes/${id}`).then((r) => r.data);
}
