import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Task Manager — CCS112 Laravel + Inertia + React" },
      {
        name: "description",
        content:
          "A working React Task Manager demo mirroring the Laravel controller, Eloquent model and Inertia page from the CCS112 Week 11 walkthrough.",
      },
      { property: "og:title", content: "Task Manager — CCS112 Laravel + Inertia + React" },
      {
        property: "og:description",
        content:
          "Create, complete, edit and delete tasks — the same CRUD surface the Laravel + Inertia build exposes.",
      },
    ],
  }),
  component: TaskManagerPage,
});

type Priority = "low" | "normal" | "high";

type Task = {
  id: number;
  title: string;
  priority: Priority;
  completed: boolean;
  created_at: string;
};

const STORAGE_KEY = "ccs112.tasks.v1";

function seedTasks(): Task[] {
  const now = Date.now();
  return [
    {
      id: 1,
      title: "Define /tasks route and TaskController@index",
      priority: "high",
      completed: true,
      created_at: new Date(now - 86400000).toISOString(),
    },
    {
      id: 2,
      title: "Run migration for the tasks table",
      priority: "normal",
      completed: false,
      created_at: new Date(now - 3600000).toISOString(),
    },
    {
      id: 3,
      title: "Render Tasks/Index through Inertia with props",
      priority: "high",
      completed: false,
      created_at: new Date(now).toISOString(),
    },
  ];
}

const priorityLabel: Record<Priority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
};

type Filter = "all" | "active" | "done";

function TaskManagerPage() {
  const [tasks, setTasks] = useState<Task[]>(() => seedTasks());
  const [hydrated, setHydrated] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw) as Task[]);
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, hydrated]);

  const visible = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (filter === "active") return sorted.filter((t) => !t.completed);
    if (filter === "done") return sorted.filter((t) => t.completed);
    return sorted;
  }, [tasks, filter]);

  const remaining = tasks.filter((t) => !t.completed).length;

  // Mirrors TaskController@store validation: required|string|max:255
  function addTask(e: React.FormEvent) {
    e.preventDefault();
    const clean = title.trim();
    if (!clean) return setError("The title field is required.");
    if (clean.length > 255) return setError("The title may not be greater than 255 characters.");
    setError(null);
    setTasks((prev) => [
      {
        id: prev.reduce((max, t) => Math.max(max, t.id), 0) + 1,
        title: clean,
        priority,
        completed: false,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    setTitle("");
    setPriority("normal");
  }

  function toggle(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function destroy(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function saveEdit(id: number) {
    const clean = editingTitle.trim();
    if (clean) {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title: clean } : t)));
    }
    setEditingId(null);
  }

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "done", label: "Completed" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <section className="mb-8">
        <p className="font-display text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Module 2 · Week 11 Guided Project
        </p>
        <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
          <span className="text-ember">Task Manager</span>
          <span className="block text-2xl text-muted-foreground sm:text-3xl">
            from database to Inertia frontend
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This live demo reproduces the CRUD surface of the Laravel build: request validation,
          an Eloquent-style records list, and a React page component fed by props. The matching
          Laravel + Inertia source lives in the <code className="text-accent">laravel/</code>{" "}
          folder of this project.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        <section className="panel h-fit p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            POST /tasks
          </h2>
          <form onSubmit={addTask} className="mt-4 space-y-3">
            <div>
              <label htmlFor="title" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Seed the tasks table"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <div>
              <label htmlFor="priority" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              className="btn-ember hover:btn-ember-hover w-full rounded-md px-4 py-2.5 text-sm"
            >
              Add task
            </button>
          </form>
          <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Total</dt>
              <dd className="font-display text-xl">{tasks.length}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Open</dt>
              <dd className="font-display text-xl text-accent">{remaining}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Done</dt>
              <dd className="font-display text-xl text-success">{tasks.length - remaining}</dd>
            </div>
          </dl>
        </section>

        <section className="panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              GET /tasks
            </h2>
            <div className="flex gap-1 rounded-md bg-secondary p-1">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={
                    filter === f.key
                      ? "rounded px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground"
                      : "rounded px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {visible.length === 0 && (
              <li className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                No tasks here yet.
              </li>
            )}
            {visible.map((task) => (
              <li
                key={task.id}
                className="group flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2.5"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggle(task.id)}
                  aria-label={`Mark ${task.title} as ${task.completed ? "open" : "done"}`}
                  className="size-4 accent-[oklch(0.66_0.19_32)]"
                />
                {editingId === task.id ? (
                  <input
                    autoFocus
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => saveEdit(task.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(task.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="flex-1 rounded border border-input bg-background px-2 py-1 text-sm outline-none focus:border-primary"
                  />
                ) : (
                  <button
                    onDoubleClick={() => {
                      setEditingId(task.id);
                      setEditingTitle(task.title);
                    }}
                    className={
                      task.completed
                        ? "flex-1 truncate text-left text-sm text-muted-foreground line-through"
                        : "flex-1 truncate text-left text-sm"
                    }
                    title="Double-click to rename"
                  >
                    {task.title}
                  </button>
                )}
                <span
                  className={
                    task.priority === "high"
                      ? "rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary"
                      : task.priority === "normal"
                        ? "rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent"
                        : "rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                  }
                >
                  {priorityLabel[task.priority]}
                </span>
                <button
                  onClick={() => destroy(task.id)}
                  aria-label={`Delete ${task.title}`}
                  className="rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Double-click a title to rename it. State persists locally, standing in for the
            Eloquent-backed <code className="text-accent">tasks</code> table.
          </p>
        </section>
      </div>
    </main>
  );
}
