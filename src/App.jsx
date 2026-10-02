import { useState } from "react"
import "./App.css"

function App() {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState("")

  const addTask = () => {
    if (task.trim() === "") return

    const newTask = {
      id: Date.now(),
      title: task,
      completed: false,
    }

    setTasks([...tasks, newTask])
    setTask("")
  }

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    )
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((item) => item.id !== id))
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditingText(item.title)
  }

  const saveEdit = (id) => {
    if (editingText.trim() === "") return

    setTasks(
      tasks.map((item) =>
        item.id === id
          ? { ...item, title: editingText }
          : item
      )
    )

    setEditingId(null)
    setEditingText("")
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Task Manager</h1>
        <p className="subtitle">Manage your tasks easily</p>

        <div className="task-form">
          <input
            type="text"
            placeholder="Enter a task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <button onClick={addTask}>Add Task</button>
        </div>

        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="empty">No tasks yet.</p>
          ) : (
            tasks.map((item) => (
              <div className="task-item" key={item.id}>
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
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App