import { useState } from "react";

type Task = {
    id: number;
    title: string;
    done: boolean;
};

export default function Lesson06PutPatchDelete() {
    const [log, setLog] = useState<string>("No actions executed yet.");

    // 1. PATCH: Partial update (Toggle status)
    async function toggleTaskPatch(id: number, currentStatus: boolean) {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: !currentStatus,
            }),
        });

        const updatedTask: Task = await response.json();
        setLog(`PATCH Result: Task ${id} title state changed to ${updatedTask.title}`);
    }

    // 2. DELETE: Remove item
    async function deleteTask(id: number) {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE",
        });

        const result = await response.json();
        setLog(`DELETE Result: ${JSON.stringify(result)}`);
    }

    return (
        <section>
            <article className="card">
                <h2>Real PATCH & DELETE</h2>
                <p>Target Endpoint: http://localhost:3000/tasks/:id</p>

                <div style={{ display: "flex", gap: "10px", margin: "1rem 0" }}>
                    <button type="button" onClick={() => toggleTaskPatch(1, false)}>
                        Send PATCH (/tasks/1)
                    </button>
                    <button type="button" onClick={() => deleteTask(2)}>
                        Send DELETE (/tasks/2)
                    </button>
                </div>

                <pre className="log">{log}</pre>
            </article>
            <p className="note">
                Notice how dynamic routes (`/tasks/1`) specify which exact resource to target. DELETE does not need a `body`.
            </p>
        </section>
    );
}