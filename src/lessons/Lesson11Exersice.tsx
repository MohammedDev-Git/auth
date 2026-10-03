import { useState, useEffect } from "react";

type Task = {
    id: number;
    title: string;
    done: boolean;
};


export default function Lesson11Exersice() {
    const [tasks, setTasks] = useState<Task[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 2. Re-fetch whenever the URL parameter changes
    useEffect(() => {

        const controller = new AbortController();

        async function loadTasks() {
            setIsLoading(true);
            setError(null);

            const apiUrl = new URL("http://localhost:3000/tasks?delay=1500");

            try {
                const response = await fetch(apiUrl.href, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || "Failed to fetch tasks");
                }

                const data: Task[] = await response.json();
                setTasks(data);
            } catch (err) {
                if (err instanceof Error) {

                    if (err.name === "AbortError") return;

                    if (err instanceof TypeError) {
                        if (!navigator.onLine) {
                            setError("you are offline");
                        } else {
                            setError("server is offline");
                        }
                        return;
                    }

                    setError(err.message);
                } else {
                    setError("Something went wrong");
                }

            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        loadTasks();


        return () => controller.abort();

    }, []);

    useEffect(() => {
        console.log(isLoading);
    }, [isLoading])

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Lesson 08: Server-Side Filtering</h2>

            {isLoading && <p>Loading tasks...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!isLoading && !error && tasks && (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            {task.title} — {task.done ? "✅" : "⏳"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}