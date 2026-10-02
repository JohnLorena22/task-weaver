import { useState } from "react"
import "./App.css"

function App() {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])

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
                <span>{item.title}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App