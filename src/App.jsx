import { useState } from "react"
import "./App.css"

import TaskForm from "./components/TaskForm"
import TaskList from "./components/TaskList"

function App() {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])

  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState("")

  const [activeView, setActiveView] = useState("dashboard")

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

  // =========================
  // TASK STATISTICS
  // =========================

  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    (item) => item.completed
  ).length

  const pendingTasks = tasks.filter(
    (item) => !item.completed
  ).length

  // =========================
  // FILTER TASKS
  // =========================

  let displayedTasks = tasks

  if (activeView === "tasks") {
    displayedTasks = tasks.filter(
      (item) => !item.completed
    )
  }

  if (activeView === "completed") {
    displayedTasks = tasks.filter(
      (item) => item.completed
    )
  }

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <h1>Task Weaver</h1>

        <p className="sidebar-subtitle">
          Manage your tasks
        </p>

        <button
          className={`nav-item ${
            activeView === "dashboard" ? "active" : ""
          }`}
          onClick={() => setActiveView("dashboard")}
        >
          <span>⌂</span>
          Dashboard
        </button>

        <button
          className={`nav-item ${
            activeView === "tasks" ? "active" : ""
          }`}
          onClick={() => setActiveView("tasks")}
        >
          <span>☷</span>
          My Tasks
        </button>

        <button
          className={`nav-item ${
            activeView === "completed" ? "active" : ""
          }`}
          onClick={() => setActiveView("completed")}
        >
          <span>✓</span>
          Completed
        </button>

        <div className="sidebar-bottom">
          <p>Total Tasks: {totalTasks}</p>
          <p>Completed: {completedTasks}</p>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        <div className="container">

          <h2>
            {activeView === "dashboard"
              ? "Today"
              : activeView === "tasks"
                ? "My Tasks"
                : "Completed"}
          </h2>

          <p className="subtitle">
            {activeView === "dashboard"
              ? "A simple overview of your tasks"
              : `${displayedTasks.length} tasks`}
          </p>

          {/* DASHBOARD STATISTICS */}

          {activeView === "dashboard" && (
            <div className="stats">

              <div className="stat-card">
                <span className="stat-label">
                  Total Tasks
                </span>

                <strong className="stat-number">
                  {totalTasks}
                </strong>
              </div>

              <div className="stat-card">
                <span className="stat-label">
                  To Do
                </span>

                <strong className="stat-number">
                  {pendingTasks}
                </strong>
              </div>

              <div className="stat-card">
                <span className="stat-label">
                  Completed
                </span>

                <strong className="stat-number">
                  {completedTasks}
                </strong>
              </div>

            </div>
          )}

          <TaskForm
            task={task}
            setTask={setTask}
            addTask={addTask}
          />

          <TaskList
            tasks={displayedTasks}
            editingId={editingId}
            editingText={editingText}
            setEditingText={setEditingText}
            toggleComplete={toggleComplete}
            startEdit={startEdit}
            saveEdit={saveEdit}
            deleteTask={deleteTask}
          />

        </div>

      </main>

    </div>
  )
}

export default App
