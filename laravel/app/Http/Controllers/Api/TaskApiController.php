<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Stateless JSON API for tasks.
 * Validation lives in Form Request classes; output shape lives in TaskResource.
 */
class TaskApiController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $filter = $request->query('filter', 'all');

        $tasks = Task::query()
            ->when($filter === 'active', fn ($q) => $q->where('completed', false))
            ->when($filter === 'done', fn ($q) => $q->where('completed', true))
            ->latest()
            ->get();

        return TaskResource::collection($tasks)->additional([
            'meta' => [
                'filter' => $filter,
                'total'  => $tasks->count(),
                'open'   => $tasks->where('completed', false)->count(),
            ],
        ]);
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = Task::create($request->validated());

        // 201 Created, with the new resource in the body
        return (new TaskResource($task))->response()->setStatusCode(201);
    }

    public function show(Task $task): TaskResource
    {
        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task): TaskResource
    {
        $task->update($request->validated());

        return new TaskResource($task->fresh());
    }

    public function destroy(Task $task): JsonResponse
    {
        $task->delete();

        // 204 No Content
        return response()->json(null, 204);
    }
}
