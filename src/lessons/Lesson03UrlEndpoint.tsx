type ApiTarget = {
  url: string;
  protocol: string;
  host: string;
  endpoint: string;
};

export default function Lesson03UrlEndpoint() {
  const target: ApiTarget = {
    url: "https://api.example.com/tasks",
    protocol: "https",
    host: "api.example.com",
    endpoint: "/tasks",
  };

  function logTarget() {
    console.log("full URL", target.url);
    console.log("protocol", target.protocol);
    console.log("host (which server)", target.host);
    console.log("endpoint (which door)", target.endpoint);
  }

  return (
    <section>
      <article className="card">
        <h2>Where the request goes</h2>
        <p>
          A request is not enough. You must send it to an address. Click and
          inspect the Console.
        </p>
        <pre className="log">{target.url}</pre>
        <button type="button" onClick={logTarget}>
          Log URL parts
        </button>
      </article>
      <p className="note">
        Later, fetch(url) uses this full URL. The endpoint is the path on that
        server: /tasks, /tasks/12, /auth/login, and so on.
      </p>
    </section>
  );
}
