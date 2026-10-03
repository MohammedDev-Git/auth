import {
    createBrowserRouter,
} from "react-router-dom";

import AuthApp from "./lessons/authentication/AuthApp";
import Dashboard from "./lessons/authentication/Dashboard";
import { Login } from "./lessons/authentication/Login";
import { Register } from "./lessons/authentication/Register";
import ProtectedRoute from "./lessons/authentication/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: AuthApp,
    },
    {
        path: "/login",
        Component: Login,
    },
    {
        path: "/register",
        Component: Register,
    },
    {
        path: "/dashboard",
        Component: ProtectedRoute,
        children: [
            {
                index: true,
                Component: Dashboard
            }
        ]
    }
]);