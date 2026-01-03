import {
  Users, UserPlus, GraduationCap, BookOpen, Briefcase,
  ArrowRight, Plus, Activity, Calendar,
  Eye, Clock, CheckCircle, BarChart3
} from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    label: "Étudiants",
    value: 1240,
    icon: Users,
    path: "/admin/etudiants",
    color: "from-[#600622] to-[#8A1A3A]",
    gradient: "var(--gradient-primary)"
  },
  {
    label: "Inscriptions",
    value: 320,
    icon: UserPlus,
    path: "/admin/inscriptions",
    color: "from-[#E6A400] to-[#FFC439]",
    gradient: "var(--gradient-accent)"
  },
  {
    label: "Classes",
    value: 24,
    icon: GraduationCap,
    path: "/admin/classes",
    color: "from-[#2A5C8A] to-[#3A7AB8]",
    gradient: "linear-gradient(135deg, #2A5C8A 0%, #3A7AB8 100%)"
  },
  {
    label: "Matières",
    value: 45,
    icon: BookOpen,
    path: "/admin/matieres",
    color: "from-[#4A051A] to-[#600622]",
    gradient: "linear-gradient(135deg, #4A051A 0%, #600622 100%)"
  },
  {
    label: "Enseignants",
    value: 68,
    icon: Briefcase,
    path: "/admin/enseignants",
    color: "from-[#FFC439] to-[#E6A400]",
    gradient: "linear-gradient(135deg, #FFC439 0%, #E6A400 100%)"
  },
];

const recentInscriptions = [
  {
    id: 1,
    student: "Mamadou Diop",
    class: "Informatique 1",
    date: "Aujourd'hui, 10:30",
    status: "active",
    initials: "MD",
    avatarColor: "bg-[#600622]/10 text-[#600622]"
  },
  {
    id: 2,
    student: "Aminata Fall",
    class: "Mathématiques 2",
    date: "Aujourd'hui, 14:15",
    status: "active",
    initials: "AF",
    avatarColor: "bg-[#8A1A3A]/10 text-[#8A1A3A]"
  },
  {
    id: 3,
    student: "Ousmane Kane",
    class: "Physique 1",
    date: "Hier, 16:45",
    status: "active",
    initials: "OK",
    avatarColor: "bg-[#2A5C8A]/10 text-[#2A5C8A]"
  },
  {
    id: 4,
    student: "Fatou Ndiaye",
    class: "Chimie 3",
    date: "Hier, 11:20",
    status: "pending",
    initials: "FN",
    avatarColor: "bg-[#E6A400]/10 text-[#E6A400]"
  },
  {
    id: 5,
    student: "Cheikh Ba",
    class: "Informatique 2",
    date: "15 Mars, 09:00",
    status: "active",
    initials: "CB",
    avatarColor: "bg-[#3A0B22]/10 text-[#3A0B22]"
  },
];

const quickActions = [
  {
    label: "Ajouter un étudiant",
    icon: Plus,
    path: "/admin/etudiants/nouveau",
    color: "bg-gradient-to-r from-[#600622] to-[#8A1A3A]",
    description: "Créer un nouveau profil"
  },
  {
    label: "Nouvelle inscription",
    icon: UserPlus,
    path: "/admin/inscriptions/nouvelle",
    color: "bg-gradient-to-r from-[#E6A400] to-[#FFC439]",
    description: "Inscrire à une classe"
  },
  {
    label: "Créer une classe",
    icon: GraduationCap,
    path: "/admin/classes/nouvelle",
    color: "bg-gradient-to-r from-[#2A5C8A] to-[#3A7AB8]",
    description: "Ajouter une nouvelle classe"
  },
];

const upcomingEvents = [
  {
    title: "Réunion des enseignants",
    time: "10:00",
    date: "Aujourd'hui",
    type: "meeting",
    color: "bg-[#600622]/10 text-[#600622] border-[#600622]/20"
  },
  {
    title: "Examen de Mathématiques",
    time: "14:00",
    date: "Demain",
    type: "exam",
    color: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
  },
  {
    title: "Conférence orientation",
    time: "11:00",
    date: "15 Mars",
    type: "event",
    color: "bg-[#E6A400]/10 text-[#E6A400] border-[#E6A400]/20"
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Gestionnaire d'événements pour la navigation au clavier
  const handleKeyDown = (e: KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  };

  // Gestionnaire d'événements pour les lignes de tableau
  const handleRowKeyDown = (e: KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-4 sm:p-6 lg:p-8 font-['Poppins']">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-1 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-main)]">
              Dashboard Administrateur
            </h1>
            <p className="text-[var(--color-text-light)] text-sm mt-1">
              Vue d'ensemble de votre établissement scolaire
            </p>
          </div>
        </div>

        {/* Stats Header */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
            <Calendar size={16} />
            <span>Statistiques mises à jour aujourd'hui</span>
          </div>
          <button
            onClick={() => navigate("/admin/rapports")}
            onKeyDown={(e) => handleKeyDown(e, "/admin/rapports")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-neutral-50)] hover:bg-[var(--color-neutral-100)] text-[var(--color-text-main)] text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2"
          >
            <BarChart3 size={16} />
            Voir rapports
          </button>
        </div>
      </div>

      {/* Stats Cards - Correction: Utiliser des éléments interactifs natifs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, path, gradient }, index) => (
          <button
            key={label}
            type="button"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate(path)}
            onKeyDown={(e) => handleKeyDown(e, path)}
            aria-label={`Voir les détails pour ${label}`}
            className={`group relative overflow-hidden rounded-2xl bg-white border border-[var(--color-neutral-200)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 hover-lift focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 text-left ${hoveredCard === index ? 'transform scale-[1.02]' : ''
              }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient Bar */}
            <div
              className="h-1.5 w-full"
              style={{ background: gradient }}
            ></div>

            {/* Card Content */}
            <div className="relative p-5">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-[var(--color-neutral-50)] border border-[var(--color-neutral-200)] flex items-center justify-center mb-4 transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: gradient }}
                >
                  <Icon className="text-white" size={20} />
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-1 mb-3">
                <p className="text-[var(--color-text-muted)] text-sm font-medium">
                  {label}
                </p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-[var(--color-text-main)]">
                    {value}
                  </p>
                </div>
              </div>

              {/* Arrow Indicator */}
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] text-sm font-medium flex items-center gap-1 transition-colors duration-200">
                  Voir détails
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="text-xs text-[var(--color-text-light)] flex items-center gap-1">
                  <Clock size={12} />
                  <span>ce mois</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 p-6 h-full">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="text-[var(--color-primary)]" size={22} />
              <h2 className="text-xl font-semibold text-[var(--color-text-main)]">Actions rapides</h2>
            </div>

            <div className="space-y-3">
              {quickActions.map(({ label, icon: Icon, path, color, description }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => navigate(path)}
                  onKeyDown={(e) => handleKeyDown(e, path)}
                  className={`w-full group relative overflow-hidden flex items-center gap-3 px-4 py-4 rounded-xl ${color} text-white font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2`}
                >
                  <div className="relative z-10 flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-sm font-semibold block">{label}</span>
                      <span className="text-xs text-white/80 block mt-0.5">{description}</span>
                    </div>
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
              ))}
            </div>

            {/* Calendar Section */}
            <div className="mt-8 pt-6 border-t border-[var(--color-neutral-200)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--color-text-main)]">Événements à venir</h3>
                <Calendar size={16} className="text-[var(--color-text-light)]" />
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/admin/calendrier")}
                    onKeyDown={(e) => handleKeyDown(e, "/admin/calendrier")}
                    aria-label={`Voir l'événement: ${event.title}`}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm transition-all duration-200 cursor-pointer hover:border-[var(--color-primary)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-1"
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--color-text-main)]">{event.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-[var(--color-text-light)]" />
                        <span className="text-xs text-[var(--color-text-light)]">{event.time} • {event.date}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${event.color}`}>
                      {event.type === "meeting" ? "Réunion" : event.type === "exam" ? "Examen" : "Événement"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Inscriptions */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 overflow-hidden h-full">
            <div className="p-6 border-b border-[var(--color-neutral-200)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="text-[var(--color-primary)]" size={22} />
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--color-text-main)]">Inscriptions récentes</h2>
                    <p className="text-sm text-[var(--color-text-light)] mt-0.5">5 nouvelles inscriptions ce mois</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/admin/inscriptions")}
                  onKeyDown={(e) => handleKeyDown(e, "/admin/inscriptions")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2"
                >
                  <Eye size={16} />
                  Voir tout
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <caption className="sr-only">Liste des inscriptions récentes</caption>
                <thead>
                  <tr className="bg-[var(--color-bg-alt)]">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Étudiant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Classe
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Date d'inscription
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-neutral-200)]">
                  {recentInscriptions.map((insc) => (
                    <tr
                      key={insc.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/admin/etudiants/${insc.id}`)}
                      onKeyDown={(e) => handleRowKeyDown(e, `/admin/etudiants/${insc.id}`)}
                      aria-label={`Voir le profil de ${insc.student}`}
                      className="group hover:bg-[var(--color-bg-alt)] transition-all duration-200 cursor-pointer focus:outline-none focus:bg-[var(--color-bg-alt)]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${insc.avatarColor} flex items-center justify-center font-semibold text-sm shadow-sm`}>
                            {insc.initials}
                          </div>
                          <div>
                            <span className="font-medium text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors duration-200 block">
                              {insc.student}
                            </span>
                            <span className="text-xs text-[var(--color-text-light)] mt-0.5 flex items-center gap-1">
                              <CheckCircle size={10} className={insc.status === 'active' ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'} />
                              {insc.status === 'active' ? 'Profil complet' : 'En attente'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-neutral-50)] text-[var(--color-text-main)] text-sm font-medium">
                          {insc.class}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="text-sm text-[var(--color-text-main)] block">
                            {insc.date}
                          </span>
                          <span className="text-xs text-[var(--color-text-light)] flex items-center gap-1">
                            <Clock size={10} />
                            Dernière mise à jour
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${insc.status === 'active'
                          ? 'bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)]/20'
                          : 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border border-[var(--color-warning)]/20'
                          }`}>
                          <div className={`w-2 h-2 rounded-full ${insc.status === 'active' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-warning)]'
                            }`}></div>
                          {insc.status === 'active' ? 'Actif' : 'En attente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-[var(--color-text-light)]">
                  <Activity size={14} />
                  <span>5 inscriptions totales</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-success)]"></div>
                    <span className="text-xs text-[var(--color-text-light)]">4 actifs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-warning)]"></div>
                    <span className="text-xs text-[var(--color-text-light)]">1 en attente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-[var(--color-secondary)]/5 to-[var(--color-primary-light)]/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
    </div>
  );
};

export default AdminDashboard;