// Milestone — only the App layout + navigation (and the login page) are active.
// The new-task form is hidden; its original implementation is preserved below as comments
// and will be re-enabled in a later milestone.

export default function NewTaskPage() {
  return null;
}

// ----- ORIGINAL IMPLEMENTATION (disabled) -----
// "use client";
// 
// import { useMemo, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { PEOPLE, PRIORITY_META, STATUS_META } from "@/lib/mockTasks";
// 
// // New Task form. No backend in Milestone 1 — submitting validates, fakes a
// // short save, shows a success toast, then routes back to the board. A live
// // preview on the right mirrors the dashboard card as you type.
// // Styling lives in globals.css under the scoped .tk-* / .tk-form-* classes.
// 
// const PRIORITIES = ["low", "medium", "high", "urgent"];
// const STATUSES = ["todo", "in-progress", "done"];
// 
// export default function NewTaskPage() {
//   const router = useRouter();
// 
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [priority, setPriority] = useState("medium");
//   const [status, setStatus] = useState("todo");
//   const [assignee, setAssignee] = useState(PEOPLE[0].name);
//   const [due, setDue] = useState("");
//   const [tags, setTags] = useState([]);
//   const [tagDraft, setTagDraft] = useState("");
// 
//   const [error, setError] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [saved, setSaved] = useState(false);
// 
//   const person = useMemo(
//     () => PEOPLE.find((p) => p.name === assignee) ?? PEOPLE[0],
//     [assignee]
//   );
// 
//   function addTag() {
//     const t = tagDraft.trim().replace(/^#/, "").toLowerCase();
//     if (!t) return;
//     if (!tags.includes(t) && tags.length < 5) setTags([...tags, t]);
//     setTagDraft("");
//   }
// 
//   function handleTagKey(e) {
//     if (e.key === "Enter" || e.key === ",") {
//       e.preventDefault();
//       addTag();
//     } else if (e.key === "Backspace" && !tagDraft && tags.length) {
//       setTags(tags.slice(0, -1));
//     }
//   }
// 
//   function removeTag(t) {
//     setTags(tags.filter((x) => x !== t));
//   }
// 
//   function handleSubmit(e) {
//     e.preventDefault();
//     if (saving) return;
// 
//     if (!title.trim()) {
//       setError("Give your task a title to continue.");
//       return;
//     }
// 
//     setError("");
//     setSaving(true);
//     // Fake the save round-trip, flash a success state, then back to the board.
//     setTimeout(() => {
//       setSaving(false);
//       setSaved(true);
//       setTimeout(() => router.push("/tasks"), 950);
//     }, 850);
//   }
// 
//   return (
//     <div className="tk">
//       <div className="tk-aura tk-aura--gold" aria-hidden="true" />
//       <div className="tk-aura tk-aura--bronze" aria-hidden="true" />
// 
//       <header className="tk-top">
//         <div>
//           <p className="tk-eyebrow">Tasks · New</p>
//           <h1 className="tk-title">
//             Create a <em>task</em>
//           </h1>
//           <p className="tk-sub">
//             Fill in the details below. The card preview on the right updates as
//             you type.
//           </p>
//         </div>
//         <Link href="/tasks" className="tk-ghost-btn">
//           ← Back to board
//         </Link>
//       </header>
// 
//       <div className="tk-create">
//         {/* ------------------------------- form ------------------------------- */}
//         <form className="tk-form-card" onSubmit={handleSubmit} noValidate>
//           <div className="tk-form-group">
//             <label htmlFor="title">
//               Title <span className="tk-req">*</span>
//             </label>
//             <input
//               id="title"
//               className={`tk-input${error ? " is-invalid" : ""}`}
//               type="text"
//               placeholder="e.g. Redesign onboarding flow"
//               value={title}
//               maxLength={80}
//               onChange={(e) => {
//                 setTitle(e.target.value);
//                 if (error) setError("");
//               }}
//             />
//             {error ? (
//               <p className="tk-field-error">{error}</p>
//             ) : (
//               <p className="tk-field-hint">{80 - title.length} characters left</p>
//             )}
//           </div>
// 
//           <div className="tk-form-group">
//             <label htmlFor="description">Description</label>
//             <textarea
//               id="description"
//               className="tk-input tk-textarea"
//               placeholder="Add context, acceptance criteria, links…"
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>
// 
//           {/* Priority — segmented */}
//           <div className="tk-form-group">
//             <label>Priority</label>
//             <div className="tk-seg" role="group" aria-label="Priority">
//               {PRIORITIES.map((p) => (
//                 <button
//                   key={p}
//                   type="button"
//                   className={`tk-seg-btn tk-seg-btn--${p}${
//                     priority === p ? " is-active" : ""
//                   }`}
//                   onClick={() => setPriority(p)}
//                   aria-pressed={priority === p}
//                 >
//                   {PRIORITY_META[p].label}
//                 </button>
//               ))}
//             </div>
//           </div>
// 
//           {/* Status + Due date row */}
//           <div className="tk-form-row">
//             <div className="tk-form-group">
//               <label>Status</label>
//               <div className="tk-seg" role="group" aria-label="Status">
//                 {STATUSES.map((s) => (
//                   <button
//                     key={s}
//                     type="button"
//                     className={`tk-seg-btn${status === s ? " is-active" : ""}`}
//                     onClick={() => setStatus(s)}
//                     aria-pressed={status === s}
//                   >
//                     {STATUS_META[s].label}
//                   </button>
//                 ))}
//               </div>
//             </div>
// 
//             <div className="tk-form-group tk-form-group--due">
//               <label htmlFor="due">Due date</label>
//               <input
//                 id="due"
//                 className="tk-input"
//                 type="date"
//                 value={due}
//                 onChange={(e) => setDue(e.target.value)}
//               />
//             </div>
//           </div>
// 
//           {/* Assignee */}
//           <div className="tk-form-group">
//             <label htmlFor="assignee">Assignee</label>
//             <div className="tk-select tk-select--block">
//               <select
//                 id="assignee"
//                 value={assignee}
//                 onChange={(e) => setAssignee(e.target.value)}
//               >
//                 {PEOPLE.map((p) => (
//                   <option key={p.name} value={p.name}>
//                     {p.name}
//                   </option>
//                 ))}
//               </select>
//               <ChevronIcon />
//             </div>
//           </div>
// 
//           {/* Tags — chip input */}
//           <div className="tk-form-group">
//             <label htmlFor="tags">Tags</label>
//             <div className="tk-chips">
//               {tags.map((t) => (
//                 <span key={t} className="tk-chip">
//                   #{t}
//                   <button
//                     type="button"
//                     onClick={() => removeTag(t)}
//                     aria-label={`Remove ${t}`}
//                   >
//                     ×
//                   </button>
//                 </span>
//               ))}
//               <input
//                 id="tags"
//                 className="tk-chip-input"
//                 type="text"
//                 placeholder={tags.length ? "" : "Type a tag, press Enter"}
//                 value={tagDraft}
//                 onChange={(e) => setTagDraft(e.target.value)}
//                 onKeyDown={handleTagKey}
//                 onBlur={addTag}
//                 disabled={tags.length >= 5}
//               />
//             </div>
//             <p className="tk-field-hint">Up to 5 tags.</p>
//           </div>
// 
//           <div className="tk-form-actions">
//             <Link href="/tasks" className="tk-ghost-btn">
//               Cancel
//             </Link>
//             <button type="submit" className="tk-cta" disabled={saving}>
//               {saving ? (
//                 <>
//                   <span className="tk-btn-spinner" aria-hidden="true" />
//                   Creating…
//                 </>
//               ) : (
//                 <>
//                   <PlusIcon />
//                   Create task
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
// 
//         {/* ----------------------------- live preview ----------------------------- */}
//         <aside className="tk-preview">
//           <p className="tk-preview-label">Live preview</p>
//           <article className={`tk-card tk-card--${priority}`}>
//             <div className="tk-card-stripe" aria-hidden="true" />
//             <div className="tk-card-row">
//               <span className="tk-card-id">TK-NEW</span>
//               <span className={`tk-badge tk-badge--${status}`}>
//                 {STATUS_META[status].label}
//               </span>
//             </div>
//             <h3 className="tk-card-title">
//               {title.trim() || "Your task title"}
//             </h3>
//             <p className="tk-card-desc">
//               {description.trim() ||
//                 "A short description of what needs to get done will appear here."}
//             </p>
//             <div className="tk-tags">
//               <span className={`tk-prio tk-prio--${priority}`}>
//                 {PRIORITY_META[priority].label}
//               </span>
//               {tags.map((t) => (
//                 <span key={t} className="tk-tag">
//                   #{t}
//                 </span>
//               ))}
//             </div>
//             <footer className="tk-card-foot">
//               <span className="tk-avatar" title={person.name}>
//                 {person.initials}
//               </span>
//               <span className="tk-assignee">{person.name}</span>
//               <span className="tk-card-meta">
//                 <span className="tk-meta-item">
//                   <CalendarIcon />
//                   {due ? formatDue(due) : "No date"}
//                 </span>
//               </span>
//             </footer>
//           </article>
//         </aside>
//       </div>
// 
//       {/* Success toast */}
//       {saved && (
//         <div className="tk-toast" role="status">
//           <span className="tk-toast-check">
//             <CheckIcon />
//           </span>
//           Task created — taking you back to the board…
//         </div>
//       )}
//     </div>
//   );
// }
// 
// /* --------------------------------- helpers --------------------------------- */
// 
// function formatDue(iso) {
//   const [, m, d] = iso.split("-").map(Number);
//   const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//   ];
//   return `${months[m - 1]} ${d}`;
// }
// 
// function iconProps() {
//   return {
//     width: 16,
//     height: 16,
//     viewBox: "0 0 24 24",
//     fill: "none",
//     stroke: "currentColor",
//     strokeWidth: 1.7,
//     strokeLinecap: "round",
//     strokeLinejoin: "round",
//   };
// }
// function PlusIcon() {
//   return (
//     <svg {...iconProps()}>
//       <path d="M12 5v14M5 12h14" />
//     </svg>
//   );
// }
// function CheckIcon() {
//   return (
//     <svg {...iconProps()}>
//       <path d="M20 6 9 17l-5-5" />
//     </svg>
//   );
// }
// function ChevronIcon() {
//   return (
//     <svg {...iconProps()} width="14" height="14">
//       <path d="m6 9 6 6 6-6" />
//     </svg>
//   );
// }
// function CalendarIcon() {
//   return (
//     <svg {...iconProps()} width="14" height="14">
//       <rect x="3" y="4" width="18" height="18" rx="2" />
//       <path d="M16 2v4M8 2v4M3 10h18" />
//     </svg>
//   );
// }
