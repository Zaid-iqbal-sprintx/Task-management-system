"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register, isAuthenticated } from "@/lib/auth";

// Sign-up screen. Rendered bare (no app shell) by AppChrome. Registering logs
// the user straight in (the backend returns a token), then off to the board.
export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) router.replace("/tasks");
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      router.push("/tasks");
    } catch (err) {
      setError(err.message || "Couldn't create your account.");
      setSubmitting(false);
    }
  }

  return (
    <div className="tk-auth">
      <div className="tk-auth-card">
        <div className="tk-auth-brand">
          <span className="tk-nav-mark">T</span>
          <span className="tk-auth-word">Taskify</span>
        </div>
        <h1 className="tk-auth-title">Create your account</h1>
        <p className="tk-auth-sub">Start organising your work in minutes.</p>

        <form className="tk-auth-form" onSubmit={handleSubmit}>
          <label className="tk-field">
            <span className="tk-field-label">Name</span>
            <input
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>

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
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </label>

          {error && (
            <p className="tk-error" role="alert">
              {error}
            </p>
          )}

          <button className="tk-auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="tk-auth-alt">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
