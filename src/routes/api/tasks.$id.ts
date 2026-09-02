import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { json, taskDb } from "@/lib/task-db";

/**
 * Equivalent of Laravel's:
 *   Route::patch('/api/tasks/{task}',  [TaskController::class, 'update']);
 *   Route::delete('/api/tasks/{task}', [TaskController::class, 'destroy']);
 */
const updateSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    completed: z.boolean().optional(),
    priority: z.enum(["low", "normal", "high"]).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update." });

export const Route = createFileRoute("/api/tasks/$id")({
  server: {
    handlers: {
      // update() — route-model binding equivalent: resolve {task} by id.
      PATCH: async ({ request, params }) => {
        const id = Number(params.id);
        if (!Number.isInteger(id)) return json({ message: "Not found." }, 404);

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ message: "Invalid JSON body." }, 400);
        }

        const parsed = updateSchema.safeParse(body);
        if (!parsed.success) {
          return json(
            { message: "The given data was invalid.", errors: parsed.error.flatten().fieldErrors },
            422,
          );
        }

        const patch: { title?: string; completed?: boolean; priority?: string } = {};
        if (parsed.data.title !== undefined) patch.title = parsed.data.title;
        if (parsed.data.completed !== undefined) patch.completed = parsed.data.completed;
        if (parsed.data.priority !== undefined) patch.priority = parsed.data.priority;

        const { data, error } = await taskDb()
          .from("tasks")
          .update(patch)
          .eq("id", id)
          .select()
          .maybeSingle();

        if (error) return json({ message: error.message }, 500);
        if (!data) return json({ message: "Not found." }, 404);
        return json({ data });
      },

      // destroy() — 204 No Content
      DELETE: async ({ params }) => {
        const id = Number(params.id);
        if (!Number.isInteger(id)) return json({ message: "Not found." }, 404);

        const { error } = await taskDb().from("tasks").delete().eq("id", id);
        if (error) return json({ message: error.message }, 500);
        return new Response(null, { status: 204 });
      },
    },
  },
});
