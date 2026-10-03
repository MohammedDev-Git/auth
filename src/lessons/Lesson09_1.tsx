import { useEffect, useState } from "react";

type Task = {
    id: number;
    title: string;
    done: boolean;
};

export default function Lesson09_1() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:3000/tasks");
                if (!response.ok) {
                    throw new Error("Failed to fetch tasks");
                }

                const data = await response.json();
                setTasks(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [])

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:3000/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title
                })
            })

            if (!response.ok) {
                throw new Error("Failed to create task");
            }

            const newTask: Task = await response.json();
            setTasks(currentTasks => [...currentTasks, newTask]);
            setTitle("");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>

            <form onSubmit={handleCreateTask} className="p-4 space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New task title..."
                    className="px-3 py-2 bg-slate-800 text-white rounded border border-slate-700"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                >
                    {isLoading ? "Adding..." : "Add Task"}
                </button>
                {error && <p className="text-red-400">{error}</p>}
            </form>
            

            {
                tasks &&
                tasks.map(task => {
                    return (
                        <div key={task.id} className="flex items-center gap-2">
                            <p>{task.title}</p>
                            <p>{task.done ? "✅" : "⏳"}</p>
                        </div>
                    )
                })
            }

        </div>
    );
}