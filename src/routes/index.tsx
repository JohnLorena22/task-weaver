import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Task Manager — CCS112 Laravel + Inertia + React" },
      {
        name: "description",
        content:
          "A database-backed React Task Manager with a REST API, mirroring the Laravel controller, Eloquent model and Inertia page from the CCS112 Week 11 walkthrough.",
      },
      { property: "og:title", content: "Task Manager — CCS112 Laravel + Inertia + React" },
      {
        property: "og:description",
        content:
          "Create, complete, edit and delete tasks over a real REST API — the same CRUD surface the Laravel + Inertia build exposes.",
      },
    ],
  }),
  component: TaskManagerPage,
});

type Priority = "low" | "normal" | "high";
type Filter = "all" | "active" | "done";

type Task = {
  id: number;
  title: string;
  priority: Priority;
  completed: boolean;
  created_at: string;
};

type IndexResponse = {
  data: Task[];
  meta: { filter: string; total: number; open: number };
};

const priorityLabel: Record<Priority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (body as { errors?: Record<string, string[]> }).errors?.["title"]?.[0] ??
      (body as { message?: string }).message ??
      `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body as T;
}

function TaskManagerPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const tasksQuery = useQuery({
    queryKey: ["tasks", filter],
    queryFn: () => api<IndexResponse>(`/api/tasks?filter=${filter}`),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["tasks"] });

  const createTask = useMutation({
    mutationFn: (payload: { title: string; priority: Priority }) =>
      api<{ data: Task }>("/api/tasks", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => {
      setTitle("");
      setPriority("normal");
      void invalidate();
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, ...patch }: { id: number } & Partial<Task>) =>
      api<{ data: Task }>(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
    onSuccess: invalidate,
  });

  const deleteTask = useMutation({
    mutationFn: (id: number) => api<void>(`/api/tasks/${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });

  const tasks = tasksQuery.data?.data ?? [];
  const meta = tasksQuery.data?.meta;
  const formError = createTask.error instanceof Error ? createTask.error.message : null;

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createTask.mutate({ title: title.trim(), priority });
  }

  function saveEdit(id: number, original: string) {
    const clean = editingTitle.trim();
    setEditingId(null);
    if (clean && clean !== original) updateTask.mutate({ id, title: clean });
  }

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "done", label: "Completed" },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="mb-6 sm:mb-8">
        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs sm:tracking-[0.25em]">
          Module 2 · Week 11 Guided Project
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          <span className="text-ember">Task Manager</span>
          <span className="block text-xl text-muted-foreground sm:text-2xl lg:text-3xl">
            from database to frontend
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Tasks are stored in a real database and read and written through a REST API
          (<code className="text-accent">/api/tasks</code>) with server-side validation — so they
          survive a reload. The equivalent Laravel + Eloquent + Inertia source lives in the{" "}
          <code className="text-accent">laravel/</code> folder.
        </p>
      </section>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_1.25fr]">
        <section className="panel h-fit p-4 sm:p-5">

          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            POST /api/tasks
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
            {formError && <p className="text-xs text-destructive">{formError}</p>}
            <button
              type="submit"
              disabled={createTask.isPending}
              className="btn-ember hover:btn-ember-hover w-full rounded-md px-4 py-2.5 text-sm disabled:opacity-60"
            >
              {createTask.isPending ? "Saving…" : "Add task"}
            </button>
          </form>
          <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Shown</dt>
              <dd className="font-display text-xl">{meta?.total ?? 0}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Open</dt>
              <dd className="font-display text-xl text-accent">{meta?.open ?? 0}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Done</dt>
              <dd className="font-display text-xl text-success">
                {(meta?.total ?? 0) - (meta?.open ?? 0)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              GET /api/tasks
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

          {tasksQuery.isError && (
            <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Could not load tasks: {(tasksQuery.error as Error).message}
            </p>
          )}

          <ul className="mt-4 space-y-2">
            {tasksQuery.isPending &&
              [0, 1, 2].map((i) => (
                <li key={i} className="h-11 animate-pulse rounded-lg border border-border bg-secondary/40" />
              ))}

            {!tasksQuery.isPending && tasks.length === 0 && (
              <li className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                No tasks here yet.
              </li>
            )}

            {tasks.map((task) => (
              <li
                key={task.id}
                className="group flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2.5"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => updateTask.mutate({ id: task.id, completed: !task.completed })}
                  aria-label={`Mark ${task.title} as ${task.completed ? "open" : "done"}`}
                  className="size-4 accent-[oklch(0.66_0.19_32)]"
                />
                {editingId === task.id ? (
                  <input
                    autoFocus
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => saveEdit(task.id, task.title)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(task.id, task.title);
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
                  onClick={() => deleteTask.mutate(task.id)}
                  aria-label={`Delete ${task.title}`}
                  className="rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Double-click a title to rename it. Every action is a request to the API —
            <code className="text-accent"> PATCH /api/tasks/:id</code> and
            <code className="text-accent"> DELETE /api/tasks/:id</code>.
          </p>
        </section>
      </div>
    </main>
  );
}
