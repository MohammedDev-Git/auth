// Lesson08_2.tsx
export default function Lesson08_2() {
    // 1. Create empty params instance
    const params = new URLSearchParams();
    
    // 2. Add and set params
    params.set("page", "1");
    params.append("tag", "react");
    params.append("tag", "vite"); // append allows duplicate keys

    return (
        <div style={{ padding: "1rem" }}>
            <h3>Lesson 08.2: Standalone `URLSearchParams`</h3>
            <p><strong>Generated String:</strong> {params.toString()}</p>
            <p><strong>Has "page"?</strong> {params.has("page") ? "Yes" : "No"}</p>
            <p><strong>Get "page":</strong> {params.get("page")}</p>
        </div>
    );
}