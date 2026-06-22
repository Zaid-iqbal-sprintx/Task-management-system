"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Sign-up screen, sharing the Midnight Gold "ticket" identity with /login.
// No real backend in Milestone 1 — a valid form just routes to /tasks.
// Styling lives in globals.css under the scoped .mg-* classes.
export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    if (name.trim().length === 0) {
      setError("Tell us your name to set up your account.");
      return;
    }
    if (!emailLooksValid) {
      setError("Enter a valid work email address.");
      return;
    }
    if (password.length < 8) {
      setError("Use a password of at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }

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
              Join the team,
              <br />
              <em>own the queue.</em>
            </h1>
            <p className="mg-tagline">
              Create your pass to start triaging, assigning, and closing tickets.
            </p>
          </div>

          <p className="mg-serial">
            Pass No. <span>MG&middot;NEW&middot;ADMIT</span>
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
            <h2 className="mg-form-title">Create your account</h2>
            <p className="mg-form-sub">It takes less than a minute.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mg-field" style={{ animationDelay: "0.1s" }}>
              <input
                id="name"
                type="text"
                placeholder="Full name"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
              />
              <label htmlFor="name">Full name</label>
            </div>

            <div className="mg-field" style={{ animationDelay: "0.18s" }}>
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
              <label htmlFor="email">Work email</label>
            </div>

            <div className="mg-field mg-field--pw" style={{ animationDelay: "0.26s" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
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

            <div className="mg-field" style={{ animationDelay: "0.34s" }}>
              <input
                id="confirm"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  if (error) setError("");
                }}
              />
              <label htmlFor="confirm">Confirm password</label>
            </div>

            <p className="mg-error" role="alert">
              {error}
            </p>

            <button type="submit" className="mg-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="mg-spinner" aria-hidden="true" />
                  Creating account&hellip;
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mg-foot">
            Already have a pass?{" "}
            <Link className="mg-link" href="/login">
              Sign in
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
