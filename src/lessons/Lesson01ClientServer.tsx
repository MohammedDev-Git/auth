import { useState } from "react";

function fakeServer(messageFromClient: string) {
  return `The server received your message: "${messageFromClient}"`;
}

export default function Lesson01ClientServer() {
  const [clientLog, setClientLog] = useState("I have not sent anything yet.");
  const [serverLog, setServerLog] = useState("Waiting for a request from the Client.");

  function sendFromClient() {
    const message = "Give me the task list";
    setClientLog(`I sent this to the server: ${message}`);

    const reply = fakeServer(message);
    setServerLog(reply);
  }

  return (
    <section>
      <div className="lesson-grid">
        <article className="card client-card">
          <h2>Client — the browser / React</h2>
          <p>This is you: the UI the user sees and clicks.</p>
          <button type="button" onClick={sendFromClient}>
            Send a request to the server
          </button>
          <p className="log">{clientLog}</p>
        </article>

        <article className="card server-card">
          <h2>Server — simulation only</h2>
          <p>
            This is not a real backend. A JavaScript function in the same app
            is only pretending to be the server.
          </p>
          <p className="log">{serverLog}</p>
        </article>
      </div>

      <p className="note">
        Later we will replace fakeServer with a real fetch call to a backend.
        The idea stays the same: the Client asks, the Server replies.
      </p>
    </section>
  );
}
