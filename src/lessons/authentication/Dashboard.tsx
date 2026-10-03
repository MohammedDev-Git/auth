import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { useAuth } from "./contexts/AuthProvider";

import { type User } from "./contexts/AuthProvider";
import { useEffect, useRef, useState } from "react";
import { useTaskService } from "../../hooks/api/useTaskService";
import { authService } from "../../api/services/authServise";

export type Task = {
    "id": string;
    "title": string;
    "done": boolean;
    "userId": string,
};

type ApiResponse = {
    "data": Task[],
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number,
}

const Dashboard = () => {
    const { logout, token } = useAuth();

    const user = useOutletContext<User>();

    const [totalPages, setTotalPages] = useState(0);

    const [cashedPages, setCashedPages] = useState<Record<number, Task[]>>({});

    const [addError, setAddError] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isRemoveLoading, setIsRemoveLoading] = useState(false);
    const [removeError, setRemoveError] = useState<string | null>(null);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskInput, setTaskInput] = useState("");

    const { createTask, getTasks, deleteTask } = useTaskService();
    const { signOut } = authService;

    const resetErrors = () => {
        setAddError(null);
        setRemoveError(null);
    }

    const fetchTasks = async () => {

        resetErrors();

        const controller = new AbortController();
        try {

            setIsLoading(true);
            setError(null);

            const data = await getTasks<ApiResponse>(controller);

            setTasks(data.data);
            setTotalPages(data.totalPages);
            setCashedPages((pre) => {
                return { ...pre, [data.page]: data.data };
            })

        } catch (err) {
            if (err instanceof Error) {
                const apiErr = err as Error & { code?: string };
                if (apiErr.code === "TOKEN_INVALID") {
                    setError("try to login first");
                    return;
                }

                setError(err.message);

            }
        } finally {
            setIsLoading(false);
        }
    };

    const pendingTasksIDs = useRef<Record<string, AbortController>>({});

    const print = () => {
        console.log(pendingTasksIDs.current);
        console.log(tasks);
    }

    const addTask = async () => {
        const prevTasks = [...tasks];
        const newTask = { id: crypto.randomUUID(), userId: user.id, title: taskInput, done: false };
        setTasks((prev) => [...prev, newTask]);
        pendingTasksIDs.current[newTask.id] = new AbortController();

        try {
            setAddError(null);
            const currentController = pendingTasksIDs.current[newTask.id];
            const responseTask: Task = await createTask({ title: taskInput, done: false }, currentController);

            setTasks((prev) => {
                return prev.map((task) => {
                    return task.id === newTask.id ? responseTask : task;
                })
            })

        } catch (err) {

            if (err instanceof Error) {

                if (err.name === "AbortError") return;

                setTasks(prevTasks);

                if (err.message === "Unauthorized" || err.message === "Forbidden") {
                    logout();
                    return;
                }

                setAddError(err.message);

            }
        } finally {
            delete pendingTasksIDs.current[newTask.id];
        }
    }

    const removeTask = async (taskId: string) => {
        const prevTasks = [...tasks];
        setTasks((prev) => prev.filter((task) => task.id !== taskId));

        if (pendingTasksIDs.current[taskId]) {
            console.log(taskId, pendingTasksIDs.current[taskId]);
            const currentController = pendingTasksIDs.current[taskId];
            currentController.abort();
            delete pendingTasksIDs.current[taskId];
            return;
        }

        try {
            setRemoveError(null);
            setIsRemoveLoading(true);
            await deleteTask(taskId);

        } catch (err) {

            setTasks(prevTasks);

            if (err instanceof Error) {

                if (err.message === "Unauthorized" || err.message === "Forbidden") {
                    logout();
                    return;
                }

                setRemoveError(err.message);

            }
        } finally {
            setIsRemoveLoading(false);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    const [logoutLoading, setLogoutLoading] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);


    const handleLogout = async () => {
        try {
            setLogoutLoading(true);
            setLogoutError(null);
            if (token) {
                await signOut(token);
            }
            logout();
        } catch (err) {
            setLogoutError("failed to logout");
        } finally {
            setLogoutLoading(false);
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>hello {user.username}</p>

            <div>
                <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Enter new task"
                />
                <button
                    onClick={addTask}
                > "Add Task"
                </button>
            </div>
            {addError && <p className="text-red-500">{addError}</p>}

            <h3>Your Tasks</h3>
            <ul>
                {tasks.map((task) => (
                    <div key={task.id}>
                        <p>{task.title}</p>
                        <button onClick={() => removeTask(task.id)}>remove task</button>
                    </div>
                ))}
                {removeError && <p className="text-red-500">{removeError}</p>}
            </ul>

            <button disabled={logoutLoading} onClick={handleLogout}>{logoutLoading ? "loading..." : "sign out"}</button>
            <button onClick={() => fetchTasks()}>refetch</button>
            <button onClick={() => print()}>print</button>

        </div>
    );
};

export default Dashboard;