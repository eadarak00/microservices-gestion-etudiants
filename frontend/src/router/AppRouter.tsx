import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/admin/AdminLayout";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Etudiants from "../pages/admin/Etudiants";
import Classes from "../pages/admin/Classes";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import Matieres from "../pages/admin/Matieres";
import ClasseDetail from "../pages/admin/ClasseDetails";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login Admin (sans layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Routes Admin avec layout */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="etudiants" element={<Etudiants />} />
          <Route path="classes" element={<Classes />} />
          <Route path="matieres" element={<Matieres />} />
          <Route path="/admin/classes/:id" element={<ClasseDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
