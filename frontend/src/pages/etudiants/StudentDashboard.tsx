import { 
  Calendar, 
  TrendingUp, 
  Clock,
  Users,
  BarChart3,
  ChevronRight,
  BookOpen,
  Bell,
  Award,
  FileText,
  CheckCircle2,
  Target,
  Download,
  MoreVertical,
  Eye,
  ArrowUpRight,
  BookMarked,
  GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { getStudentName } from "../../services/token.service";

const StudentDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("semaine");
  
  // Statistiques principales
  const statsCards = [
    {
      title: "Moyenne Générale",
      value: "14.8",
      unit: "/20",
      trend: "+0.4",
      icon: TrendingUp,
      color: "var(--color-primary)",
      bgColor: "rgba(96, 6, 34, 0.08)"
    },
    {
      title: "Taux de Présence",
      value: "94",
      unit: "%",
      trend: "+2%",
      icon: Users,
      color: "var(--color-secondary)",
      bgColor: "rgba(42, 92, 138, 0.08)"
    },
    {
      title: "Cours Aujourd'hui",
      value: "3",
      subValue: "Prochain: 09:00",
      icon: Calendar,
      color: "var(--color-accent)",
      bgColor: "rgba(230, 164, 0, 0.08)"
    },
    {
      title: "Progression",
      value: "85",
      unit: "%",
      icon: Target,
      color: "var(--color-primary-light)",
      bgColor: "rgba(138, 26, 58, 0.08)"
    }
  ];

  // Cours du jour
  const upcomingClasses = [
    { 
      name: "Base de données", 
      time: "09:00 - 10:30", 
      room: "A201",
      professor: "Dr. Martin",
      status: "next",
      progress: 65
    },
    { 
      name: "Algorithmique", 
      time: "11:00 - 12:30", 
      room: "B104",
      professor: "Prof. Dubois",
      status: "upcoming"
    },
    { 
      name: "Web Development", 
      time: "14:00 - 15:30", 
      room: "C305",
      professor: "Mme. Laurent",
      status: "upcoming"
    }
  ];

  // Dernières notes
  const recentGrades = [
    { 
      subject: "Base de données", 
      grade: "16/20", 
      date: "Aujourd'hui",
      trend: "up"
    },
    { 
      subject: "Algorithmique", 
      grade: "14/20", 
      date: "Hier",
      trend: "stable"
    },
    { 
      subject: "Web Development", 
      grade: "18/20", 
      date: "12 Jan",
      trend: "up"
    }
  ];

  // Notifications
  const notifications = [
    { 
      title: "Nouvelle note disponible", 
      description: "Base de données - 16/20",
      time: "Il y a 2h",
      unread: true
    },
    { 
      title: "Rappel d'examen", 
      description: "Algorithmique dans 3 jours",
      time: "Il y a 1 jour",
      unread: true
    },
    { 
      title: "Cours annulé", 
      description: "Mathématiques de demain",
      time: "Il y a 3 jours",
      unread: false
    }
  ];

  // Prochaines échéances
  const deadlines = [
    { title: "Examen Algorithmique", due: "Dans 3 jours", priority: "high" },
    { title: "Devoir Web Development", due: "Dans 5 jours", priority: "medium" },
    { title: "Projet Base de données", due: "Dans 2 semaines", priority: "low" }
  ];

  return (
    <div className="space-y-8">
      {/* Header avec statistiques */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-xl border border-[var(--color-neutral-300)] p-1">
            {["semaine", "mois", "semestre"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  selectedPeriod === period
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          
          <button className="p-2.5 rounded-xl border border-[var(--color-neutral-300)] bg-white hover:bg-[var(--color-neutral-100)] transition-colors">
            <MoreVertical className="w-5 h-5 text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-[var(--color-neutral-200)] p-6 hover:shadow-[var(--shadow-md)] transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="p-2.5 rounded-xl"
                style={{ 
                  backgroundColor: stat.bgColor,
                  color: stat.color
                }}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.trend && (
                <span className="text-sm font-medium px-2 py-1 rounded-lg bg-[var(--color-success-light)] text-[var(--color-success)]">
                  {stat.trend}
                </span>
              )}
            </div>
            
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-[var(--color-text-main)]">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-[var(--color-text-light)]">{stat.unit}</span>
                )}
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">{stat.title}</p>
              {stat.subValue && (
                <p className="text-xs text-[var(--color-text-light)] mt-1">{stat.subValue}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contenu principal en 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Planning et Prochaines échéances */}
        <div className="lg:col-span-2 space-y-6">
          {/* Planning du jour */}
          <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[rgba(96,6,34,0.08)] text-[var(--color-primary)]">
                  <Calendar className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                  Planning du jour
                </h2>
              </div>
            </div>
            
            <div className="space-y-3">
              {upcomingClasses.map((cls, index) => (
                <motion.div
                  key={cls.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    cls.status === "next"
                      ? "border-[var(--color-primary)]/20 bg-[var(--color-bg-alt)]"
                      : "border-[var(--color-neutral-200)]"
                  } hover:shadow-sm transition-all`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full ${
                          cls.status === "next" 
                            ? "bg-[var(--color-primary)] animate-pulse" 
                            : "bg-[var(--color-neutral-400)]"
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-[var(--color-text-main)]">{cls.name}</h3>
                            {cls.status === "next" && (
                              <span className="text-xs px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full">
                                En cours
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[var(--color-text-light)]">{cls.professor}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {cls.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookMarked className="w-4 h-4" />
                          Salle {cls.room}
                        </div>
                      </div>
                      
                      {cls.progress && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--color-text-muted)]">Progression</span>
                            <span className="font-medium text-[var(--color-text-main)]">{cls.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-[var(--color-neutral-200)] rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${cls.progress}%`,
                                background: "var(--gradient-primary)"
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button className="ml-4 p-2 hover:bg-[var(--color-neutral-100)] rounded-lg transition-colors">
                      <Eye className="w-5 h-5 text-[var(--color-text-muted)]" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Dernières notes */}
          <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[rgba(96,6,34,0.08)] text-[var(--color-primary)]">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                  Dernières notes
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-[var(--color-neutral-100)] rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
                <button className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors flex items-center gap-1">
                  Bulletin complet
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {recentGrades.map((grade, index) => {
                const score = parseFloat(grade.grade);
                const getGradeColor = () => {
                  if (score >= 16) return "text-[var(--color-success)]";
                  if (score >= 14) return "text-[var(--color-secondary)]";
                  if (score >= 12) return "text-[var(--color-accent)]";
                  return "text-[var(--color-danger)]";
                };

                return (
                  <motion.div
                    key={grade.subject}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-4 rounded-xl border border-[var(--color-neutral-200)] hover:border-[var(--color-primary)]/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-[var(--color-text-main)]">{grade.subject}</h3>
                        <p className="text-sm text-[var(--color-text-light)] mt-1">{grade.date}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`text-xl font-semibold ${getGradeColor()}`}>
                            {grade.grade}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-[var(--color-text-light)]">
                            {grade.trend === "up" && <TrendingUp className="w-3 h-3 text-[var(--color-success)]" />}
                            {grade.trend === "stable" && <span>→</span>}
                            <span>vs précédent</span>
                          </div>
                        </div>
                        
                        <div 
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white
                            ${score >= 16 ? "bg-[var(--color-success)]" :
                              score >= 14 ? "bg-[var(--color-secondary)]" :
                              score >= 12 ? "bg-[var(--color-accent)]" :
                              "bg-[var(--color-danger)]"
                            }`}
                        >
                          {score}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Colonne droite - Notifications et Prochaines échéances */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[rgba(96,6,34,0.08)] text-[var(--color-primary)]">
                  <Bell className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                  Notifications
                </h2>
              </div>
              <span className="text-sm font-medium px-2 py-1 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                2 nouvelles
              </span>
            </div>
            
            <div className="space-y-4">
              {notifications.map((notif, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-colors ${
                    notif.unread
                      ? "border-[var(--color-primary)]/20 bg-[var(--color-bg-alt)]"
                      : "border-[var(--color-neutral-200)]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {notif.unread && (
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-[var(--color-text-main)]">{notif.title}</h4>
                      <p className="text-sm text-[var(--color-text-light)] mt-1">{notif.description}</p>
                      <p className="text-xs text-[var(--color-text-light)] mt-2">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-2.5 rounded-lg border border-[var(--color-neutral-300)] text-[var(--color-text-main)] font-medium hover:bg-[var(--color-neutral-100)] transition-colors">
              Tout marquer comme lu
            </button>
          </div>

          {/* Prochaines échéances */}
          <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[rgba(230,164,0,0.08)] text-[var(--color-accent)]">
                  <Target className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
                  Prochaines échéances
                </h2>
              </div>
            </div>
            
            <div className="space-y-4">
              {deadlines.map((deadline, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-[var(--color-neutral-200)] hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[var(--color-text-main)]">{deadline.title}</h4>
                      <p className="text-sm text-[var(--color-text-light)] mt-1">{deadline.due}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      deadline.priority === "high"
                        ? "bg-[var(--color-danger-light)] text-[var(--color-danger)]"
                        : deadline.priority === "medium"
                        ? "bg-[var(--color-warning-light)] text-[var(--color-warning)]"
                        : "bg-[var(--color-success-light)] text-[var(--color-success)]"
                    }`}>
                      {deadline.priority === "high" ? "Urgent" : 
                       deadline.priority === "medium" ? "Important" : "Normal"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-light)] transition-colors flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" />
              Voir tous les cours
            </button>
          </div>

          {/* Performances */}
          <div className="bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6" />
              <h3 className="font-semibold">Votre performance</h3>
            </div>
            <p className="text-white/90 text-sm mb-4">
              Top 15% de votre promotion • Progression constante ce semestre
            </p>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Assiduité parfaite ce mois</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
              <GraduationCap className="w-4 h-4" />
              <span>2 mentions Très Bien</span>
            </div>
          </div>
        </div>
      </div>

      {/* Document rapide */}
      <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[rgba(96,6,34,0.08)] text-[var(--color-primary)]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-[var(--color-text-main)]">Document récent</h3>
              <p className="text-sm text-[var(--color-text-light)]">Notes de cours - Base de données</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg border border-[var(--color-neutral-300)] text-[var(--color-text-main)] font-medium hover:bg-[var(--color-neutral-100)] transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Télécharger
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;