import api from "./api.js";

export function listProjects() {
  return api.get("/projects").then((r) => r.data.projects);
}

export function createProject(body) {
  return api.post("/projects", body).then((r) => r.data.project);
}

export function updateProject(id, body) {
  return api.patch(`/projects/${id}`, body).then((r) => r.data.project);
}

export function deleteProject(id) {
  return api.delete(`/projects/${id}`).then((r) => r.data);
}
