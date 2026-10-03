import { useState, useEffect } from "react";

type Task = {
    id: number;
    title: string;
    done: boolean;
};

export default function Lesson07Exercise() {
    const [tasks, setTasks] = useState<Task[]|null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function loadTasks() {
        setIsLoading(true)
        setError(null);

        try {

            const response = await fetch("http://localhost:3000/tasks");

            if (!response.ok) {
                const errorData: { error?: string } = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed To Fetch Data");
            }

            const data: Task[] = await response.json();
            setTasks(data);

        } catch (err) {

            if (!navigator.onLine) {
                setError("check the internet");
            } else if (err instanceof Error && err.message === "Failed to fetch") {
                setError("the server is closed");
            } else if (err instanceof Error && err.message) {
                setError(err.message);
            } else {
                setError("something went wrong");
            }

        } finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {
        loadTasks();
    }, []);

    return (
        <section>
            <article className="card">
                <h2>Exercise: Async States & Error Handling</h2>

                <button type="button" onClick={loadTasks}>
                    Reload Tasks
                </button>

                {/* TODO: Display Loading UI when isLoading is true */}

                {
                    isLoading && <p>please wait...</p>
                }

                {
                    error && <p>{error}</p>
                }

                {
                    !isLoading && !error && tasks && (
                        <ul className="task-list" style={{ marginTop: "1rem" }}>
                            dummy text
                            {tasks.map((task) => (
                                <li key={task.id}>{task.title}</li>
                            ))}
                        </ul>
                    )
                }

            </article>
        </section>
    );
}