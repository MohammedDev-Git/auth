import { useState } from "react";

type Task = {
  id: number,
  title: string,
  done: boolean,
}

export default function Lesson04Exercise() {

  const [tasks, setTasks] = useState<Task[] | null>(null);

  async function loadTasks() {
    const response = await fetch("http://localhost:3000/tasks");
    const data = await response.json();
    setTasks(data);
  }

  return (
    <section>
      <article className="card">
        <h2>Exercise: show the tasks</h2>
        <p>
          Method: GET. Endpoint: /tasks. Full URL:
          http://localhost:3000/tasks
        </p>
        <p>The response is an array. Each item has id, title, and done.</p>
        <button type="button" onClick={loadTasks}>
          Load tasks
        </button>
        {
          tasks ?
            <ul className="task-list">
              {
                tasks.map((task) => {
                  return (
                    <li key={task.id} className="task-empty">
                      {task.title}
                    </li>
                  )
                })
              }
            </ul>
            :
            <p>No tasks yet. Wire up the GET.</p>
        }

      </article>
    </section>
  );
}
