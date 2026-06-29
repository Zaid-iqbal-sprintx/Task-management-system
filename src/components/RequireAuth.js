"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

// Client-side route guard. Auth lives in localStorage (only readable in the
// browser), so the check runs in an effect: unauthenticated visitors are
// redirected to /login, and protected children render only once we've
// confirmed a session — so the board never flashes before the redirect.
//
// This is a UX gate, not a security boundary; the real protection is the
// backend's `protect` middleware, which 401s any task request without a token.
//
// Note: it only checks that a token EXISTS — it does not verify it against
// GET /api/auth/me, so an expired/revoked token still lets the user into
// /tasks until the first task request comes back 401. Follow-up: validate the
// token here (and auto-logout on a 401) before relying on this for anything
// security-sensitive.
export default function RequireAuth({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setAllowed(true);
    } else {
      router.replace("/login");
    }
  }, [router]);

  if (!allowed) return null;
  return children;
}
