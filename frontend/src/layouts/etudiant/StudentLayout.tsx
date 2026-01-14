import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  LogOut,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  BarChart,
  User,
  Settings,
  Search,
  Home,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  FileText,
  Users
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { getStudentName } from "../../services/token.service";

const StudentLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer les informations de l'étudiant
  const user = getStudentName();
  const getAvatarFromName = (fullName: string): string => {
  if (!fullName) return "";

  return fullName
    .trim()
    .split(/\s+/)          // sépare par espaces
    .map(word => word[0])  // première lettre de chaque mot
    .join("")
    .toUpperCase();
};

  const studentInfo = {
    name: user,
    avatar: getAvatarFromName(user),
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Menu simplifié
  const menuItems = [
    { label: "Tableau de bord", icon: LayoutDashboard, path: "/etudiant" },
    { label: "Matieres", icon: BookOpen, path: "/etudiant/matieres" },
    { label: "Notes", icon: BarChart, path: "/etudiant/notes" },
    { label: "Inscription", icon: FileText, path: "/etudiant/inscriptions" },
    { label: "Classe", icon: Users, path: "/etudiant/classe" },
  ];

  const activeItem = menuItems.find(item => location.pathname === item.path) || menuItems[0];

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-[var(--color-neutral-300)]"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed top-0 left-0 h-screen transition-all duration-300 z-40",
          collapsed ? "w-20" : "w-64"
        )}
        style={{ 
          background: "var(--gradient-sidebar)",
          borderRight: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        {/* Logo Section */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-white text-lg">
                    CampusHub
                  </span>
                  <span className="text-xs text-white/60">
                    Étudiant
                  </span>
                </div>
              </div>
            )}
            {collapsed && (
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* User Profile - Only visible when expanded */}
        {!collapsed && (
          <div className="px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white font-semibold text-lg">
                {studentInfo.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">
                  {studentInfo.name}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1">
            {menuItems.map(({ label, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              
              return (
                <Link
                  key={label}
                  to={path}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                    "hover:bg-white/5",
                    isActive 
                      ? "bg-white/10 text-white" 
                      : "text-white/70 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    isActive 
                      ? "bg-white text-[var(--color-primary)]" 
                      : "bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white"
                  )}>
                    <Icon size={18} />
                  </div>
                  
                  {!collapsed && (
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      isActive && "font-semibold"
                    )}>
                      {label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="px-4 py-4 border-t border-white/10 space-y-2">
          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
              {collapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </div>
            {!collapsed && (
              <span className="text-sm">
                {collapsed ? "Déplier" : "Replier"}
              </span>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
              <LogOut size={18} />
            </div>
            {!collapsed && (
              <span className="text-sm">Déconnexion</span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div 
            className="absolute left-0 top-0 h-full w-80"
            style={{ 
              background: "var(--gradient-sidebar)",
              borderRight: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">CampusHub</span>
                    <span className="text-xs text-white/60">Étudiant</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/5"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white font-semibold text-lg">
                  {studentInfo.avatar}
                </div>
                <div>
                  <h3 className="font-medium text-white">{studentInfo.name}</h3>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-1">
              {menuItems.map(({ label, icon: Icon, path }) => (
                <Link
                  key={label}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors",
                    location.pathname === path && "bg-white/10 text-white"
                  )}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={cn(
        "min-h-screen flex flex-col transition-all duration-300",
        collapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-white border-b border-[var(--color-neutral-200)]">
          <div className="px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Page title and breadcrumb */}
              <div className="flex items-center gap-3">
                <div className="lg:hidden">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-[var(--color-text-main)]">
                    {activeItem.label}
                  </h1>
                  <div className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                    <Home size={12} />
                    <span>/</span>
                    <span>Étudiant</span>
                    <span>/</span>
                    <span className="text-[var(--color-primary)] font-medium">
                      {activeItem.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="hidden md:flex items-center relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 w-48 lg:w-64 rounded-lg bg-[var(--color-neutral-100)] border border-[var(--color-neutral-300)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] text-sm"
                  />
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-[var(--color-neutral-100)] transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-white text-sm font-medium">
                      {studentInfo.avatar}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-[var(--color-text-main)] truncate max-w-[100px]">
                        {studentInfo.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">Étudiant</p>
                    </div>
                    <ChevronDown size={14} className="text-[var(--color-text-muted)] hidden md:block" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-[var(--color-neutral-200)] py-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                    <Link
                      to="/etudiant/profil"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-neutral-100)]"
                    >
                      <User size={16} />
                      <span>Mon profil</span>
                    </Link>
                    <Link
                      to="/etudiant/parametres"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-main)] hover:bg-[var(--color-neutral-100)]"
                    >
                      <Settings size={16} />
                      <span>Paramètres</span>
                    </Link>
                    <div className="border-t border-[var(--color-neutral-200)] mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] w-full"
                      >
                        <LogOut size={16} />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Banner (simplified) */}
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-light)]/5 border border-[var(--color-primary)]/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                    Bonjour, {studentInfo.name}
                  </h2>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Bienvenue dans votre espace étudiant
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-lg border border-[var(--color-neutral-200)]">
              <Outlet />
            </div>

            {/* Minimal Footer */}
            <footer className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
              <div className="flex items-center justify-center gap-4 mb-1">
                <Link to="/aide" className="hover:text-[var(--color-primary)]">
                  Aide
                </Link>
                <Link to="/contact" className="hover:text-[var(--color-primary)]">
                  Contact
                </Link>
              </div>
              <p>© {new Date().getFullYear()} CampusHub • v2.0</p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;