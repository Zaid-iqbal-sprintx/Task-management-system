"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getTask } from "@/lib/taskStore";
import TaskForm from "@/components/TaskForm";

// Edit screen for a single task. In Next 16 `params` is a promise, so we unwrap
// it with React's `use` hook. Tasks live in the localStorage-backed store, which
// is browser-only, so we resolve the task after mount (state stays `undefined`
// until then) to keep the server and first client render in agreement.
export default function EditTaskPage({ params }) {
  const { id } = use(params);
  const [task, setTask] = useState(undefined); // undefined = still loading

  useEffect(() => {
    setTask(getTask(id));
  }, [id]);

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
