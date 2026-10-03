// Lesson08_3.tsx
import { useSearchParams } from "react-router-dom";

export default function Lesson08_3() {
    const [searchParams, setSearchParams] = useSearchParams();

    const theme = searchParams.get("theme") || "light";

    return (
        <div style={{ padding: "1rem" }}>
            <h3>Lesson 08.3: `useSearchParams` Hook</h3>
            <p>Current Theme in URL: <strong>{theme}</strong></p>

            <button onClick={() => setSearchParams({ theme: "dark" })}>
                Switch to Dark
            </button>
            <button onClick={() => setSearchParams({ theme: "light" })}>
                Switch to Light
            </button>
            <button onClick={() => setSearchParams({})}>
                Clear Theme
            </button>
        </div>
    );
}