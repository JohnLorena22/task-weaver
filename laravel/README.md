# Task Manager — Laravel + Eloquent + Inertia + React

Reference source for CCS112 Week 11 (Module 2, topics c–e). Drop these files into a
fresh Laravel install to get a working, server-driven React task manager.

## Files

| Path | Stage | Purpose |
| --- | --- | --- |
| `routes/web.php` | 1 | Maps HTTP verb + URL to controller actions |
| `app/Http/Controllers/TaskController.php` | 1 & 3 | Request handling, validation, `Inertia::render` |
| `app/Models/Task.php` | 2 | Eloquent model, `$fillable`, casts, query scope |
| `database/migrations/*_create_tasks_table.php` | 2 | Schema for the `tasks` table |
| `database/seeders/TaskSeeder.php` | 2 | Demo rows |
| `resources/js/Pages/Tasks/Index.jsx` | 3 | Inertia page component (props + `useForm`) |
| `resources/js/app.jsx` | 3 | Inertia React adapter bootstrap |
| `resources/views/app.blade.php` | 3 | Root template with `@inertia` |

## Setup

```bash
composer create-project laravel/laravel task-manager
cd task-manager

# Backend Inertia adapter
composer require inertiajs/inertia-laravel
php artisan inertia:middleware
# register HandleInertiaRequests in bootstrap/app.php (Laravel 11+) or Kernel.php

# Frontend adapter
npm install @inertiajs/react @vitejs/plugin-react react react-dom

# Database (SQLite is fastest)
touch database/database.sqlite   # then set DB_CONNECTION=sqlite in .env
```

Copy the files from this folder over the matching paths, then:

```bash
php artisan migrate
php artisan db:seed --class=TaskSeeder
npm run dev      # terminal 1
php artisan serve # terminal 2  ->  http://127.0.0.1:8000/tasks
```

In `vite.config.js`, make sure the input is `resources/js/app.jsx` and the React plugin is registered.

## Request cycle

```text
Browser  ──GET /tasks──►  routes/web.php
                              │
                              ▼
                   TaskController@index
                              │  Task::latest()->get()
                              ▼
                    Inertia::render('Tasks/Index', ['tasks' => ...])
                              │
                              ▼
             resources/js/Pages/Tasks/Index.jsx  (props)
```

A `POST /tasks` submitted with Inertia's `useForm` runs the same validation rules a Blade
form would, repopulates `errors` on failure, and re-renders the page with fresh props on success —
no separate JSON API layer.
