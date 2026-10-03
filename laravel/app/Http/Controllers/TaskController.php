<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::all();

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'pending',
            'due_date' => $request->due_date,
        ]);

        return response()->json($task, 201);
    }

    public function update(Request $request, $id)
   {
    $task = Task::find($id);

    if (!$task) {
        return response()->json([
            'message' => 'Task not found'
        ], 404);
    }

    $task->update([
        'title' => $request->title,
        'description' => $request->description,
        'status' => $request->status,
        'due_date' => $request->due_date,
    ]);

    return response()->json([
        'message' => 'Task updated successfully',
        'task' => $task
    ], 200);
    }


    public function destroy($id)
    {
    $task = Task::find($id);

    if (!$task) {
        return response()->json([
            'message' => 'Task not found'
        ], 404);
    }

    $task->delete();

    return response()->json([
        'message' => 'Task deleted successfully'
    ], 200);
    }
}