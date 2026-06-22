"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// The links shown in the navbar. Keeping them in an array means we can
// render them in a loop instead of copy-pasting the same markup.
const NAV_LINKS = [
  { href: "/tasks", label: "Tasks" },
  { href: "/tasks/new", label: "New Task" },
];

export default function Navbar() {
  const pathname = usePathname(); // current URL path, e.g. "/tasks/new"
  const router = useRouter();

  // For Milestone 1 there is no real auth, so "logout" just sends the
  // user back to the login screen.
  function handleLogout() {
    router.push("/login");
  }

  return (
    <header className="tk-nav">
      <nav className="tk-nav-inner">
        {/* Brand / home link — matches the login wordmark identity */}
        <Link href="/tasks" className="tk-nav-brand">
          <span className="tk-nav-mark">T</span>
          <span className="tk-nav-name">Taskify</span>
        </Link>

        <div className="tk-nav-links">
          {NAV_LINKS.map((link) => {
            // "New Task" highlights only on its exact path. "Tasks" highlights
            // on the list and any detail/edit page, but not on "New Task".
            const isActive =
              link.href === "/tasks"
                ? pathname === "/tasks" ||
                  (pathname.startsWith("/tasks/") && pathname !== "/tasks/new")
                : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`tk-nav-link${isActive ? " is-active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button onClick={handleLogout} className="tk-nav-logout">
          Logout
        </button>
      </nav>
    </header>
  );
}
