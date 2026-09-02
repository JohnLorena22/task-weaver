import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { json, taskDb } from "@/lib/task-db";

/**
 * Equivalent of Laravel's:
 *   Route::get('/api/tasks',  [TaskController::class, 'index']);
 *   Route::post('/api/tasks', [TaskController::class, 'store']);
 */
const storeSchema = z.object({
  title: z.string().trim().min(1, "The title field is required.").max(255),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
});

export const Route = createFileRoute("/api/tasks")({
  server: {
    handlers: {
      // index()
      GET: async ({ request }) => {
        const filter = new URL(request.url).searchParams.get("filter") ?? "all";
        const db = taskDb();

        let query = db.from("tasks").select("*").order("created_at", { ascending: false });
        if (filter === "active") query = query.eq("completed", false);
        if (filter === "done") query = query.eq("completed", true);

        const { data, error } = await query;
        if (error) return json({ message: error.message }, 500);

        const tasks = data ?? [];
        return json({
          data: tasks,
          meta: {
            filter,
            total: tasks.length,
            open: tasks.filter((t) => !t.completed).length,
          },
        });
      },

      // store() — validate, then persist. 201 Created on success, 422 on validation failure.
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ message: "Invalid JSON body." }, 400);
        }

        const parsed = storeSchema.safeParse(body);
        if (!parsed.success) {
          return json(
            {
              message: "The given data was invalid.",
              errors: parsed.error.flatten().fieldErrors,
            },
            422,
          );
        }

        const { data, error } = await taskDb()
          .from("tasks")
          .insert({ title: parsed.data.title, priority: parsed.data.priority })
          .select()
          .single();

        if (error) return json({ message: error.message }, 500);
        return json({ data }, 201);
      },
    },
  },
});
