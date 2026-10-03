import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  done: boolean;
};

export default function Lesson05Exercise() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  async function loadTasks() {
    const response = await fetch("http://localhost:3000/tasks");
    const data: Task[] = await response.json();
    setTasks(data);
    
  }

  useEffect(() => {
    loadTasks();
  }, [])

  async function addTask() {
    setIsLoading(true);
    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      body: JSON.stringify({
        title,
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })

    const newTask = await response.json();

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTitle("");
    setIsLoading(false)
  }

  return (
    <section>
      <article className="card">
        <h2>Exercise: Add a new task (POST)</h2>
        <p>
          Method: POST. Endpoint: /tasks. Full URL: http://localhost:3000/tasks
        </p>

        <button type="button" onClick={loadTasks}>
          Load tasks first
        </button>

        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="New task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button disabled={isLoading} type="button" onClick={addTask}>
            {isLoading ? "please wait..." : "Add Task"}
          </button>
        </div>

        <ul className="task-list" style={{ marginTop: "1rem" }}>
          {tasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}