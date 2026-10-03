// Lesson08_1.tsx
export default function Lesson08_1() {
    const rawUrl = "https://api.example.com/v1/users?role=admin&active=true#profile";
    const myUrl = new URL(rawUrl);
    console.log(myUrl);

    return (
        <div style={{ padding: "1rem" }}>
            <h3>Lesson 08.1: Native `new URL()`</h3>
            <p><strong>Full URL:</strong> {myUrl.href}</p>
            <p><strong>Protocol:</strong> {myUrl.protocol}</p> {/* https: */}
            <p><strong>Host:</strong> {myUrl.host}</p>         {/* api.example.com */}
            <p><strong>Pathname:</strong> {myUrl.pathname}</p>     {/* /v1/users */}
            <p><strong>Search (Query String):</strong> {myUrl.search}</p> {/* ?role=admin&active=true */}
        </div>
    );
}