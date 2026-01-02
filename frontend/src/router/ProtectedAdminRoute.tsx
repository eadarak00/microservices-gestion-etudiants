import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/token.service";
import type { JSX } from "react";

interface Props {
    children: JSX.Element;
}

const ProtectedAdminRoute = ({ children }: Props) => {
    if (!isAuthenticated()) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
