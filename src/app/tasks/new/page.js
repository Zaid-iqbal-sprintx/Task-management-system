import TaskForm from "@/components/TaskForm";

// Rendered inside the app shell (navbar + main) via AppChrome.
export default function NewTaskPage() {
  return <TaskForm mode="create" />;
}
