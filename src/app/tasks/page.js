"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { STATUS_META, PRIORITY_META } from "@/lib/mockTasks";
import { loadTasks, deleteTask } from "@/lib/taskStore";

// The Midnight Gold dashboard. Loads tasks from the backend (via taskStore →
// api). Status and priority filtering run server-side (re-fetched as query
// params when they change); title search runs client-side over the fetched
// board. The stat cards are sourced from a separate unfiltered fetch so the
// totals stay whole even while the board is narrowed. Styling lives in
// globals.css under the scoped .tk-* classes.

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

const TODAY = "2026-06-22"; // matches the app's "current date" for overdue math

export default function TasksPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");

  // Two task sources with different jobs:
  //   • allTasks — the full unfiltered list, used only for the stat cards so
  //     the totals stay whole regardless of the active filter.
  //   • tasks    — the board, fetched with the server-side status/priority
  //     filters applied. Title search narrows this further, client-side.
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);

  // `ready` gates the branded loader for the first paint only; `error` holds an
  // initial-load failure so we can offer a retry instead of an empty board.
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  // A filter change re-fetches the board. `refreshing` drives a non-blocking
  // busy state (the toolbar stays usable); `boardError` holds a refetch failure
  // without tearing down the whole dashboard.
  const [refreshing, setRefreshing] = useState(false);
  const [boardError, setBoardError] = useState(null);

  // The task awaiting delete confirmation (null when the dialog is closed),
  // plus in-flight + error state for the delete request itself.
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Fetch the board for the current status/priority filters. Re-runnable so the
  // board error state can offer a retry.
  const refreshBoard = useCallback(async () => {
    setRefreshing(true);
    setBoardError(null);
    try {
      setTasks(await loadTasks({ status, priority }));
    } catch (err) {
      setBoardError(err.message || "Couldn't load tasks.");
    } finally {
      setRefreshing(false);
    }
  }, [status, priority]);

  // Initial load: pull the unfiltered list once (it seeds both the stats and
  // the board, since filters start at "all"). Re-runnable for the retry button.
  const loadInitial = useCallback(async () => {
    setReady(false);
    setError(null);
    try {
      const all = await loadTasks();
      setAllTasks(all);
      setTasks(all);
    } catch (err) {
      setError(err.message || "Couldn't load tasks.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // Re-fetch the board when a server-side filter changes — but skip the first
  // run, which the initial load already covered, to avoid a duplicate request.
  const firstFilterRun = useRef(true);
  useEffect(() => {
    if (firstFilterRun.current) {
      firstFilterRun.current = false;
      return;
    }
    refreshBoard();
  }, [refreshBoard]);

  // Delete on the server, then drop it from both lists so the grid + stats
  // update without a reload. Keep the dialog open on failure so the message is
  // visible and the user can retry or cancel.
  async function confirmDelete() {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteTask(pendingDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== pendingDelete.id));
      setAllTasks((prev) => prev.filter((t) => t.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      setDeleteError(err.message || "Couldn't delete the task.");
    } finally {
      setDeleting(false);
    }
  }

  // Reset the delete dialog's transient state whenever it closes/reopens.
  function closeDelete() {
    setPendingDelete(null);
    setDeleteError(null);
  }

  // Stats come from the full unfiltered list, never the filtered board.
  const stats = useMemo(() => {
    const total = allTasks.length;
    const inProgress = allTasks.filter((t) => t.status === "in-progress").length;
    const done = allTasks.filter((t) => t.status === "done").length;
    const overdue = allTasks.filter(
      (t) => t.status !== "done" && t.due && t.due < TODAY
    ).length;
    return { total, inProgress, done, overdue };
  }, [allTasks]);

  const completion = stats.total
    ? Math.round((stats.done / stats.total) * 100)
    : 0;

  // Status/priority are already applied server-side; here we only narrow by the
  // title search and order by priority. Copy before sorting (sort mutates).
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q
      ? tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.toLowerCase().includes(q))
        )
      : tasks;
    return [...matches].sort(
      (a, b) => PRIORITY_META[b.priority].rank - PRIORITY_META[a.priority].rank
    );
  }, [tasks, query]);

  function resetFilters() {
    setQuery("");
    setStatus("all");
    setPriority("all");
  }

  if (!ready) return <DashboardLoader />;
  if (error) return <DashboardError message={error} onRetry={loadInitial} />;

  return (
    <div className="tk">
      <div className="tk-aura tk-aura--gold" aria-hidden="true" />
      <div className="tk-aura tk-aura--bronze" aria-hidden="true" />

      {/* Greeting + primary action */}
      <header className="tk-top">
        <div>
          <p className="tk-eyebrow">Monday · June 22, 2026</p>
          <h1 className="tk-title">
            Good evening, <em>Zaid</em>
          </h1>
          <p className="tk-sub">
            You have {stats.total - stats.done} open tasks and {stats.overdue}{" "}
            running late. Here&rsquo;s the board.
          </p>
        </div>
        <Link href="/tasks/new" className="tk-cta">
          <PlusIcon />
          New Task
        </Link>
      </header>

      {/* Stat cards */}
      <section className="tk-stats">
        <StatCard
          label="Total Tasks"
          value={stats.total}
          tone="neutral"
          icon={<StackIcon />}
          foot={`${completion}% complete`}
          progress={completion}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          tone="gold"
          icon={<SpinIcon />}
          foot="Active right now"
        />
        <StatCard
          label="Completed"
          value={stats.done}
          tone="green"
          icon={<CheckIcon />}
          foot="Nicely done"
        />
        <StatCard
          label="Overdue"
          value={stats.overdue}
          tone="red"
          icon={<FlameIcon />}
          foot="Needs attention"
        />
      </section>

      {/* Toolbar: search + status tabs + priority select */}
      <section className="tk-toolbar">
        <div className="tk-search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search tasks, tags, or IDs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="tk-search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="tk-tabs" role="tablist">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={status === tab.key}
              className={`tk-tab${status === tab.key ? " is-active" : ""}`}
              onClick={() => setStatus(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tk-select">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Filter by priority"
          >
            <option value="all">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <ChevronIcon />
        </div>
      </section>

      {/* Task board. Re-fetches on a filter change: a failure shows an inline
          error+retry (toolbar stays usable), otherwise the grid is marked busy
          while the new results load so it doesn't read as "no matches". */}
      {boardError ? (
        <div className="tk-empty">
          <div className="tk-empty-mark">!</div>
          <h3>Couldn&rsquo;t update the board</h3>
          <p>{boardError}</p>
          <button className="tk-empty-reset" onClick={refreshBoard}>
            Try again
          </button>
        </div>
      ) : filtered.length > 0 ? (
        <section className="tk-grid" aria-busy={refreshing}>
          {filtered.map((task, i) => (
            <TaskCard
              key={task.id}
              task={task}
              index={i}
              onDelete={() => setPendingDelete(task)}
            />
          ))}
        </section>
      ) : refreshing ? (
        <div className="tk-empty" aria-busy="true">
          <div className="tk-empty-mark">⋯</div>
          <h3>Updating the board…</h3>
        </div>
      ) : (
        <div className="tk-empty">
          <div className="tk-empty-mark">∅</div>
          <h3>No tasks match your filters</h3>
          <p>Try clearing the search or switching back to “All”.</p>
          <button className="tk-empty-reset" onClick={resetFilters}>
            Reset filters
          </button>
        </div>
      )}

      {pendingDelete && (
        <DeleteDialog
          task={pendingDelete}
          deleting={deleting}
          error={deleteError}
          onCancel={closeDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

/* ------------------------------ sub-components ----------------------------- */

function DashboardLoader() {
  return (
    <div className="tk-loader" role="status" aria-live="polite">
      <h1 className="tk-loader-word" data-text="Taskify">
        Taskify
      </h1>
      <div className="tk-loader-bar" aria-hidden="true">
        <span />
      </div>
      <span className="tk-sr">Loading dashboard…</span>
    </div>
  );
}

// Shown when the initial task load fails — keeps the user from staring at an
// empty board and lets them retry without a full page reload.
function DashboardError({ message, onRetry }) {
  return (
    <div className="tk">
      <div className="tk-empty">
        <div className="tk-empty-mark">!</div>
        <h3>Couldn&rsquo;t load your tasks</h3>
        <p>{message}</p>
        <button className="tk-empty-reset" onClick={onRetry}>
          Try again
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone, icon, foot, progress }) {
  return (
    <article className={`tk-stat tk-stat--${tone}`}>
      <div className="tk-stat-head">
        <span className="tk-stat-icon">{icon}</span>
        <span className="tk-stat-label">{label}</span>
      </div>
      <div className="tk-stat-value">{value}</div>
      {progress != null ? (
        <div className="tk-stat-bar" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      <p className="tk-stat-foot">{foot}</p>
    </article>
  );
}

function TaskCard({ task, index, onDelete }) {
  const overdue = task.status !== "done" && task.due && task.due < TODAY;
  const { done, total } = task.subtasks;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <article
      className={`tk-card tk-card--${task.priority}`}
      style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
    >
      <div className="tk-card-stripe" aria-hidden="true" />

      <div className="tk-card-row">
        <span className="tk-card-row-left">
          <span className={`tk-badge tk-badge--${task.status}`}>
            {STATUS_META[task.status].label}
          </span>
        </span>
        <span className="tk-card-actions">
          <Link
            href={`/tasks/${task.id}/edit`}
            className="tk-card-edit"
            aria-label={`Edit ${task.title}`}
          >
            <PencilIcon />
            Edit
          </Link>
          <button
            type="button"
            className="tk-card-delete"
            onClick={onDelete}
            aria-label={`Delete ${task.title}`}
          >
            <TrashIcon />
            Delete
          </button>
        </span>
      </div>

      <h3 className="tk-card-title">{task.title}</h3>
      <p className="tk-card-desc">{task.description}</p>

      <div className="tk-tags">
        <span className={`tk-prio tk-prio--${task.priority}`}>
          {PRIORITY_META[task.priority].label}
        </span>
        {task.tags.map((tag) => (
          <span key={tag} className="tk-tag">
            #{tag}
          </span>
        ))}
      </div>

      {/* Subtask progress */}
      <div className="tk-card-progress">
        <div className="tk-card-progress-bar" aria-hidden="true">
          <span style={{ width: `${pct}%` }} />
        </div>
        <span className="tk-card-progress-label">
          {task.subtasks.done}/{task.subtasks.total}
        </span>
      </div>

      <footer className="tk-card-foot">
        <span className="tk-avatar" title={task.assignee.name || "Unassigned"}>
          {task.assignee.initials || "—"}
        </span>
        <span className="tk-assignee">
          {task.assignee.name || "Unassigned"}
        </span>

        <span className="tk-card-meta">
          <span className="tk-meta-item" title="Comments">
            <CommentIcon />
            {task.comments}
          </span>
          <span
            className={`tk-meta-item${overdue ? " is-overdue" : ""}`}
            title="Due date"
          >
            <CalendarIcon />
            {formatDue(task.due)}
          </span>
        </span>
      </footer>
    </article>
  );
}

// Confirmation dialog shown before a task is permanently removed. Closes on
// backdrop click or Escape; the actual delete only happens on "Delete task".
function DeleteDialog({ task, deleting, error, onCancel, onConfirm }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !deleting) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, deleting]);

  // Rendered into <body> via a portal so the fixed overlay is positioned
  // against the viewport, never trapped inside the dashboard's layout.
  return createPortal(
    <div
      className="tk-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tk-delete-title"
      onClick={deleting ? undefined : onCancel}
    >
      <div className="tk-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="tk-modal-icon" aria-hidden="true">
          <TrashIcon />
        </div>
        <h2 id="tk-delete-title" className="tk-modal-title">
          Delete this task?
        </h2>
        <p className="tk-modal-text">
          <strong>{task.title}</strong> will be removed for good. This
          can&rsquo;t be undone.
        </p>
        {error && (
          <p className="tk-error" role="alert">
            {error}
          </p>
        )}
        <div className="tk-modal-actions">
          <button
            type="button"
            className="tk-modal-cancel"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="tk-modal-confirm"
            onClick={onConfirm}
            disabled={deleting}
            autoFocus
          >
            {deleting ? "Deleting…" : "Delete task"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function formatDue(iso) {
  if (!iso) return "No date";
  const [, m, d] = iso.split("-").map(Number);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[m - 1]} ${d}`;
}

/* --------------------------------- icons ----------------------------------- */
// Inline SVGs keep the dashboard dependency-free. 1.7 stroke matches the login.

function iconProps() {
  return {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
}

function PlusIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg {...iconProps()} width="13" height="13">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg {...iconProps()} width="13" height="13">
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
function StackIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}
function SpinIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M21 12a9 9 0 1 1-6.2-8.5" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function FlameIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1.5 1-3 1-3s-3 2-3 6a6 6 0 0 0 12 0c0-5-6-11-6-11Z" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg {...iconProps()} width="14" height="14">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function CommentIcon() {
  return (
    <svg {...iconProps()} width="14" height="14">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8 9 9 0 0 1-4-1L3 20l1.5-5a8.4 8.4 0 0 1-1-4 8.5 8.5 0 0 1 17 .5Z" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg {...iconProps()} width="14" height="14">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
