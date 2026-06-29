// Browser-side session storage for auth (PR: auth). Holds the JWT and the
// signed-in user in localStorage so a refresh keeps you logged in.
//
// This module deliberately imports nothing from the app: api.js reads the token
// from here to set the Authorization header, and auth.js writes here after a
// login/register. Keeping it dependency-free avoids a circular import between
// those two.

const TOKEN_KEY = "taskify_token";
const USER_KEY = "taskify_user";

// localStorage only exists in the browser. These guards keep the helpers safe
// to call during server rendering (where they simply act as "logged out").
const hasWindow = () => typeof window !== "undefined";

export function getToken() {
  return hasWindow() ? window.localStorage.getItem(TOKEN_KEY) : null;
}

export function getUser() {
  if (!hasWindow()) return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null; // corrupted value — treat as logged out
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function setSession(token, user) {
  if (!hasWindow()) return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (!hasWindow()) return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
