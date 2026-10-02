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
    return <p className="empty">No tasks yet.</p>
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