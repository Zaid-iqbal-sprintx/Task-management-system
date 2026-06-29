// Auth actions for the UI: register, login, logout. These wrap the backend's
// /api/auth/* endpoints and persist the returned token + user via session.js,
// so api.js then sends the token on every protected request.

import { api } from "./api";
import { setSession, clearSession, getUser, isAuthenticated } from "./session";

// Create an account. The backend returns a token, but we deliberately do NOT
// store a session here — the user is sent to the login page to sign in. We drop
// any existing session so registering always lands on a clean login screen.
export async function register({ name, email, password }) {
  const body = await api.post("/api/auth/register", { name, email, password });
  clearSession();
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
