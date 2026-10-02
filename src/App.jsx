import { useState } from "react"
import "./App.css"

import TaskForm from "./components/TaskForm"
import TaskList from "./components/TaskList"

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

        <TaskForm
          task={task}
          setTask={setTask}
          addTask={addTask}
        />

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
      </div>
    </div>
  )
}

export default App