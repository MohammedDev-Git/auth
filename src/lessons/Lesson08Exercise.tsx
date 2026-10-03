import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Task = {
    id: number;
    title: string;
    done: boolean;
};

export default function Lesson08Exercise() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [tasks, setTasks] = useState<Task[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

    const status = searchParams.get("status") || "all";

    useEffect(() => {

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            const baseURL = "http://localhost:3000";
            const endPoint = new URL("tasks", baseURL);
            if (status !== "all") {
                endPoint.searchParams.set("status", status);
            }

            try {
                const response = await fetch(endPoint.href);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || "failed to fetch data");
                }
                const data = await response.json();
                setTasks(data);
            } catch (err) {
                if (!navigator.onLine) {
                    setError("check internet");
                } else if (err instanceof Error && err.message === "Failed to fetch") {
                    setError("server closed");
                } else if (err instanceof Error && err.message) {
                    setError(err.message);
                } else {
                    setError("something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();

    }, [status])

    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            params.set("q", searchValue);
            setSearchParams(params);
        }, 300);

    }, [searchValue])

    const filteredTasks = useMemo(() => {
        return tasks?.filter(task => task.title.toLowerCase().includes(searchValue.trim().toLowerCase()))
    }, [searchParams, tasks])

    return (
        <div className="max-w-xl mx-auto p-6 bg-slate-900 text-slate-100 rounded-xl shadow-lg mt-10 border border-slate-800 font-sans">
            <h2 className="text-2xl font-bold mb-6 text-indigo-400">Exercise 08: Multi-Param Fetching</h2>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value)
                    }}
                    type="text"
                    placeholder="Search task title..."
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-400"
                />

                <select
                    value={status}
                    onChange={(e) => {
                        const params = new URLSearchParams(searchParams);
                        params.set("status", e.target.value);
                        setSearchParams(params);
                    }}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 cursor-pointer">
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            <div className="space-y-4">
                {isLoading && <p className="text-slate-400 text-sm animate-pulse">Loading tasks...</p>}
                {error && <p className="text-red-400 text-sm bg-red-950/50 p-3 rounded-lg border border-red-900/50">{error}</p>}

                {
                    filteredTasks && (
                        <ul className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden bg-slate-800/40">
                            {filteredTasks.map(task => {
                                return (
                                    <li key={task.id} className="px-4 py-3 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                                        <span className="text-slate-200">{task.title}</span>
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                                            {task.done ? " (completed)" : " (not completed)"}
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>
                    )
                }
            </div>
        </div>
    );
}