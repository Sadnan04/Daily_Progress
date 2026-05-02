import api from "./api.js";

export function getSummary() {
  return api.get("/tracker/summary").then((r) => r.data);
}

export function getState() {
  return api.get("/tracker/state").then((r) => r.data);
}

export function toggleTask(week, day, taskId) {
  return api.patch("/tracker/toggle", { week, day, taskId }).then((r) => r.data);
}

export function resetWeek(week) {
  return api.post(`/tracker/week/${week}/reset`).then((r) => r.data);
}

export function getAnalytics() {
  return api.get("/tracker/analytics").then((r) => r.data);
}
