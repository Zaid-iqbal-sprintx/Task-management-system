import { redirect } from "next/navigation";

// The home route ("/") has no page of its own — send people to the task list.
export default function Home() {
  redirect("/tasks");
}
