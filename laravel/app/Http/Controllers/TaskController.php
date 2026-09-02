<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    /**
     * Stage 3 — Inertia: name the page component and pass it props.
     * The React component at resources/js/Pages/Tasks/Index.jsx receives
     * $tasks as a prop; no separate JSON API endpoint is needed.
     */
    public function index(Request $request): Response
    {
        $filter = $request->query('filter', 'all');

        $tasks = Task::query()
            ->when($filter === 'active', fn ($query) => $query->where('completed', false))
            ->when($filter === 'done', fn ($query) => $query->where('completed', true))
            ->latest()
            ->get();

        return Inertia::render('Tasks/Index', [
            'tasks'  => $tasks,
            'filter' => $filter,
            'stats'  => [
                'total' => Task::count(),
                'open'  => Task::where('completed', false)->count(),
            ],
        ]);
    }

    /**
     * Stage 2 — Eloquent: validate, then mass-assign only $fillable columns.
     * Returning a redirect lets Inertia re-render the page with fresh props.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'    => ['required', 'string', 'max:255'],
            'priority' => ['nullable', 'in:low,normal,high'],
        ]);

        Task::create([
            'title'    => $validated['title'],
            'priority' => $validated['priority'] ?? 'normal',
        ]);

        return redirect()->route('tasks.index')->with('success', 'Task created.');
    }

    /**
     * Route-model binding resolves {task} to a Task instance automatically.
     */
    public function update(Request $request, Task $task): RedirectResponse
    {
        $validated = $request->validate([
            'title'     => ['sometimes', 'required', 'string', 'max:255'],
            'completed' => ['sometimes', 'boolean'],
            'priority'  => ['sometimes', 'in:low,normal,high'],
        ]);

        $task->update($validated);

        return back()->with('success', 'Task updated.');
    }

    public function destroy(Task $task): RedirectResponse
    {
        $task->delete();

        return back()->with('success', 'Task deleted.');
    }
}
