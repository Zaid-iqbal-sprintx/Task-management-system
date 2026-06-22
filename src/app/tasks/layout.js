// The app shell + navbar live in the root layout (via AppChrome), so this
// nested layout is a passthrough — it exists only to group the /tasks routes.
export default function TasksLayout({ children }) {
  return children;
}
