<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    /**
     * Mass-assignable columns. Anything not listed here is ignored by
     * Task::create() / $task->update(), which prevents mass-assignment
     * vulnerabilities (handout, topic d).
     */
    protected $fillable = [
        'title',
        'completed',
        'priority',
    ];

    /**
     * Cast database values to native PHP types so the JSON handed to the
     * Inertia page has real booleans instead of 0/1.
     */
    protected $casts = [
        'completed' => 'boolean',
    ];

    /** Query scope example: Task::open()->get() */
    public function scopeOpen($query)
    {
        return $query->where('completed', false);
    }
}
