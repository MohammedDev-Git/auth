import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { callRefreshToken } from "../../../api/callRefreshToken";

export type User = {
    id: string;
    username: string;
    email: string;
}

export type AuthContextType = {
    token: string | null;
    isAuthenticated: boolean;
    login: (newToken: string, data: User) => void;
    logout: () => void;
    userData: User | null;
    updateAccessToken: (newToken: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [token, setToken] = useState<string | null>(null);

    const [userData, setUserData] = useState<User | null>(null);

    const [isLoadingRefresh, setIsLoadingRefresh] = useState(true);

    useEffect(() => {

        const restoreSession = async () => {
            try {
                const { accessToken, user } = await callRefreshToken();

                login(accessToken, user)

            } catch (err) {
                logout();
            } finally {
                setIsLoadingRefresh(false);
            }
        }

        restoreSession();

    }, [])

    const login = (newToken: string, data: User) => {
        setToken(newToken);
        setUserData(data)
    };

    const updateAccessToken = (newToken: string) => {
        setToken(newToken);
    }

    const logout = () => {
        setToken(null);
        setUserData(null);
    };

    if (isLoadingRefresh) {
        return (
            <div>
                loading...
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{
            token,
            isAuthenticated: !!token,
            login,
            logout,
            userData,
            updateAccessToken
        }}>{children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("auth is not found");
    }

    return context;
}

export default AuthProvider