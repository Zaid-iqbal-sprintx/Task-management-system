// Dummy task data for Milestone 1. No backend yet — the dashboard reads
// straight from this array so we can design the UI against realistic content.
// Shape is intentionally rich (assignee, tags, due dates, subtask progress)
// so the cards have something meaningful to show.

export const TASKS = [
  {
    id: "TK-1042",
    title: "Redesign onboarding flow",
    description:
      "Cut the signup steps from five to three and add a progress rail so new users don't drop off mid-way.",
    status: "in-progress",
    priority: "high",
    assignee: { name: "Sara Khan", initials: "SK" },
    due: "2026-06-25",
    tags: ["design", "growth"],
    comments: 4,
    subtasks: { done: 3, total: 5 },
  },
  {
    id: "TK-1041",
    title: "Fix hydration warning on dashboard",
    description:
      "Browser extensions inject attributes on <body>; suppress the warning at the layout root.",
    status: "done",
    priority: "medium",
    assignee: { name: "Zaid Ali", initials: "ZA" },
    due: "2026-06-21",
    tags: ["bug", "frontend"],
    comments: 2,
    subtasks: { done: 2, total: 2 },
  },
  {
    id: "TK-1040",
    title: "Ship invoice export to CSV",
    description:
      "Finance wants a one-click export of the monthly invoice table with currency formatting preserved.",
    status: "todo",
    priority: "urgent",
    assignee: { name: "Maya Reed", initials: "MR" },
    due: "2026-06-23",
    tags: ["finance", "feature"],
    comments: 7,
    subtasks: { done: 0, total: 4 },
  },
  {
    id: "TK-1039",
    title: "Audit color contrast for AA",
    description:
      "Run the palette through a contrast checker and bump any text token that fails WCAG AA.",
    status: "in-progress",
    priority: "medium",
    assignee: { name: "Omar Yusuf", initials: "OY" },
    due: "2026-06-28",
    tags: ["a11y", "design"],
    comments: 1,
    subtasks: { done: 1, total: 3 },
  },
  {
    id: "TK-1038",
    title: "Set up CI for the task service",
    description:
      "Add a pipeline that runs lint + unit tests on every PR and blocks merge on failure.",
    status: "todo",
    priority: "high",
    assignee: { name: "Lena Park", initials: "LP" },
    due: "2026-06-30",
    tags: ["devops", "infra"],
    comments: 3,
    subtasks: { done: 0, total: 6 },
  },
  {
    id: "TK-1037",
    title: "Write API docs for /tasks endpoints",
    description:
      "Document request/response shapes and auth for the CRUD endpoints so the mobile team can integrate.",
    status: "done",
    priority: "low",
    assignee: { name: "Sara Khan", initials: "SK" },
    due: "2026-06-19",
    tags: ["docs"],
    comments: 0,
    subtasks: { done: 5, total: 5 },
  },
  {
    id: "TK-1036",
    title: "Investigate slow login page",
    description:
      "First request takes ~2.7s — confirm it's dev on-demand compilation and not a code regression.",
    status: "done",
    priority: "medium",
    assignee: { name: "Zaid Ali", initials: "ZA" },
    due: "2026-06-22",
    tags: ["performance", "frontend"],
    comments: 5,
    subtasks: { done: 1, total: 1 },
  },
  {
    id: "TK-1035",
    title: "Build the New Task form",
    description:
      "Title, description, priority, assignee and due date — with inline validation and a tidy empty state.",
    status: "todo",
    priority: "high",
    assignee: { name: "Maya Reed", initials: "MR" },
    due: "2026-07-02",
    tags: ["feature", "frontend"],
    comments: 2,
    subtasks: { done: 0, total: 3 },
  },
  {
    id: "TK-1034",
    title: "Add keyboard shortcuts",
    description:
      "Quick actions: 'n' for new task, '/' to focus search, 'j/k' to move through the list.",
    status: "in-progress",
    priority: "low",
    assignee: { name: "Omar Yusuf", initials: "OY" },
    due: "2026-07-05",
    tags: ["enhancement"],
    comments: 1,
    subtasks: { done: 2, total: 4 },
  },
];

// Display metadata for each status — label + the order they appear in filters.
export const STATUS_META = {
  todo: { label: "To Do", order: 0 },
  "in-progress": { label: "In Progress", order: 1 },
  done: { label: "Done", order: 2 },
};

export const PRIORITY_META = {
  urgent: { label: "Urgent", rank: 3 },
  high: { label: "High", rank: 2 },
  medium: { label: "Medium", rank: 1 },
  low: { label: "Low", rank: 0 },
};

// The team — used to populate the assignee picker on the New Task form.
export const PEOPLE = [
  { name: "Sara Khan", initials: "SK" },
  { name: "Zaid Ali", initials: "ZA" },
  { name: "Maya Reed", initials: "MR" },
  { name: "Omar Yusuf", initials: "OY" },
  { name: "Lena Park", initials: "LP" },
];
