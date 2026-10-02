function TaskForm({ task, setTask, addTask }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    addTask()
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What needs to be done?"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <button type="submit">
        Add Task
      </button>
    </form>
  )
}

export default TaskForm