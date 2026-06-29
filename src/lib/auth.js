// Auth actions for the UI: register, login, logout. These wrap the backend's
// /api/auth/* endpoints and persist the returned token + user via session.js,
// so api.js then sends the token on every protected request.

import { api } from "./api";
import { setSession, clearSession, getUser, isAuthenticated } from "./session";

// Create an account. The backend logs the user in on success (returns a token),
// so we store the session and resolve with the user.
export async function register({ name, email, password }) {
  const body = await api.post("/api/auth/register", { name, email, password });
  setSession(body.token, body.data);
  return body.data;
}

// Exchange credentials for a token and store the session.
export async function login({ email, password }) {
  const body = await api.post("/api/auth/login", { email, password });
  setSession(body.token, body.data);
  return body.data;
}

// Drop the local session. There's no server call — a JWT is stateless, so
// "logging out" just means forgetting the token on this device.
export function logout() {
  clearSession();
}

// Re-exported so components can read auth state without also importing session.
export { getUser, isAuthenticated };
