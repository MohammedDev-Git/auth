import { useState } from "react";

type Task = {
    id: number;
    title: string;
    done: boolean;
};

export default function Lesson05PostMethod() {
    const [result, setResult] = useState<Task | null>(null);

    async function sendPost() {
        const response = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            body: JSON.stringify({
                title: "new task",
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })

        const data: Task = await response.json();
        setResult(data);

    }

    return (
        <section>
            <article className="card">
                <h2>Real POST (Local Backend)</h2>
                <p>
                    Method: POST. URL: http://localhost:3000/tasks
                </p>
                <button type="button" onClick={sendPost}>
                    Send POST to Local Server
                </button>
                <pre className="log">
                    {result ? JSON.stringify(result, null, 2) : "No response yet."}
                </pre>
            </article>
            <p className="note">
                The header `Content-Type: application/json` informs the Node server to parse `req.on('data')` as JSON.
            </p>
        </section>
    );
}