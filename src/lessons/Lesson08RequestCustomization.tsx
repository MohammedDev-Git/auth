import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

type Task = {
    id: number;
    title: string;
    done: boolean;
};

type FilterStatus = "all" | "completed" | "pending";

export default function Lesson08RequestCustomization() {
    const [tasks, setTasks] = useState<Task[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Read single source of truth from browser URL bar
    const statusParam = (searchParams.get("status") as FilterStatus) || "all";

    // 2. Re-fetch whenever the URL parameter changes
    useEffect(() => {
        async function loadTasks() {
            setIsLoading(true);
            setError(null);

            // Construct target URL using native URL + URLSearchParams
            const apiUrl = new URL("http://localhost:3000/tasks");
            if (statusParam !== "all") {
                apiUrl.searchParams.set("status", statusParam);
            }

            try {
                const response = await fetch(apiUrl.href);

                if (!response.ok) {
                    throw new Error("Failed to fetch tasks");
                }

                const data: Task[] = await response.json();
                setTasks(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadTasks();
    }, [statusParam]);

    // 3. UI interaction updates the URL searchParams
    function handleFilterChange(newStatus: FilterStatus) {
        if (newStatus === "all") {
            setSearchParams({});
        } else {
            setSearchParams({ status: newStatus });
        }
    }

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Lesson 08: Server-Side Filtering</h2>

            <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
                <button onClick={() => handleFilterChange("all")}>All</button>
                <button onClick={() => handleFilterChange("completed")}>Completed</button>
                <button onClick={() => handleFilterChange("pending")}>Pending</button>
            </div>

            <p>Active Filter in URL: <strong>{statusParam}</strong></p>

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