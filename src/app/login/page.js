"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, isAuthenticated } from "@/lib/auth";

// Login screen. Rendered bare (no app shell) by AppChrome. On success it stores
// the session and sends the user to the board.
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Already signed in? Skip the form.
  useEffect(() => {
    if (isAuthenticated()) router.replace("/tasks");
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await login({ email: email.trim(), password });
      router.push("/tasks");
    } catch (err) {
      setError(err.message || "Couldn't log in.");
      setSubmitting(false); // stay on the form so they can retry
    }
  }

  return (
    <div className="tk-auth">
      <div className="tk-auth-card">
        <div className="tk-auth-brand">
          <span className="tk-nav-mark">T</span>
          <span className="tk-auth-word">Taskify</span>
        </div>
        <h1 className="tk-auth-title">Welcome back</h1>
        <p className="tk-auth-sub">Log in to pick up where you left off.</p>

        <form className="tk-auth-form" onSubmit={handleSubmit}>
          <label className="tk-field">
            <span className="tk-field-label">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label className="tk-field">
            <span className="tk-field-label">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="tk-error" role="alert">
              {error}
            </p>
          )}

          <button className="tk-auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="tk-auth-alt">
          <Link href="/forgot-password">Forgot password?</Link>
        </p>
        <p className="tk-auth-alt">
          New here? <Link href="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
