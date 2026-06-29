// Thin fetch wrapper around the task backend (Milestone 3). Centralises the
// base URL, JSON headers, and error handling so the rest of the app can call
// api.get("/api/tasks") and get parsed JSON or a thrown ApiError — never a raw
// Response. The backend runs as a separate service; its URL comes from
// NEXT_PUBLIC_BACKEND_URL (see .env). Auth headers will be added here in PR 9.

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

// A failed request — `status` is the HTTP code, or 0 when the network/server
// was unreachable (so callers can tell "server said no" from "no server").
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
  } catch {
    // fetch only rejects on network failure / CORS / DNS — not on 4xx/5xx.
    throw new ApiError(
      "Can't reach the server. Is the backend running?",
      0
    );
  }

  if (!res.ok) {
    // Prefer a server-supplied { message } but fall back to the status code.
    let message = `Request failed (${res.status}).`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      /* response had no JSON body — keep the default message */
    }
    throw new ApiError(message, res.status);
  }

  // 204 No Content (e.g. DELETE) has nothing to parse.
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  del: (path) => request(path, { method: "DELETE" }),
};
