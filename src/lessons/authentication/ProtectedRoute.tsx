import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthProvider";

const ProtectedRoute = () => {
    const { isAuthenticated, userData } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to={"/login"} replace />
    }

    return (
        <Outlet context={userData} />
    )
}

export default ProtectedRoute