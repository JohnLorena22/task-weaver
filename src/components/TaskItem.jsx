function TaskItem({
  item,
  editingId,
  editingText,
  setEditingText,
  toggleComplete,
  startEdit,
  saveEdit,
  deleteTask,
}) {
  return (
    <div className="task-item">
      <div className="task-content">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => toggleComplete(item.id)}
        />

        {editingId === item.id ? (
          <input
            className="edit-input"
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
          />
        ) : (
          <span className={item.completed ? "completed" : ""}>
            {item.title}
          </span>
        )}
      </div>

      <div className="task-actions">
        {editingId === item.id ? (
          <button
            className="save-button"
            onClick={() => saveEdit(item.id)}
          >
            Save
          </button>
        ) : (
          <button
            className="edit-button"
            onClick={() => startEdit(item)}
          >
            Edit
          </button>
        )}

        <button
          className="delete-button"
          onClick={() => deleteTask(item.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default TaskItem