// Lesson08_4.tsx
import { useSearchParams } from "react-router-dom";

export default function Lesson08_4() {
    const [searchParams, setSearchParams] = useSearchParams();

    function addFilter(key: string, value: string) {
        // 1. Convert current searchParams to a fresh URLSearchParams instance to keep existing keys
        const currentParams = new URLSearchParams(searchParams);
        currentParams.set(key, value);

        // 2. Pass updated params back to React Router
        setSearchParams(currentParams);
    }

    // 3. Construct an API endpoint using native URL + searchParams
    const apiEndpoint = new URL("http://localhost:3000/api/items");
    apiEndpoint.search = searchParams.toString();

    return (
        <div style={{ padding: "1rem" }}>
            <h3>Lesson 08.4: Combined Architecture</h3>

            <button onClick={() => addFilter("category", "tech")}>Add Category=Tech</button>
            <button onClick={() => addFilter("page", "2")}>Set Page=2</button>
            <button onClick={() => setSearchParams({})}>Reset</button>

            <p><strong>Browser Query String:</strong> ?{searchParams.toString()}</p>
            <p><strong>Constructed Backend API URL:</strong> {apiEndpoint.toString()}</p>
        </div>
    );
}