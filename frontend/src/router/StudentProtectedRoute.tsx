import { Navigate } from "react-router-dom";
import {isStudentAuthenticated } from "../services/token.service";
import type { JSX } from "react";

interface Props {
    children: JSX.Element;
}

const StudentProtectedRoute = ({ children }: Props) => {
    if (!isStudentAuthenticated()) {
        return <Navigate to="/etudiant/login" replace />;
    }

    return children;
};

export default StudentProtectedRoute;
