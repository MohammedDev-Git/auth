import { useState, useEffect } from "react";

type Task = { id: number; title: string; done: boolean };
type ApiResponse = {
    data: Task[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export default function Lesson11_5Pagination() {
    const [tasks, setTasks] = useState<Task[] | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const limit = 5;

    useEffect(() => {
        const controller = new AbortController();

        async function loadTasks() {
            setIsLoading(true);
            setError(null);

            const apiUrl = new URL("http://localhost:3000/tasks");
            apiUrl.searchParams.set("page", page.toString());
            apiUrl.searchParams.set("limit", limit.toString());
            apiUrl.searchParams.set("delay", "1000");

            try {
                const response = await fetch(apiUrl.href, { signal: controller.signal });
                if (!response.ok) throw new Error("Failed to fetch page data");

                const result: ApiResponse = await response.json();
                setTasks(result.data);
                setTotalPages(result.totalPages);
            } catch (err) {
                if (err instanceof Error) {
                    if (err.name === "AbortError") return; // Silence intentional aborts
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
    }, [page]);

    return (
        <div>
            {isLoading && <p>Loading page {page}...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!isLoading && !error && tasks && (
                <>
                    <ul>
                        {tasks.map((task) => (
                            <li key={task.id}>{task.title}</li>
                        ))}
                    </ul>
                    <div>
                        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                            Prev
                        </button>
                        <span> Page {page} of {totalPages} </span>
                        <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}