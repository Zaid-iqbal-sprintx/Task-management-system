"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Login screen for the Midnight Gold identity. There's no real auth in
// Milestone 1 — a valid-looking email + a password just routes to /tasks.
// The styling lives in globals.css under the scoped .mg-* classes.
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const invalid = error !== "";

  function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    if (!emailLooksValid) {
      setError("Enter a valid email address to continue.");
      return;
    }
    if (password.length === 0) {
      setError("Enter your password to continue.");
      return;
    }

    // Fake the round-trip so the loading state is visible, then go to tasks.
    setError("");
    setSubmitting(true);
    setTimeout(() => router.push("/tasks"), 900);
  }

  return (
    <main className="mg-screen">
      <div className="mg-glow mg-glow--gold" aria-hidden="true" />
      <div className="mg-glow mg-glow--bronze" aria-hidden="true" />
      <div className="mg-grain" aria-hidden="true" />

      <section className="mg-ticket">
        {/* Brand stub */}
        <aside className="mg-stub">
          <div className="mg-brand">
            <span className="mg-brand-mark">T</span>
            <span className="mg-brand-name">Taskify&nbsp;Managment</span>
          </div>

          <div>
            <h1 className="mg-wordmark">
              Every ticket,
              <br />
              <em>under control.</em>
            </h1>
            <p className="mg-tagline">
              Sign in to triage, assign, and close out your team&rsquo;s queue.
            </p>
          </div>

          <p className="mg-serial">
            Pass No. <span>MG&middot;0042&middot;ADMIT</span>
          </p>

          {/* Perforated divider — the ticket signature */}
          <div className="mg-perf" aria-hidden="true">
            <span className="mg-notch mg-notch--top" />
            <span className="mg-notch mg-notch--bottom" />
          </div>
        </aside>

        {/* Form panel */}
        <div className="mg-form">
          <div className="mg-form-head">
            <h2 className="mg-form-title">Welcome back</h2>
            <p className="mg-form-sub">Use your work account to continue.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div
              className={`mg-field${invalid && !emailLooksValid ? " mg-field--invalid" : ""}`}
              style={{ animationDelay: "0.15s" }}
            >
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
              />
              <label htmlFor="email">Email address</label>
            </div>

            <div
              className={`mg-field mg-field--pw${invalid && emailLooksValid ? " mg-field--invalid" : ""}`}
              style={{ animationDelay: "0.25s" }}
            >
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="mg-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className="mg-meta">
              <label className="mg-check">
                <input type="checkbox" defaultChecked />
                Keep me signed in
              </label>
              <Link className="mg-link" href="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <p className="mg-error" role="alert">
              {error}
            </p>

            <button type="submit" className="mg-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="mg-spinner" aria-hidden="true" />
                  Signing in&hellip;
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mg-foot">
            New to the team?{" "}
            <Link className="mg-link" href="/signup">
              Request access
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a17.3 17.3 0 0 1-3 3.86M6.6 6.6A17.3 17.3 0 0 0 2 11s3.5 7 10 7a9.1 9.1 0 0 0 4.1-.96" />
      <path d="m3 3 18 18" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
