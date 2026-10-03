import { apiClient } from "../apiClient";

type LoginData = { email: string, password: string };
type RegisterData = { username: string, email: string, password: string };

export const authService = {
    signIn: <T>(formData: LoginData) => apiClient<T>("/login", { method: "POST", body: formData }),
    signUp: <T>(formData: RegisterData) => apiClient<T>("/register", { method: "POST", body: formData }),
    signOut: (token: string) => apiClient("/logout", { credentials: "include", method: "POST", token: token }),
}