import { useEffect, useState } from "react";

type Task = {
    id: number;
    title: string;
    done: boolean;
};

export default function Lesson09_3() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [id, setId] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

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

    const handleUpdateTask = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsUpdating(true);
        setUpdateError(null);

        try {
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    done: false,
                    title: newTitle,
                })
            })

            if (!response.ok) {
                throw new Error("Failed to create task");
            }

            const updatedTask: Task = await response.json();
            setTasks(currentTasks => currentTasks.map((task) => task.id === updatedTask.id ? updatedTask : task));
            setId("");
            setNewTitle("");
        } catch (err) {
            if (err instanceof Error) {
                setUpdateError(err.message);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDeleteTask = async (id: number) => {

        setDeleteLoading(true);
        setDeleteError(null);

        try {
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("failed to delete");
            }

            setTasks(currentTasks => currentTasks.filter((task) => task.id !== id));

        } catch (err) {
            if (err instanceof Error) {
                setDeleteError(err.message || "an unexpected error occured");
            }
        } finally {
            setDeleteLoading(false);
        }
    }

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
            <form onSubmit={handleUpdateTask}>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="type task id"
                />
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="type new title"
                />
                <button type="submit">Update</button>
            </form>
            {
                tasks &&
                tasks.map(task => {
                    return (
                        <div key={task.id} className="flex flex-row items-center gap-2">
                            <hr />
                            <p>{task.title}</p>
                            <p>{task.done ? "✅" : "⏳"}</p>
                            <p>id: {task.id}</p>
                            <button
                                disabled={deleteLoading}
                                onClick={() => handleDeleteTask(task.id)}
                                className="bg-red-400 text-white">remove task
                            </button>
                            <hr />
                        </div>
                    )
                })
            }
            {deleteError && <p>{deleteError}</p>}

        </div>
    );
}