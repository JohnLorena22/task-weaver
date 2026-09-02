import { Head, Link, router, useForm } from '@inertiajs/react';

/**
 * Stage 3 — the Inertia page component.
 * `tasks`, `filter` and `stats` arrive as props from TaskController@index.
 */
export default function Index({ tasks, filter, stats }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        priority: 'normal',
    });

    function addTask(e) {
        e.preventDefault();
        post('/tasks', { onSuccess: () => reset('title') });
    }

    function toggle(task) {
        router.patch(`/tasks/${task.id}`, { completed: !task.completed }, { preserveScroll: true });
    }

    function destroy(task) {
        router.delete(`/tasks/${task.id}`, { preserveScroll: true });
    }

    return (
        <div className="task-page">
            <Head title="Task Manager" />

            <h1>Task Manager</h1>
            <p>
                {stats.open} open of {stats.total} total
            </p>

            <form onSubmit={addTask}>
                <input
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="What needs doing?"
                />
                <select value={data.priority} onChange={(e) => setData('priority', e.target.value)}>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                </select>
                <button type="submit" disabled={processing}>
                    Add task
                </button>
                {errors.title && <p className="error">{errors.title}</p>}
            </form>

            <nav className="filters">
                {['all', 'active', 'done'].map((key) => (
                    <Link
                        key={key}
                        href={`/tasks?filter=${key}`}
                        className={filter === key ? 'active' : ''}
                        preserveScroll
                    >
                        {key}
                    </Link>
                ))}
            </nav>

            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggle(task)}
                        />
                        <span className={task.completed ? 'done' : ''}>{task.title}</span>
                        <span className={`badge ${task.priority}`}>{task.priority}</span>
                        <button onClick={() => destroy(task)}>Delete</button>
                    </li>
                ))}
                {tasks.length === 0 && <li>No tasks yet.</li>}
            </ul>
        </div>
    );
}
