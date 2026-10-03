import type { Task } from "../../lessons/authentication/Dashboard"
import { usePrivateApi } from "./usePrivateApi";

export const useTaskService = () => {
    const { privateApiClient } = usePrivateApi();
    return {
        getTasks: <T>(controller: AbortController) => privateApiClient<T>(`/tasks`, { controller }),
        getTask: <T>(taskId: string, controller: AbortController) => privateApiClient<T>(`/tasks/${taskId}`, { controller }),
        createTask: <T>(task: Omit<Task, "id"|"userId">, controller: AbortController) => privateApiClient<T>("/tasks", { body: task, method: "POST", controller }),
        editTask: <T>(taskId: string) => privateApiClient<T>(`/tasks/${taskId}`, { method: "PATCH" }),
        deleteTask: <T>(taskId: string) => privateApiClient<T>(`/tasks/${taskId}`, { method: "DELETE" }),
    }
}