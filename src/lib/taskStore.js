// Client-side task persistence for Milestone 1. There's no backend yet, so we
// keep created/edited tasks in localStorage and seed from the mock data on the
// first visit. Everything here is browser-only — guard against SSR.

import { TASKS, PEOPLE } from "./mockTasks";

const KEY = "taskify.tasks.v1";

// Read the current task list. Falls back to the seed data when nothing has been
// saved yet (or when running on the server, where localStorage doesn't exist).
export function loadTasks() {
  if (typeof window === "undefined") return TASKS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return TASKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : TASKS;
  } catch {
    return TASKS;
  }
}

export function getTask(id) {
  return loadTasks().find((t) => t.id === id) ?? null;
}

function persist(tasks) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {
    /* storage full or blocked — nothing we can do in a mock app */
  }
}

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

// Next "TK-####" id, one past the highest existing numeric suffix.
function nextId(tasks) {
  const nums = tasks
    .map((t) => parseInt(String(t.id).replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1000;
  return `TK-${max + 1}`;
}

// Shape a card-ready task from raw form values.
function toTask(values, base = {}) {
  return {
    comments: 0,
    subtasks: { done: 0, total: 0 },
    ...base,
    title: values.title.trim(),
    description: values.description.trim(),
    status: values.status,
    priority: values.priority,
    assignee: { name: values.assignee, initials: initialsFor(values.assignee) },
    due: values.due,
    tags: [...values.tags],
  };
}

// Create or update a task from form values. Returns the task's id so the caller
// can navigate to it.
export function upsertTask(values, existingId) {
  const tasks = loadTasks();

  if (existingId) {
    const next = tasks.map((t) =>
      t.id === existingId ? toTask(values, t) : t
    );
    persist(next);
    return existingId;
  }

  const task = toTask(values, { id: nextId(tasks) });
  persist([task, ...tasks]);
  return task.id;
}

// Remove a task by id and persist the result. Returns the trimmed list so the
// caller can update its own state without a second loadTasks() round-trip.
export function deleteTask(id) {
  const next = loadTasks().filter((t) => t.id !== id);
  persist(next);
  return next;
}
