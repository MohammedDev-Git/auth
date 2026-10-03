import { useEffect, useState } from "react";

export default function Lesson11AbortController() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!query) return;

        // 1. Instantiate the controller
        const controller = new AbortController();

        const fetchSearch = async () => {
            setIsLoading(true);
            try {
                // 2. Attach signal to fetch call
                const response = await fetch(`http://localhost:3000/tasks?q=${query}`, {
                    signal: controller.signal,
                });
                const data = await response.json();
                setResults(data);
            } catch (err) {
                // 3. Ignore intentional cancellation errors
                if (err instanceof Error && err.name === "AbortError") {
                    console.log("Fetch aborted cleanly");
                    return;
                }
                console.error("Fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearch();

        // 4. Clean up: cancel pending request when query changes or component unmounts
        return () => {
            controller.abort();
        };
    }, [query]);

    return (
        <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search..."
        />
    );
}