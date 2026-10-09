
import React, { useEffect, useState } from "react";
import "./style.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to load tasks");

      setTasks(await response.json());
      setError("");
    } catch {
      setError("Unable to connect to the backend. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });

      if (!response.ok) throw new Error("Failed to save task");

      setTitle("");
      await loadTasks();
    } catch {
      setError("Task could not be saved. Check the backend and database.");
    }
  }

  return (
    <main className="container">
      <header className="header">
        <span className="eyebrow">DOCKERIZED MERN APPLICATION</span>
        <h1>Task Manager<span>.</span></h1>
        <p>Organize your work, one task at a time.</p>
      </header>

      <section className="task-panel">
        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to get done?"
            aria-label="Task title"
            maxLength={200}
          />
          <button type="submit">Add task +</button>
        </form>

        <div className="task-summary">
          <h2>Your tasks</h2>
          <span>{tasks.length} total</span>
        </div>

        {error && <p className="error" role="alert">{error}</p>}

        {loading ? (
          <p className="empty">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add your first task above.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className="task-item">
                <span className="task-dot"></span>
                <span>{task.title}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer>
        <span>React</span>
        <span>Node.js + Express</span>
        <span>MongoDB</span>
        <span>Docker Compose</span>
      </footer>
    </main>
  );
}
