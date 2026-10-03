type RequestMessage = {
  from: "client";
  text: string;
};

type ResponseMessage = {
  from: "server";
  text: string;
};

function fakeServer(request: RequestMessage): ResponseMessage {
  return {
    from: "server",
    text: `Got it. You asked: "${request.text}"`,
  };
}

export default function Lesson02RequestResponse() {
  function sendRequest() {
    const request: RequestMessage = {
      from: "client",
      text: "something",
    };

    const response = fakeServer(request);

    console.log("request", request);
    console.log("response", response);
  }

  return (
    <section>
      <article className="card">
        <h2>One round trip</h2>
        <p>
          Click the button, then open DevTools Console. You will see a request
          object leave the client, then a response object come back.
        </p>
        <button type="button" onClick={sendRequest}>
          Send request
        </button>
      </article>
      <p className="note">
        Still no real network. We are only learning the two messages: request
        out, response back.
      </p>
    </section>
  );
}
