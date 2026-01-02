import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-4">
          <Link to="/admin" className="hover:bg-blue-600 p-2 rounded">
            Dashboard
          </Link>
          <Link to="/admin/etudiants" className="hover:bg-blue-600 p-2 rounded">
            Étudiants
          </Link>
          <Link to="/admin/classes" className="hover:bg-blue-600 p-2 rounded">
            Classes
          </Link>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
