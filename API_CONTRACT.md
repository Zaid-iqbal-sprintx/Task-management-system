# Task API contract (Milestone 3)

The frontend (this repo) talks to the **CRUD_BACKEND** service
(`/Users/zaid/Projects/CRUD_BACKEND`) — Express + MongoDB on port **5002**. Its
base URL comes from `NEXT_PUBLIC_BACKEND_URL` in `.env`
(default `http://localhost:5002`). All requests/responses are JSON.

This documents the **actual** backend shape and how the frontend adapts to it
(`src/lib/api.js` transport + `src/lib/taskStore.js` normalisation).

> Scope: PR 7 covers task CRUD, unauthenticated. Auth (`/api/auth/*`) + JWT
> protection lands in PR 9 — not built on either side yet.

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

## CORS

Backend allows `CORS_ORIGIN` (set to `http://localhost:3000` in its `.env`), so
the frontend on `:3000` works out of the box.
