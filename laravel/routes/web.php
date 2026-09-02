<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Welcome'));

/*
|--------------------------------------------------------------------------
| Task routes (Week 11 — Stage 1: Routing & Controllers)
|--------------------------------------------------------------------------
| Each URL + HTTP verb maps to a named controller action. Written out
| explicitly here so the mapping is readable; Route::resource('tasks',
| TaskController::class) would register the same set.
*/
Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
Route::patch('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

// Example of a grouped, middleware-protected route (handout, topic c)
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [TaskController::class, 'index'])->name('dashboard');
});
