<?php

use App\Http\Controllers\Api\TaskApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API routes (stateless JSON)
|--------------------------------------------------------------------------
| Prefixed with /api by Laravel. These return JSON resources rather than
| Inertia pages, so the same Eloquent model serves both the Inertia page
| and any external client (Postman, cURL, a mobile app).
*/

Route::apiResource('tasks', TaskApiController::class)->only([
    'index', 'store', 'show', 'update', 'destroy',
]);

// Equivalent explicit registration:
// Route::get('/tasks',           [TaskApiController::class, 'index']);
// Route::post('/tasks',          [TaskApiController::class, 'store']);
// Route::get('/tasks/{task}',    [TaskApiController::class, 'show']);
// Route::patch('/tasks/{task}',  [TaskApiController::class, 'update']);
// Route::delete('/tasks/{task}', [TaskApiController::class, 'destroy']);
