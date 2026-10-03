import { useState } from "react";

type Task = {
    id: number;
    title: string;
    done: boolean;
};

export default function Lesson07AsyncStates() {
    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchTask(id: number) {
        setIsLoading(true);
        setError(null); // Reset previous errors

        try {
            const response = await fetch(`http://localhost:3000/tasks/${id}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => { })
                throw new Error(errorData.error || "failed to fetch data");
            }

            const data: Task = await response.json();
            setTask(data);

        } catch (err) {

            if (!navigator.onLine) {
                setError("please check internet connection");
            } else if (err instanceof Error && err.message === "Failed to fetch") {
                setError("please ensure that the server is running");
            } else if (err instanceof Error && err.message) {
                setError(err.message);
            } else {
                setError("something went wrong, please try again later")
            }


        } finally {
            setIsLoading(false);
        }

    }

    return (
        <section>
            <article className="card">
                <h2>Real Async States & Error Handling</h2>

                <div style={{ display: "flex", gap: "10px", margin: "1rem 0" }}>
                    <button type="button" onClick={() => fetchTask(1)}>
                        Fetch Valid Task (/tasks/1)
                    </button>
                    <button type="button" onClick={() => fetchTask(999)}>
                        Fetch Invalid Task (/tasks/999)
                    </button>
                </div>

                {/* 1. Loading State UI */}
                {isLoading && <p>Loading data from server...</p>}

                {/* 2. Error State UI */}
                {error && <p style={{ color: "red" }}>Error: {error}</p>}

                {/* 3. Data State UI */}
                {task && !isLoading && !error && (
                    <div>
                        <h3>Task #{task.id}</h3>
                        <p>Title: {task.title}</p>
                        <p>Status: {task.done ? "Completed" : "Pending"}</p>
                    </div>
                )}
            </article>
            <p className="note">
                Note: `fetch` only throws an exception on actual network failures (offline/CORS). For HTTP status codes like 404 or 500, you must check `response.ok`.
            </p>
        </section>
    );
}