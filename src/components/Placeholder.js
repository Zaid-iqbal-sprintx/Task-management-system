// Simple placeholder used for routes whose real UI is not part of this
// milestone. PR 1 ships only the App layout + navigation; feature screens
// arrive in later milestones.
//
// `standalone` is for auth routes (login/signup/forgot) which AppChrome renders
// without the app shell — they bring their own full-screen dark canvas.
export default function Placeholder({ title, note, standalone = false }) {
  return (
    <section className={`ph${standalone ? " ph--standalone" : ""}`}>
      <p className="ph-kicker">Placeholder</p>
      <h1 className="ph-title">{title}</h1>
      {note ? <p className="ph-note">{note}</p> : null}
    </section>
  );
}
