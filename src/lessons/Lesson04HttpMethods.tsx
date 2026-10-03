import { useState } from "react";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export default function Lesson04HttpMethods() {
  const [result, setResult] = useState<Post | null>(null);

  async function sendGet() {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    const data: Post = await response.json();
    setResult(data);
    console.log("GET response", data);
  }

  return (
    <section>
      <article className="card">
        <h2>Real GET</h2>
        <p>
          This leaves the browser and hits a public API. Method: GET. URL:
          https://jsonplaceholder.typicode.com/posts/1
        </p>
        <button type="button" onClick={sendGet}>
          Send GET
        </button>
        <pre className="log">
          {result ? JSON.stringify(result, null, 2) : "No response yet."}
        </pre>
      </article>
      <p className="note">
        await just means “wait for the network”. We will study async properly
        later. Other methods (POST, PUT, PATCH, DELETE) use the same idea with
        a different verb.
      </p>
    </section>
  );
}
