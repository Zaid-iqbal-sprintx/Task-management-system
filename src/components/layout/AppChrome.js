"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

// Auth screens render bare — they have their own full-screen layout and must
// NOT get the app navbar/shell. Everything else is wrapped in the App layout
// (shell + navigation).
const BARE_ROUTES = ["/login", "/signup", "/forgot-password"];

export default function AppChrome({ children }) {
  const pathname = usePathname();

  const isBare = BARE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isBare) return children;

  return (
    <div className="tk-shell">
      <Navbar />
      <main className="tk-main">{children}</main>
    </div>
  );
}
