import { useState, useEffect } from "react";

type Task = {
    id: number;
    title: string;
    done: boolean;
};

type ApiResponse = {
    data: Task[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

type CashType = {
    [key: number]: Task[]
}

export default function Lesson11_5Exercise() {
    const [tasks, setTasks] = useState<Task[] | null>(null);

    const [cashedTasks, setCashedTasks] = useState<CashType>({});
    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const limit = 5;

    useEffect(() => {
        const controller = new AbortController();

        async function loadTasks() {

            if (cashedTasks[page]) {
                setTasks(cashedTasks[page]);
                return;
            }

            setIsLoading(true);
            const baseURL = new URL("http://localhost:3000/tasks");
            const endPoint = baseURL;

            endPoint.searchParams.set("page", page.toString());
            endPoint.searchParams.set("limit", limit.toString());
            endPoint.searchParams.set("delay", "1000");

            try {
                const response = await fetch(endPoint, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "failed to fetch data");
                }

                const responseData: ApiResponse = await response.json();
                setTasks(responseData.data);
                setTotalPages(responseData.totalPages);
                setCashedTasks(prev => {
                    return { ...prev, [page]: responseData.data }
                })

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
                    setError("unexpected error occured, try later");
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
        <div style={{ padding: "1rem" }}>
            <h2>Lesson 11.5: Classic Pagination</h2>

            {isLoading && <p>Loading page {page}...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="flex gap-2 items-center justify-center flex-col">
                {!isLoading && !error && tasks && (
                    <ul>
                        {tasks.map((task) => (
                            <li key={task.id}>
                                {task.title} — {task.done ? "✅" : "⏳"}
                            </li>
                        ))}
                    </ul>
                )}
                {/* TODO: Implement Previous button (disabled on page 1 or while loading) */}
                <div className="flex gap-3 items-center">
                    <button
                        disabled={page === 1 || isLoading}
                        onClick={() => setPage((prev) => prev - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    {/* TODO: Implement Next button (disabled on page === totalPages or while loading) */}
                    <button
                        disabled={page === totalPages || isLoading}
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}