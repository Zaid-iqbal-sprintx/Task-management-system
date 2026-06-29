# Task API contract (Milestone 3)

The frontend (this repo) talks to the **CRUD_BACKEND** service
(`/Users/zaid/Projects/CRUD_BACKEND`) — Express + MongoDB on port **5002**. Its
base URL comes from `NEXT_PUBLIC_BACKEND_URL` in `.env`
(default `http://localhost:5002`). All requests/responses are JSON.

This documents the **actual** backend shape and how the frontend adapts to it
(`src/lib/api.js` transport + `src/lib/taskStore.js` normalisation).

> Scope: task CRUD (PR 7) plus auth (`/api/auth/*`) and JWT-protected task
> endpoints. The task routes now require a valid bearer token — see **Auth**.

## Response envelope

Every response is wrapped. The frontend unwraps `.data` in `taskStore.js`.

```jsonc
// list
{ "success": true, "count": 3, "data": [ /* Task */ ] }
// single / create / update / delete
{ "success": true, "message": "Task created", "data": { /* Task */ } }
// error
{ "success": false, "message": "No task found with id …" }
```

## The Task document (responses)

```jsonc
{
  "_id": "665f…",                   // Mongo ObjectId — frontend maps to `id`
  "title": "Redesign onboarding flow",
  "description": "Cut the signup steps…",
  "status": "todo",                 // "todo" | "in-progress" | "done"
  "priority": "high",               // "low" | "medium" | "high" | "urgent"
  "due": "2026-06-25T00:00:00.000Z",// ISO timestamp or null → frontend slices to "YYYY-MM-DD"
  "assignee": { "name": "Sara Khan", "initials": "SK" },
  "tags": ["design", "growth"],
  "createdAt": "…", "updatedAt": "…"
}
```

`comments` and `subtasks` are **not** stored by the backend; the frontend
defaults them (`0` and `{ done: 0, total: 0 }`) for display only.

## Request body (create / update)

The client sends only editable fields (controller ignores anything else):

```jsonc
{
  "title": "string",                // required, 1–120 chars
  "description": "string",          // optional, ≤ 2000
  "status": "todo | in-progress | done",
  "priority": "low | medium | high | urgent",
  "due": "YYYY-MM-DD",              // cast to Date by Mongoose
  "assignee": { "name": "string", "initials": "string" },
  "tags": ["string"]
}
```

> `assignee` and `tags` were added to the backend in Milestone 3
> (`CRUD_BACKEND/src/models/Task.js` + `ALLOWED_FIELDS` in the controller).

## Endpoints

| Method      | Path             | Body        | Success | `data` |
|-------------|------------------|-------------|---------|--------|
| GET         | `/api/tasks`     | —           | `200`   | `Task[]` (newest first; `?status=`/`?priority=` supported) |
| GET         | `/api/tasks/:id` | —           | `200`/`404` | `Task` |
| POST        | `/api/tasks`     | create body | `201`   | created `Task` |
| PUT / PATCH | `/api/tasks/:id` | update body | `200`/`404` | updated `Task` |
| DELETE      | `/api/tasks/:id` | —           | `200`   | deleted `Task` |

`:id` is the Mongo `_id`. The edit page treats a GET `404` as "task not found".

All five task endpoints are **protected**: the request must carry
`Authorization: Bearer <token>`. Without a valid token the backend replies
`401` and the frontend's `RequireAuth` guard bounces the user to `/login`.

## Auth

Accounts live in MongoDB (`CRUD_BACKEND/src/models/User.js`); passwords are
bcrypt-hashed and never returned. Register/login return a JWT the client stores
(`src/lib/session.js` → localStorage) and replays on every task request
(`src/lib/api.js`). The token is signed with `JWT_SECRET` and expires after
`JWT_EXPIRES_IN` (default `7d`) — both set in the backend `.env`.

| Method | Path                 | Body                        | Success | Response                |
|--------|----------------------|-----------------------------|---------|-------------------------|
| POST   | `/api/auth/register` | `{ name, email, password }` | `201`   | `{ token, data: User }` |
| POST   | `/api/auth/login`    | `{ email, password }`       | `200`   | `{ token, data: User }` |
| GET    | `/api/auth/me`       | — (bearer token)            | `200`   | `{ data: User }`        |

```jsonc
// User in responses — never includes the password hash
{ "id": "665f…", "name": "Sara Khan", "email": "sara@example.com" }
```

Failure modes: duplicate email on register → `409`; bad credentials on login →
`401` (same message whether the email is unknown or the password is wrong);
missing/invalid/expired token on a protected route → `401`.

## CORS

Backend allows `CORS_ORIGIN` (set to `http://localhost:3000` in its `.env`), so
the frontend on `:3000` works out of the box.
