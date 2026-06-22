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
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Brand / home link */}
        <Link href="/tasks" className="text-lg font-semibold text-slate-900">
          📋 Task Manager
        </Link>

        <div className="flex items-center gap-1">
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
                className={[
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
