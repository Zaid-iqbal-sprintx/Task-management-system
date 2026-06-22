"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TASKS, STATUS_META, PRIORITY_META } from "@/lib/mockTasks";

// The Midnight Gold dashboard. Reads dummy tasks from src/lib/mockTasks.js and
// lets you search, filter by status, and filter by priority — all client-side.
// Styling lives in globals.css under the scoped .tk-* classes.

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

  // Brief branded loader on first paint so arriving from login feels like a
  // real "signing you in" handoff, then the board reveals itself.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(t);
  }, []);

  // Stats are always computed from the full list, not the filtered view.
  const stats = useMemo(() => {
    const total = TASKS.length;
    const inProgress = TASKS.filter((t) => t.status === "in-progress").length;
    const done = TASKS.filter((t) => t.status === "done").length;
    const overdue = TASKS.filter(
      (t) => t.status !== "done" && t.due < TODAY
    ).length;
    return { total, inProgress, done, overdue };
  }, []);

  const completion = Math.round((stats.done / stats.total) * 100);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TASKS.filter((t) => {
      if (status !== "all" && t.status !== status) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }).sort((a, b) => PRIORITY_META[b.priority].rank - PRIORITY_META[a.priority].rank);
  }, [query, status, priority]);

  if (!ready) return <DashboardLoader />;

  return (
    <div className="tk">
      <div className="tk-aura tk-aura--gold" aria-hidden="true" />
      <div className="tk-aura tk-aura--bronze" aria-hidden="true" />

      {/* Greeting + primary action */}
      <header className="tk-top">
        <div>
          <p className="tk-eyebrow">Sunday · June 22, 2026</p>
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

      {/* Task grid */}
      {filtered.length > 0 ? (
        <section className="tk-grid">
          {filtered.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </section>
      ) : (
        <div className="tk-empty">
          <div className="tk-empty-mark">∅</div>
          <h3>No tasks match your filters</h3>
          <p>Try clearing the search or switching back to “All”.</p>
          <button
            className="tk-empty-reset"
            onClick={() => {
              setQuery("");
              setStatus("all");
              setPriority("all");
            }}
          >
            Reset filters
          </button>
        </div>
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

function TaskCard({ task, index }) {
  const overdue = task.status !== "done" && task.due < TODAY;
  const pct = Math.round((task.subtasks.done / task.subtasks.total) * 100);

  return (
    <article
      className={`tk-card tk-card--${task.priority}`}
      style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
    >
      <div className="tk-card-stripe" aria-hidden="true" />

      <div className="tk-card-row">
        <span className="tk-card-row-left">
          <span className="tk-card-id">{task.id}</span>
          <span className={`tk-badge tk-badge--${task.status}`}>
            {STATUS_META[task.status].label}
          </span>
        </span>

        <span className="tk-card-actions">
          <button
            type="button"
            className="tk-icon-btn"
            aria-label={`Edit ${task.title}`}
            title="Edit"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className="tk-icon-btn tk-icon-btn--danger"
            aria-label={`Delete ${task.title}`}
            title="Delete"
          >
            <TrashIcon />
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
        <span className="tk-avatar" title={task.assignee.name}>
          {task.assignee.initials}
        </span>
        <span className="tk-assignee">{task.assignee.name}</span>

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

function formatDue(iso) {
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
function EditIcon() {
  return (
    <svg {...iconProps()} width="15" height="15">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg {...iconProps()} width="15" height="15">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
