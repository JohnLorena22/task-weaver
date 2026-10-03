import { useState, useEffect } from "react"
import "./App.css"

import TaskForm from "./components/TaskForm"
import TaskList from "./components/TaskList"

function App() {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])

  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState("")

  const [activeView, setActiveView] = useState("dashboard")
  const API_URL = "http://127.0.0.1:8000/api/tasks"

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        const formattedTasks = data.map((item) => ({
          ...item,
          completed: item.status === "completed",
        }))

        setTasks(formattedTasks)
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error)
      })
  }, [])

  // ADD TASK
  const addTask = async () => {
    if (task.trim() === "") return

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task,
          description: "",
          status: "pending",
          due_date: null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add task")
      }

      const data = await response.json()

      const newTask = {
        ...data,
        completed: data.status === "completed",
      }

      setTasks([...tasks, newTask])
      setTask("")
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  // TOGGLE COMPLETE
  const toggleComplete = async (id) => {
    const currentTask = tasks.find((item) => item.id === id)

    if (!currentTask) return

    const newStatus =
      currentTask.completed ? "pending" : "completed"

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentTask.title,
          description: currentTask.description || "",
          status: newStatus,
          due_date: currentTask.due_date || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task status")
      }

      const data = await response.json()

      const updatedTask = {
        ...data.task,
        completed: data.task.status === "completed",
      }

      setTasks(
        tasks.map((item) =>
          item.id === id ? updatedTask : item
        )
      )
    } catch (error) {
      console.error("Error updating task status:", error)
    }
  }

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete task")
      }

      setTasks(tasks.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditingText(item.title)
  }

  // EDIT TASK
  const saveEdit = async (id) => {
    if (editingText.trim() === "") return

    try {
      const currentTask = tasks.find((item) => item.id === id)

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editingText,
          description: currentTask.description || "",
          status: currentTask.completed ? "completed" : "pending",
          due_date: currentTask.due_date || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      const data = await response.json()

      const updatedTask = {
        ...data.task,
        completed: data.task.status === "completed",
      }

      setTasks(
        tasks.map((item) =>
          item.id === id ? updatedTask : item
        )
      )

      setEditingId(null)
      setEditingText("")
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  // TASK STATISTICS

  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    (item) => item.completed
  ).length

  const pendingTasks = tasks.filter(
    (item) => !item.completed
  ).length

  // FILTER TASKS

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