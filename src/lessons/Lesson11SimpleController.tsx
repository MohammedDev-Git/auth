import { useState } from "react";

export default function Lesson11SimpleController() {
    const [status, setStatus] = useState("Idle");
    // Store the controller in state so the "Cancel" button can access it
    const [controller, setController] = useState<AbortController | null>(null);

    const startSlowRequest = async () => {
        // 1. Create a new remote control
        const newController = new AbortController();
        setController(newController);
        setStatus("Fetching data (5-second delay)...");
        console.log("current fetch controller:", newController);

        console.log("➡️ 1. Fetch started!");

        try {
            // 2. Attach the signal to the fetch
            const response = await fetch("https://httpbin.org/delay/5", {
                signal: newController.signal,
            });

            const data = await response.json();
            console.log("✅ 2. Fetch completed successfully:", data);
            setStatus("Request Succeeded!");
        } catch (err) {
            // 3. Handle the abort error
            if (err instanceof Error && err.name === "AbortError") {
                console.log("⛔ 2. Catch Block: The fetch was CANCELED by user!");
                console.log("fail controller", controller);

                setStatus("Request Canceled!");
            } else {
                console.error("❌ Fetch failed with a real error:", err);
                setStatus("Request Failed!");
            }
        } finally {
            setController(null);
        }
    };

    const cancelRequest = () => {
        if (controller) {
            console.log("🔴 'Cancel' button clicked! Calling controller.abort()...");
            // 4. Press the stop button
            controller.abort();
        }
    };

    return (
        <div className="p-6 space-y-4">
            <p className="font-bold">Status: {status}</p>

            <div className="space-x-2">
                <button
                    onClick={startSlowRequest}
                    disabled={!!controller}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                    Start 5s Fetch
                </button>

                <button
                    onClick={cancelRequest}
                    disabled={!controller}
                    className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                >
                    Cancel Request
                </button>
            </div>

            <p className="text-sm text-gray-400">
                Open your browser Developer Console (F12) to see the logs in real time.
            </p>
        </div>
    );
}