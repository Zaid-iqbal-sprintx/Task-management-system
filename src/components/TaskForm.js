"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PEOPLE, PRIORITY_META, STATUS_META } from "@/lib/mockTasks";
import { upsertTask } from "@/lib/taskStore";

// Shared create/edit form for a task. There is no backend yet (Milestone 1),
// so a valid submit persists to the localStorage-backed task store and routes
// back to the board — the point of this PR is the form UX and inline
// validation, with edits surviving a reload.
//
// Usage:
//   <TaskForm mode="create" />
//   <TaskForm mode="edit" task={task} />

const TODAY = "2026-06-22"; // matches the app's "current date" used elsewhere

// Priority shown as a segmented control, lowest → highest.
const PRIORITY_ORDER = ["low", "medium", "high", "urgent"];
const STATUS_ORDER = ["todo", "in-progress", "done"];

const MAX_TITLE = 80;
const MAX_DESC = 280;
const MAX_TAGS = 6;

function blankValues() {
  return {
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignee: "",
    due: "",
    tags: [],
  };
}

// Build the initial form state from an existing task (edit mode).
function valuesFromTask(task) {
  return {
    title: task.title ?? "",
    description: task.description ?? "",
    status: task.status ?? "todo",
    priority: task.priority ?? "medium",
    assignee: task.assignee?.name ?? "",
    due: task.due ?? "",
    tags: Array.isArray(task.tags) ? [...task.tags] : [],
  };
}

// Pure validation — returns an { field: message } map. Empty map = valid.
// `creating` is true for new tasks, where we additionally block past due dates
// (existing tasks are allowed to keep a date that's now in the past).
function validate(values, creating) {
  const errors = {};
  const title = values.title.trim();

  if (!title) errors.title = "Give the task a title.";
  else if (title.length < 3) errors.title = "Title needs at least 3 characters.";
  else if (title.length > MAX_TITLE)
    errors.title = `Keep the title under ${MAX_TITLE} characters.`;

  if (values.description.length > MAX_DESC)
    errors.description = `Trim the description under ${MAX_DESC} characters.`;

  if (!values.assignee) errors.assignee = "Pick who owns this task.";

  if (!values.due) errors.due = "Set a due date.";
  else if (creating && values.due < TODAY)
    errors.due = "Due date can't be in the past.";

  if (values.tags.length > MAX_TAGS)
    errors.tags = `That's plenty — ${MAX_TAGS} tags max.`;

  return errors;
}

export default function TaskForm({ mode = "create", task = null }) {
  const router = useRouter();
  const creating = mode !== "edit";

  const [values, setValues] = useState(() =>
    task ? valuesFromTask(task) : blankValues()
  );
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false); // first submit attempt made
  const [saving, setSaving] = useState(false);
  const [tagDraft, setTagDraft] = useState("");
  const formRef = useRef(null);

  const titleCount = values.title.length;
  const descCount = values.description.length;

  // Once the user has tried to submit, validate live so fixing a field clears
  // its error immediately rather than waiting for the next submit.
  function commit(next) {
    setValues(next);
    if (submitted) setErrors(validate(next, creating));
  }

  function setField(name, value) {
    commit({ ...values, [name]: value });
  }

  function addTag(raw) {
    const tag = raw.trim().replace(/^#/, "").toLowerCase();
    setTagDraft("");
    if (!tag || values.tags.includes(tag)) return;
    commit({ ...values, tags: [...values.tags, tag] });
  }

  function removeTag(tag) {
    commit({ ...values, tags: values.tags.filter((t) => t !== tag) });
  }

  // Enter or comma commits the current tag; Backspace on an empty input pops
  // the last chip so the tag field feels like the rest of the app.
  function onTagKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagDraft);
    } else if (e.key === "Backspace" && !tagDraft && values.tags.length) {
      removeTag(values.tags[values.tags.length - 1]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values, creating);
    setSubmitted(true);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Move focus to the first field with an error.
      const first = formRef.current?.querySelector("[aria-invalid='true']");
      first?.focus();
      return;
    }

    // No backend yet — persist to the local task store, then return to the
    // board. The brief delay keeps the "Saving…" affordance from flashing.
    setSaving(true);
    upsertTask(values, task?.id);
    setTimeout(() => router.push("/tasks"), 700);
  }

  const heading = creating ? "New Task" : "Edit Task";
  const sub = creating
    ? "Capture the work — a clear title and an owner are all we need to start."
    : `Updating ${task?.id ?? "task"}. Tweak anything below and save.`;

  return (
    <div className="tk">
      <div className="tk-aura tk-aura--gold" aria-hidden="true" />
      <div className="tk-aura tk-aura--bronze" aria-hidden="true" />

      <header className="tk-form-head">
        <div>
          <p className="tk-eyebrow">
            {creating ? "Create" : "Edit"} · Taskify
          </p>
          <h1 className="tk-title">{heading}</h1>
          <p className="tk-sub">{sub}</p>
        </div>
        <Link href="/tasks" className="tk-back">
          <ArrowIcon />
          Back to board
        </Link>
      </header>

      <form
        ref={formRef}
        className="tk-form"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Title */}
        <div className="tk-field">
          <div className="tk-label-row">
            <label htmlFor="title" className="tk-label">
              Title <span className="tk-req">*</span>
            </label>
            <span className="tk-counter">
              {titleCount}/{MAX_TITLE}
            </span>
          </div>
          <input
            id="title"
            type="text"
            className={`tk-input${errors.title ? " is-invalid" : ""}`}
            placeholder="e.g. Redesign onboarding flow"
            value={values.title}
            maxLength={MAX_TITLE}
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby={errors.title ? "title-err" : undefined}
            onChange={(e) => setField("title", e.target.value)}
          />
          <FieldError id="title-err" message={errors.title} />
        </div>

        {/* Description */}
        <div className="tk-field">
          <div className="tk-label-row">
            <label htmlFor="description" className="tk-label">
              Description
            </label>
            <span
              className={`tk-counter${
                descCount > MAX_DESC ? " is-over" : ""
              }`}
            >
              {descCount}/{MAX_DESC}
            </span>
          </div>
          <textarea
            id="description"
            rows={4}
            className={`tk-textarea${errors.description ? " is-invalid" : ""}`}
            placeholder="Add context, acceptance criteria, or links…"
            value={values.description}
            aria-invalid={errors.description ? "true" : "false"}
            aria-describedby={errors.description ? "description-err" : undefined}
            onChange={(e) => setField("description", e.target.value)}
          />
          <FieldError id="description-err" message={errors.description} />
        </div>

        {/* Status + Assignee */}
        <div className="tk-grid-2">
          <div className="tk-field">
            <label htmlFor="status" className="tk-label">
              Status
            </label>
            <div className="tk-select tk-select--block">
              <select
                id="status"
                value={values.status}
                onChange={(e) => setField("status", e.target.value)}
              >
                {STATUS_ORDER.map((key) => (
                  <option key={key} value={key}>
                    {STATUS_META[key].label}
                  </option>
                ))}
              </select>
              <ChevronIcon />
            </div>
          </div>

          <div className="tk-field">
            <label htmlFor="assignee" className="tk-label">
              Assignee <span className="tk-req">*</span>
            </label>
            <div className="tk-select tk-select--block">
              <select
                id="assignee"
                className={errors.assignee ? "is-invalid" : ""}
                value={values.assignee}
                aria-invalid={errors.assignee ? "true" : "false"}
                aria-describedby={errors.assignee ? "assignee-err" : undefined}
                onChange={(e) => setField("assignee", e.target.value)}
              >
                <option value="">Unassigned…</option>
                {PEOPLE.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronIcon />
            </div>
            <FieldError id="assignee-err" message={errors.assignee} />
          </div>
        </div>

        {/* Priority (segmented) + Due date */}
        <div className="tk-grid-2">
          <div className="tk-field">
            <span className="tk-label">Priority</span>
            <div className="tk-seg" role="radiogroup" aria-label="Priority">
              {PRIORITY_ORDER.map((key) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={values.priority === key}
                  className={`tk-seg-btn tk-seg-btn--${key}${
                    values.priority === key ? " is-active" : ""
                  }`}
                  onClick={() => setField("priority", key)}
                >
                  {PRIORITY_META[key].label}
                </button>
              ))}
            </div>
          </div>

          <div className="tk-field">
            <label htmlFor="due" className="tk-label">
              Due date <span className="tk-req">*</span>
            </label>
            <input
              id="due"
              type="date"
              className={`tk-input${errors.due ? " is-invalid" : ""}`}
              value={values.due}
              min={creating ? TODAY : undefined}
              aria-invalid={errors.due ? "true" : "false"}
              aria-describedby={errors.due ? "due-err" : undefined}
              onChange={(e) => setField("due", e.target.value)}
            />
            <FieldError id="due-err" message={errors.due} />
          </div>
        </div>

        {/* Tags */}
        <div className="tk-field">
          <div className="tk-label-row">
            <label htmlFor="tags" className="tk-label">
              Tags
            </label>
            <span className="tk-counter">
              {values.tags.length}/{MAX_TAGS}
            </span>
          </div>
          <div
            className={`tk-chips${errors.tags ? " is-invalid" : ""}`}
            onClick={() => document.getElementById("tags")?.focus()}
          >
            {values.tags.map((tag) => (
              <span key={tag} className="tk-chip">
                #{tag}
                <button
                  type="button"
                  className="tk-chip-x"
                  aria-label={`Remove ${tag}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              id="tags"
              type="text"
              className="tk-chip-input"
              placeholder={
                values.tags.length ? "Add another…" : "design, growth…"
              }
              value={tagDraft}
              aria-describedby={errors.tags ? "tags-err" : "tags-hint"}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={onTagKeyDown}
              onBlur={() => tagDraft && addTag(tagDraft)}
            />
          </div>
          {errors.tags ? (
            <FieldError id="tags-err" message={errors.tags} />
          ) : (
            <p id="tags-hint" className="tk-hint">
              Press Enter or comma to add a tag.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="tk-form-actions">
          <Link href="/tasks" className="tk-btn tk-btn--ghost">
            Cancel
          </Link>
          <button
            type="submit"
            className="tk-btn tk-btn--primary"
            disabled={saving}
          >
            {saving ? (
              <>
                <SpinnerIcon />
                Saving…
              </>
            ) : creating ? (
              "Create task"
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------ sub-components ----------------------------- */

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="tk-error" role="alert">
      <WarnIcon />
      {message}
    </p>
  );
}

/* --------------------------------- icons ----------------------------------- */

function iconProps(size = 16) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
}

function ArrowIcon() {
  return (
    <svg {...iconProps(15)}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg {...iconProps(14)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function WarnIcon() {
  return (
    <svg {...iconProps(14)}>
      <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg {...iconProps(15)} className="tk-spin">
      <path d="M21 12a9 9 0 1 1-6.2-8.5" />
    </svg>
  );
}
