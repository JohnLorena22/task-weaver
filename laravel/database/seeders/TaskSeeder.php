<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        Task::insert([
            [
                'title'      => 'Define /tasks route and TaskController@index',
                'completed'  => true,
                'priority'   => 'high',
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ],
            [
                'title'      => 'Run migration for the tasks table',
                'completed'  => false,
                'priority'   => 'normal',
                'created_at' => now()->subHour(),
                'updated_at' => now()->subHour(),
            ],
            [
                'title'      => 'Render Tasks/Index through Inertia with props',
                'completed'  => false,
                'priority'   => 'high',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
