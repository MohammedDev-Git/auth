import { useState, type SubmitEvent } from "react";
import { useAuth } from "./contexts/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { authService } from "../../api/services/authServise";

type ApiResponse = {
    "accessToken": string,
    "user": {
        "id": string
        "username": string,
        "email": string,
    },
    "message": string
}

export const Login = () => {

    const { login, token } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {

            const data: ApiResponse = await authService.signIn({ email, password });

            login(data.accessToken, data.user);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };


    if (token) {
        return <Navigate to={"/dashboard"} replace />
    }

    return (
        <div style={{ maxWidth: "400px", margin: "40px auto", fontFamily: "sans-serif" }}>
            <h2>Login (State-Only Auth)</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "4px" }}>email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: "block", marginBottom: "4px" }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        required
                    />
                </div>

                {error && <p style={{ color: "red", margin: "0" }}>{error}</p>}

                <button type="submit" disabled={loading} style={{ padding: "10px" }}>
                    {loading ? "Logging in..." : "Login"}
                </button>
                <button type="button" onClick={()=>navigate("/register")} style={{ padding: "10px" }}>
                    register
                </button>

            </form>
            <button type="button" onClick={() => navigate("/")}>join as guest</button>

        </div>
    );
};