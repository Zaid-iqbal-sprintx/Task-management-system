import RequireAuth from "@/components/RequireAuth";

// The app shell + navbar live in the root layout (via AppChrome). This nested
// layout groups the /tasks routes and gates them behind RequireAuth, so every
// task screen (list, new, edit) requires a signed-in user.
export default function TasksLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
