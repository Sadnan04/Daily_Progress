import api, { setAuthToken } from "./api.js";

export async function loginRequest(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  setAuthToken(data.token);
  return data;
}

export async function signupRequest(payload) {
  const { data } = await api.post("/auth/signup", payload);
  setAuthToken(data.token);
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data.user;
}

export async function updateProfileRequest(body) {
  const { data } = await api.patch("/users/me", body);
  return data.user;
}

export async function changePasswordRequest(currentPassword, newPassword) {
  await api.patch("/users/me/password", { currentPassword, newPassword });
}

export async function updateSettingsRequest(body) {
  const { data } = await api.patch("/users/me/settings", body);
  return data.user;
}

export async function resetProgressRequest() {
  const { data } = await api.post("/users/me/reset-progress");
  return data.user;
}

export function clearSession() {
  setAuthToken(null);
}
