// Milestone — only the App layout + navigation (and the login page) are active.
// The forgot-password screen is hidden; its original implementation is preserved below as comments
// and will be re-enabled in a later milestone.

export default function ForgotPasswordPage() {
  return null;
}

// ----- ORIGINAL IMPLEMENTATION (disabled) -----
// "use client";
// 
// import { useState } from "react";
// import Link from "next/link";
// 
// // Forgot-password screen, sharing the Midnight Gold "ticket" identity.
// // No real backend in Milestone 1 — submitting just shows the sent state.
// // Styling lives in globals.css under the scoped .mg-* classes.
// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [sent, setSent] = useState(false);
// 
//   const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// 
//   function handleSubmit(event) {
//     event.preventDefault();
//     if (submitting) return;
// 
//     if (!emailLooksValid) {
//       setError("Enter the email on your account.");
//       return;
//     }
// 
//     setError("");
//     setSubmitting(true);
//     setTimeout(() => {
//       setSubmitting(false);
//       setSent(true);
//     }, 900);
//   }
// 
//   return (
//     <main className="mg-screen">
//       <div className="mg-glow mg-glow--gold" aria-hidden="true" />
//       <div className="mg-glow mg-glow--bronze" aria-hidden="true" />
//       <div className="mg-grain" aria-hidden="true" />
// 
//       <section className="mg-ticket">
//         {/* Brand stub */}
//         <aside className="mg-stub">
//           <div className="mg-brand">
//             <span className="mg-brand-mark">T</span>
//             <span className="mg-brand-name">Taskify&nbsp;Managment</span>
//           </div>
// 
//           <div>
//             <h1 className="mg-wordmark">
//               Lost your
//               <br />
//               <em>way in?</em>
//             </h1>
//             <p className="mg-tagline">
//               We&rsquo;ll send a link to reset your password and get you back to the queue.
//             </p>
//           </div>
// 
//           <p className="mg-serial">
//             Pass No. <span>MG&middot;RESET&middot;ADMIT</span>
//           </p>
// 
//           {/* Perforated divider — the ticket signature */}
//           <div className="mg-perf" aria-hidden="true">
//             <span className="mg-notch mg-notch--top" />
//             <span className="mg-notch mg-notch--bottom" />
//           </div>
//         </aside>
// 
//         {/* Form panel */}
//         <div className="mg-form">
//           {sent ? (
//             <>
//               <div className="mg-sent" aria-hidden="true">
//                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M20 6 9 17l-5-5" />
//                 </svg>
//               </div>
//               <div className="mg-form-head">
//                 <h2 className="mg-form-title">Check your inbox</h2>
//                 <p className="mg-form-sub">
//                   If an account exists for <strong>{email}</strong>, a reset link is
//                   on its way. The link expires in 30 minutes.
//                 </p>
//               </div>
// 
//               <button
//                 type="button"
//                 className="mg-submit"
//                 onClick={() => setSent(false)}
//               >
//                 Resend link
//               </button>
// 
//               <p className="mg-foot">
//                 <Link className="mg-link" href="/login">
//                   &larr; Back to sign in
//                 </Link>
//               </p>
//             </>
//           ) : (
//             <>
//               <div className="mg-form-head">
//                 <h2 className="mg-form-title">Reset your password</h2>
//                 <p className="mg-form-sub">
//                   Enter your email and we&rsquo;ll send you a reset link.
//                 </p>
//               </div>
// 
//               <form onSubmit={handleSubmit} noValidate>
//                 <div
//                   className={`mg-field${error ? " mg-field--invalid" : ""}`}
//                   style={{ animationDelay: "0.15s" }}
//                 >
//                   <input
//                     id="email"
//                     type="email"
//                     placeholder="you@company.com"
//                     autoComplete="email"
//                     value={email}
//                     onChange={(e) => {
//                       setEmail(e.target.value);
//                       if (error) setError("");
//                     }}
//                   />
//                   <label htmlFor="email">Email address</label>
//                 </div>
// 
//                 <p className="mg-error" role="alert">
//                   {error}
//                 </p>
// 
//                 <button type="submit" className="mg-submit" disabled={submitting}>
//                   {submitting ? (
//                     <>
//                       <span className="mg-spinner" aria-hidden="true" />
//                       Sending link&hellip;
//                     </>
//                   ) : (
//                     "Send reset link"
//                   )}
//                 </button>
//               </form>
// 
//               <p className="mg-foot">
//                 Remembered it?{" "}
//                 <Link className="mg-link" href="/login">
//                   Back to sign in
//                 </Link>
//               </p>
//             </>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// }
