import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" }
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("dpt_token", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("dpt_token");
  }
}

const stored = localStorage.getItem("dpt_token");
if (stored) {
  api.defaults.headers.common.Authorization = `Bearer ${stored}`;
}

export default api;
