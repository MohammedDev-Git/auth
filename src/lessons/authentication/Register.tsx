import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthProvider";
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

export const Register = () => {
    const { login, token } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {

            const data: ApiResponse = await authService.signUp({ username, email, password });
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
            <h2>Create an Account</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "4px" }}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: "block", marginBottom: "4px" }}>Email:</label>
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
                    {loading ? "Registering..." : "Sign Up"}
                </button>
            </form>
            <p style={{ marginTop: "16px", textAlign: "center" }}>
                Already have an account? <Link to="/login">Log in here</Link>
            </p>
            <button type="button" onClick={() => navigate("/")}>join as guest</button>
        </div>
    );
};