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
