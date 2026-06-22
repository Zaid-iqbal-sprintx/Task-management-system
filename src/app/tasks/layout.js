// Milestone — only the App layout + navigation (and the login page) are active.
// The shell + <Navbar> now live in the root layout (via AppChrome), so this
// nested layout is a simple passthrough to avoid rendering the navbar twice.
// The original task-area shell is preserved below as comments.
export default function TasksLayout({ children }) {
  return children;
}

// ----- ORIGINAL IMPLEMENTATION (disabled) -----
// import Navbar from "@/components/layout/Navbar";
//
// // This nested layout wraps every page under /tasks (list, new, [id], edit).
// // Because it lives in src/app/tasks/, the login page does NOT get the navbar.
// // The whole task area uses the dark "Midnight Gold" shell so it's cohesive
// // with the login screen.
// export default function TasksLayout({ children }) {
//   return (
//     <div className="tk-shell">
//       <Navbar />
//       <main className="tk-main">{children}</main>
//     </div>
//   );
// }
