"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getTask } from "@/lib/taskStore";
import TaskForm from "@/components/TaskForm";

// Edit screen for a single task. In Next 16 `params` is a promise, so we unwrap
// it with React's `use` hook. The task is fetched from the backend after mount
// (state stays `undefined` until the request settles); `null` means the server
// returned 404, and `error` holds any other failure.
export default function EditTaskPage({ params }) {
  const { id } = use(params);
  const [task, setTask] = useState(undefined); // undefined = still loading
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const found = await getTask(id);
        if (!cancelled) setTask(found); // null when not found
      } catch (err) {
        if (!cancelled) setError(err.message || "Couldn't load this task.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="tk">
        <div className="tk-empty">
          <div className="tk-empty-mark">!</div>
          <h3>Couldn&rsquo;t load this task</h3>
          <p>{error}</p>
          <Link href="/tasks" className="tk-empty-reset">
            Back to board
          </Link>
        </div>
      </div>
    );
  }

  if (task === undefined) {
    return (
      <div className="tk">
        <div className="tk-empty">
          <div className="tk-empty-mark">…</div>
          <h3>Loading task</h3>
          <p>
            Fetching <strong>{id}</strong>.
          </p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="tk">
        <div className="tk-empty">
          <div className="tk-empty-mark">∅</div>
          <h3>Task not found</h3>
          <p>
            We couldn&rsquo;t find a task with id <strong>{id}</strong>.
          </p>
          <Link href="/tasks" className="tk-empty-reset">
            Back to board
          </Link>
        </div>
      </div>
    );
  }

  return <TaskForm mode="edit" task={task} />;
}
