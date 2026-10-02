import { useState } from "react"
import "./App.css"

import TaskForm from "./components/TaskForm"
import TaskList from "./components/TaskList"

const [activeView, setActiveView] = useState("dashboard")
const completedTasks = tasks.filter((item) => item.completed).length
const displayedTasks =
  activeView === "completed"
    ? tasks.filter((item) => item.completed)
    : activeView === "tasks"
      ? tasks.filter((item) => !item.completed)
      : tasks
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

  const completedTasks = tasks.filter((item) => item.completed).length

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">✓</div>
          <span>Task-Weaver</span>
        </div>

        <nav className="sidebar-nav">

            <button
  className={`nav-item ${activeView === "dashboard" ? "active" : ""}`}
  onClick={() => setActiveView("dashboard")}
>
  <span>⌂</span>
  Dashboard
</button>

<button
  className={`nav-item ${activeView === "tasks" ? "active" : ""}`}
  onClick={() => setActiveView("tasks")}
>
  <span>☷</span>
  My Tasks
</button>

<button
  className={`nav-item ${activeView === "completed" ? "active" : ""}`}
  onClick={() => setActiveView("completed")}
>
  <span>✓</span>
  Completed
</button>

        </nav>

        <div className="sidebar-bottom">

          <button className="nav-item">
            <span>⚙</span>
            Settings
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        <header className="topbar">

          <div>
            <p className="greeting">Good morning</p>
            <h1>My Tasks</h1>
          </div>

        </header>

        {/* STATISTICS */}
        <section className="stats">

          <div className="stat-card">
            <span className="stat-label">Total Tasks</span>
            <strong>{tasks.length}</strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">Completed</span>
            <strong>{completedTasks}</strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">Remaining</span>
            <strong>{tasks.length - completedTasks}</strong>
          </div>

        </section>

        {/* ADD TASK */}
        <section className="add-section">

          <div className="section-title">
            <h2>Add a task</h2>
            <p>Create something you want to accomplish.</p>
          </div>

          <TaskForm
            task={task}
            setTask={setTask}
            addTask={addTask}
          />

        </section>

        {/* TASK LIST */}
        <section className="tasks-section">

          <div className="section-header">

            <div>
              <h2>Today</h2>
              <p>{tasks.length} tasks</p>
            </div>

          </div>

          <TaskList
            tasks={tasks}
            editingId={editingId}
            editingText={editingText}
            setEditingText={setEditingText}
            toggleComplete={toggleComplete}
            startEdit={startEdit}
            saveEdit={saveEdit}
            deleteTask={deleteTask}
          />

        </section>

      </main>

    </div>
  )
}

export default App

