// Milestone — only the App layout + navigation (and the login page) are active.
// The home route shows a small placeholder inside the shell. The original
// redirect to /tasks is preserved below as a comment and will return later.
export default function Home() {
  return (
    <div className="tk">
      <header className="tk-top">
        <div>
          <p className="tk-eyebrow">Milestone</p>
          <h1 className="tk-title">
            App layout &amp; <em>navigation</em>
          </h1>
          <p className="tk-sub">
            Feature pages are temporarily hidden. Only the shell, the navbar
            above, and the login page are active for now.
          </p>
        </div>
      </header>
    </div>
  );
}

// ----- ORIGINAL IMPLEMENTATION (disabled) -----
// import { redirect } from "next/navigation";
//
// // The home route ("/") has no page of its own — send people to the task list.
// export default function Home() {
//   redirect("/tasks");
// }
