import { useState, useEffect } from "react";

type Task = {
    id: number;
    title: string;
    done: boolean;
};

export default function Lesson06Exercise() {
    const [tasks, setTasks] = useState<Task[]>([]);

    // Function to fetch initial tasks from backend
    async function loadTasks() {
        const response = await fetch("http://localhost:3000/tasks");
        const data: Task[] = await response.json();
        setTasks(data);
    }

    // Load tasks automatically when component mounts
    useEffect(() => {
        loadTasks();
    }, []);

    async function toggleTask(id: number, currentDone: boolean) {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "PATCH",
            body: JSON.stringify({
                done: !currentDone,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const updatedTask: Task = await response.json();
        setTasks((prevTasks) => prevTasks.map((task) => task.id === updatedTask.id ? updatedTask : task));

    }

    async function deleteTask(id: number) {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE"
        })

        const data = await response.json();
        console.log(data); // put it in snackbar or something
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }

    return (
        <section>
            <article className="card">
                <h2>Exercise: Update (PATCH) and Delete (DELETE)</h2>

                <ul className="task-list" style={{ marginTop: "1rem" }}>
                    {tasks.map((task) => (
                        <li key={task.id} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                            <span style={{ textDecoration: task.done ? "line-through" : "none" }}>
                                {task.title}
                            </span>
                            <button type="button" onClick={() => toggleTask(task.id, task.done)}>
                                {task.done ? "Undo" : "Complete"}
                            </button>
                            <button type="button" onClick={() => deleteTask(task.id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </article>
        </section>
    );
}