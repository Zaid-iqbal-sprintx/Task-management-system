// Task data access for Milestone 3. The browser-only localStorage layer from
// Milestone 1 is gone — every function here now talks to the backend through
// src/lib/api.js. The exported names and arguments are unchanged so the pages
// and form didn't need rewiring beyond awaiting the (now async) results.
//
// The backend owns identity (the "TK-####" id) and the derived fields
// (comments, subtasks). The client only sends the editable form fields, shaped
// by toPayload below. See API_CONTRACT.md for the request/response shapes.

import { PEOPLE } from "./mockTasks";
import { api } from "./api";

// Prefer the team roster's initials; otherwise derive them from the name.
function initialsFor(name) {
  const person = PEOPLE.find((p) => p.name === name);
  if (person) return person.initials;
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Map a backend task document to the shape the UI renders. The backend is
// MongoDB-backed, so it returns `_id` (not `id`) and `due` as a full ISO
// timestamp (nullable). It also doesn't track comments/subtasks, so we default
// those display-only fields here. See API_CONTRACT.md.
function fromApi(doc) {
  return {
    id: doc._id,
    title: doc.title ?? "",
    description: doc.description ?? "",
    status: doc.status ?? "todo",
    priority: doc.priority ?? "medium",
    // Keep an absent assignee empty (not a fake "Unassigned" name) so the edit
    // form's required-field validation still fires. The card supplies the
    // "Unassigned" label for display only.
    assignee: doc.assignee?.name
      ? doc.assignee
      : { name: "", initials: "" },
    due: doc.due ? String(doc.due).slice(0, 10) : "", // ISO → "YYYY-MM-DD"
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    comments: doc.comments ?? 0,
    subtasks: doc.subtasks ?? { done: 0, total: 0 },
  };
}

// Shape the editable form values into the request body the API expects. The
// server fills in everything else (id, timestamps) on create.
function toPayload(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    status: values.status,
    priority: values.priority,
    assignee: { name: values.assignee, initials: initialsFor(values.assignee) },
    due: values.due,
    tags: [...values.tags],
  };
}

// All tasks, newest first (ordering is the server's responsibility). The API
// wraps the list in { success, count, data: [...] } — unwrap and normalize.
export async function loadTasks() {
  const body = await api.get("/api/tasks");
  return (body.data ?? []).map(fromApi);
}

// A single task by id, or null when the server reports it doesn't exist.
export async function getTask(id) {
  try {
    const body = await api.get(`/api/tasks/${encodeURIComponent(id)}`);
    return fromApi(body.data);
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

// Create (no existingId) or update (existingId) a task from form values.
// Resolves to the saved task as returned by the server.
export async function upsertTask(values, existingId) {
  const payload = toPayload(values);
  const body = existingId
    ? await api.put(`/api/tasks/${encodeURIComponent(existingId)}`, payload)
    : await api.post("/api/tasks", payload);
  return fromApi(body.data);
}

// Remove a task by id. Resolves once the server confirms the delete; callers
// update their own list (the old localStorage version returned the new list,
// but a round-trip response isn't guaranteed by the API now).
export async function deleteTask(id) {
  await api.del(`/api/tasks/${encodeURIComponent(id)}`);
}
