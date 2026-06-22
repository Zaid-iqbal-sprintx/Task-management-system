import Navbar from "@/components/layout/Navbar";

// This nested layout wraps every page under /tasks (list, new, [id], edit).
// Because it lives in src/app/tasks/, the login page does NOT get the navbar.
export default function TasksLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
