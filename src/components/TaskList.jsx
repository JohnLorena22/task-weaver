import TaskItem from "./TaskItem"

function TaskList({
  tasks,
  editingId,
  editingText,
  setEditingText,
  toggleComplete,
  startEdit,
  saveEdit,
  deleteTask,
}) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✓</div>

        <h3>No tasks yet</h3>

        <p>
          Add your first task above and start getting things done.
        </p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((item) => (
        <TaskItem
          key={item.id}
          item={item}
          editingId={editingId}
          editingText={editingText}
          setEditingText={setEditingText}
          toggleComplete={toggleComplete}
          startEdit={startEdit}
          saveEdit={saveEdit}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  )
}

export default TaskList