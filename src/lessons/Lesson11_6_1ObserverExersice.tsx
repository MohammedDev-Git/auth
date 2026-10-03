import { useEffect, useRef, useState } from "react"
import SkeletonLoader from "../components/SkeletonLoader"

type Task = {
    "id": number,
    "title": string,
    "done": boolean,
}

type ApiResponse = {
    data: Task[],
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
}

type CashedPages = {
    [key: number]: Task[];
}

const Lesson11_6_1ObserverExersice = () => {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [moreTasksAvailable, setMoreTasksAvailable] = useState(true);

    // we don't need chase, but we will use it for practise
    const [cashedPages, setCashedPages] = useState<CashedPages>({});

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        const controller = new AbortController();

        const fetchData = async () => {

            if (cashedPages[currentPage]) {
                const cashedTasks = cashedPages[currentPage];
                setTasks((currentTasks) => [...currentTasks, ...cashedTasks]);
                setLoading(false);
                return;
            }

            const endpoint = new URL("http://localhost:3000/tasks");
            endpoint.searchParams.set("limit", "10");
            endpoint.searchParams.set("page", currentPage.toString());
            endpoint.searchParams.set("delay", "0");

            setLoading(true);
            setError(null);

            try {
                const res = await fetch(endpoint, {
                    signal: controller.signal,
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => { });
                    throw new Error(errorData.message || "failed to get data, try later");
                }

                const resDetails: ApiResponse = await res.json();
                const newTasks = resDetails.data;

                setTasks((currentTasks) => [...currentTasks, ...newTasks]);
                setCashedPages((prev) => ({ ...prev, [currentPage]: newTasks }))
                setMoreTasksAvailable(currentPage !== resDetails.totalPages);

            } catch (err) {

                if (err instanceof Error) {

                    if (err.name === "AbortError") return;

                    if (err instanceof TypeError) {
                        if (!navigator.onLine) {
                            setError("check internet connection");
                        } else {
                            setError("server is down, try again later");
                        }
                        return;
                    }

                    setError(err.message);

                } else {
                    setError("unexpected error occured try later")
                }

            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => controller.abort();

    }, [currentPage])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !loading && moreTasksAvailable) {
                    setCurrentPage(p => p + 1);
                }
            })
        }, { rootMargin: "100px 0px" })

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();

    }, [loading, moreTasksAvailable])

    return (
        <div style={{ maxWidth: "500px", margin: "40px auto", fontFamily: "sans-serif" }}>
            <h2>Infinite Task Scroll</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        style={{
                            padding: "16px",
                            border: "1px solid #444",
                            borderRadius: "6px",
                            background: "#222",
                            color: "#fff",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <span>{task.title}</span>
                        <span style={{ fontSize: "0.85rem", color: task.done ? "limegreen" : "gold" }}>
                            {task.done ? "✓ Done" : "⏳ Pending"}
                        </span>
                    </div>
                ))}
            </div>

            {loading && <SkeletonLoader />}

            {error &&
                <div
                    style={{ padding: "20px", textAlign: "center", color: "red" }}
                >
                    <p>{error}</p>
                </div>
            }

            {
                !error && <div
                    ref={loadMoreRef}
                    style={{ marginTop: "40px", width: "102px", height: "3px", background: "red", padding: "20px", textAlign: "center", color: "#aaa" }}
                />
            }


        </div>
    );
}

export default Lesson11_6_1ObserverExersice