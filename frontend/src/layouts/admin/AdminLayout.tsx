import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  UserPlus,
  GraduationCap,
  BookOpen,
  Briefcase,
  LogOut,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Étudiants", icon: Users, path: "/admin/etudiants" },
    { label: "Inscriptions", icon: UserPlus, path: "/admin/inscriptions" },
    { label: "Classes", icon: GraduationCap, path: "/admin/classes" },
    { label: "Matières", icon: BookOpen, path: "/admin/matieres" },
    { label: "Enseignants", icon: Briefcase, path: "/admin/enseignants" },
  ];

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col transition-all duration-300 ease-in-out shadow-sidebar",
          collapsed ? "w-20" : "w-64"
        )}
        style={{ background: "var(--gradient-sidebar)" }}
      >
        {/* Logo/Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/20">
          {!collapsed && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white"
                style={{ background: "var(--gradient-accent)" }}
              >
                A
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">
                Admin Panel
              </span>
            </div>
          )}
          {collapsed && (
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white mx-auto"
              style={{ background: "var(--gradient-accent)" }}
            >
              A
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute top-20 -right-3 w-6 h-6 rounded-full bg-white border border-border",
            "flex items-center justify-center text-gray-700",
            "hover:bg-gray-100 hover:text-foreground transition-all duration-200",
            "shadow-card hover:shadow-card-hover"
          )}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-6">
          <span
            className={cn(
              "text-xs font-medium text-white/70 uppercase tracking-wider mb-3",
              collapsed ? "text-center" : "px-3"
            )}
          >
            {collapsed ? "•••" : "Menu"}
          </span>

          {menuItems.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;

            return (
              <Link
                key={label}
                to={path}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "hover:bg-white/10 hover:text-white",
                  isActive
                    ? "bg-white/20 text-white shadow-md"
                    : "text-white/70",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-white/80 group-hover:text-white"
                  )}
                />
                {!collapsed && (
                  <span
                    className={cn(
                      "text-sm font-medium animate-fade-in transition-colors",
                      isActive
                        ? "text-white font-semibold"
                        : "group-hover:text-white"
                    )}
                  >
                    {label}
                  </span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-scale-in shadow-sm" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 py-4 border-t border-white/20 space-y-1">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              "text-white/70 hover:text-white hover:bg-white/10 group",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut
              size={20}
              className="shrink-0 text-white/80 group-hover:text-white transition-colors"
            />
            {!collapsed && (
              <span className="text-sm font-medium group-hover:text-white transition-colors">
                Déconnexion
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header
          className="h-16 flex items-center justify-between px-8"
          style={{
            background: "rgba(245, 246, 248, 0.6)", // var(--color-bg-main) + transparence
            backdropFilter: "blur(10px)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Left: Page Title */}
          <div className="flex items-center gap-4">
            <h1
              className="text-xl font-semibold"
              style={{
                color: "var(--color-text-main)",
                fontFamily: "var(--font-primary)",
              }}
            >
              {menuItems.find((item) => location.pathname.startsWith(item.path))
                ?.label || "Dashboard"}
            </h1>

            {/* Optional: Breadcrumb */}
            <div className="text-sm text-neutral-600">
              Admin /{" "}
              <span style={{ color: "var(--color-primary)" }}>
                {menuItems.find((item) =>
                  location.pathname.startsWith(item.path)
                )?.label || "Dashboard"}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm"
              style={{
                background: "var(--gradient-accent)",
                color: "var(--color-text-on-primary)",
              }}
            >
              U
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;