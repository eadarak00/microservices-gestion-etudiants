import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  UserCog,
  User,
  ChevronRight,
  Award,
  CheckCircle,
  Zap,
  Users,
  Cpu,
  Globe,
  Lock,
  Star
} from "lucide-react";

const roles = [
  {
    icon: UserCog,
    title: "Administration",
    desc: "Gestion complète du système, configuration avancée et supervision globale",
    features: [
      "Tableau de bord analytique en temps réel",
      "Gestion des utilisateurs et des permissions",
      "Configuration système avancée",
      "Rapports détaillés et export PDF"
    ],
    color: "var(--color-primary)",
    gradient: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)",
    stats: "Gestion complète"
  },
  {
    icon: GraduationCap,
    title: "Enseignants",
    desc: "Outils pédagogiques avancés pour un suivi optimal des étudiants",
    features: [
      "Saisie et correction des notes automatisée",
      "Gestion des absences intelligente",
      "Planification des cours dynamique",
      "Communication avec les étudiants"
    ],
    color: "var(--color-secondary)",
    gradient: "linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%)",
    stats: "Suivi personnalisé"
  },
  {
    icon: User,
    title: "Étudiants",
    desc: "Interface intuitive pour le suivi académique et les résultats",
    features: [
      "Consultation des notes en temps réel",
      "Emploi du temps interactif",
      "Ressources pédagogiques numériques",
      "Suivi de progression détaillé"
    ],
    color: "var(--color-accent)",
    gradient: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%)",
    stats: "Accès 24/7"
  },
];

const RolesSection = () => {
  const [activeRole, setActiveRole] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Effet de parallaxe pour l'arrière-plan
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        const cards = document.querySelectorAll('.role-card');
        cards.forEach((card: Element) => {
          (card as HTMLElement).style.transform = `perspective(1000px) rotateX(${y * 5}deg) rotateY(${x * 5}deg)`;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-[var(--color-bg-main)] via-white to-[var(--color-bg-alt)]">
      {/* Arrière-plan sophistiqué */}
      <div className="absolute inset-0">
        {/* Dégradé de fond */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5" />

        {/* Orbes flottantes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              background: i % 3 === 0
                ? `radial-gradient(circle, var(--color-primary-light)/20 0%, transparent 70%)`
                : i % 3 === 1
                  ? `radial-gradient(circle, var(--color-secondary)/20 0%, transparent 70%)`
                  : `radial-gradient(circle, var(--color-accent)/20 0%, transparent 70%)`,
              left: `${i * 15}%`,
              top: `${10 + (i * 12)}%`,
            }}
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Grille subtile */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 98%, var(--color-primary)/10 100%),
                linear-gradient(0deg, transparent 98%, var(--color-primary)/10 100%)
              `,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Lignes de connexion */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M 10% 50 Q 30% 30, 50% 50 T 90% 50"
            stroke="url(#gradient-line)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <defs>
            <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="50%" stopColor="var(--color-accent)" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto">
        {/* En-tête premium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          {/* Badge d'élite */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 border border-[var(--color-primary)]/20 mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-[var(--color-accent)]" />
              <span className="text-sm font-medium text-[var(--color-primary)]">
                Architecture Multi-Rôles
              </span>
              <Star size={14} className="text-[var(--color-accent)]" />
            </div>
          </div>

          {/* Titre principal */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-[var(--color-neutral-900)]">Une Expérience</span>
            <br />
            <span className="text-gradient-premium bg-clip-text text-transparent">
              Adaptée à Chaque Rôle
            </span>
          </h2>

          {/* Sous-titre */}
          <p className="text-xl text-[var(--color-text-muted)] max-w-3xl mx-auto leading-relaxed">
            Une plateforme intelligente qui s'adapte parfaitement à chaque utilisateur,
            offrant des outils spécialisés pour maximiser la productivité.
          </p>
        </motion.div>

        {/* Conteneur principal des rôles */}
        <div className="relative">
          {/* Indicateur de navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex gap-2 p-2 rounded-2xl bg-white/80 backdrop-blur-sm border border-[var(--color-neutral-200)] shadow-lg">
              {roles.map((role, index) => (
                <button
                  key={index}
                  onClick={() => setActiveRole(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeRole === index
                    ? 'text-white'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                    }`}
                  style={{
                    background: activeRole === index ? roles[index].gradient : 'transparent',
                  }}
                >
                  {role.title}
                  {hoveredIndex === index && activeRole !== index && (
                    <motion.div
                      layoutId="hover-bg"
                      className="absolute inset-0 rounded-xl bg-[var(--color-primary)]/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Grille de rôles avec détails */}
          <div className="grid lg:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                className="role-card relative group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Effet de lueur au survol */}
                <div
                  className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                  style={{ background: role.gradient }}
                />

                {/* Carte principale */}
                <div className="relative h-full p-8 rounded-3xl bg-gradient-to-b from-white to-[var(--color-neutral-50)] border border-[var(--color-neutral-200)] shadow-xl group-hover:shadow-2xl transition-all duration-500 overflow-hidden">

                  {/* Effet de verre au survol */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Badge de rôle */}
                  <div className="absolute top-1 right-6 px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg"
                    style={{ background: role.gradient }}
                  >
                    {role.stats}
                  </div>

                  {/* Contenu supérieur */}
                  <div className="relative mb-8">
                    {/* Icône avec halo */}
                    <div className="relative w-20 h-20 rounded-2xl mb-6 flex items-center justify-center">
                      <div
                        className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                        style={{ background: role.gradient }}
                      />

                      <div className="relative p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-[var(--color-neutral-100)] shadow-sm">
                        <role.icon
                          size={32}
                          className="relative z-10"
                          style={{ color: role.color }}
                        />
                      </div>

                      {/* Particules orbitantes */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full"
                          style={{ backgroundColor: role.color }}
                          animate={{
                            x: [0, Math.cos(i * 120) * 24, 0],
                            y: [0, Math.sin(i * 120) * 24, 0],
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5,
                          }}
                        />
                      ))}
                    </div>

                    {/* Titre et description */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-[var(--color-neutral-900)] group-hover:text-[var(--color-primary)] transition-colors duration-300">
                        {role.title}
                      </h3>

                      <p className="text-[var(--color-text-muted)] leading-relaxed">
                        {role.desc}
                      </p>
                    </div>
                  </div>

                  {/* Liste des fonctionnalités */}
                  <div className="space-y-3 mb-8">
                    {role.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <CheckCircle
                          size={18}
                          className="mt-0.5 flex-shrink-0"
                          style={{ color: role.color }}
                        />
                        <span className="text-sm text-[var(--color-text-muted)]">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bouton d'action */}
                  <div className="relative">
                    <motion.button
                      className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 group/btn"
                      style={{ background: role.gradient }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Accéder à {role.title}</span>
                      <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>

                    {/* Effet de brillance sur le bouton */}
                    <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Effets décoratifs */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ background: role.gradient }}
                  />

                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ background: role.gradient }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Statistiques globales */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Users, value: "10K+", label: "Utilisateurs actifs", color: "var(--color-primary)" },
                { icon: Cpu, value: "99.9%", label: "Disponibilité", color: "var(--color-success)" },
                { icon: Globe, value: "24/7", label: "Accessibilité", color: "var(--color-secondary)" },
                { icon: Lock, value: "100%", label: "Sécurisé", color: "var(--color-accent)" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-[var(--color-neutral-200)] shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="p-3 rounded-full mb-3"
                      style={{
                        background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}30)`,
                        border: `1px solid ${stat.color}20`
                      }}
                    >
                      <stat.icon size={24} style={{ color: stat.color }} />
                    </div>
                    <div className="text-3xl font-bold text-[var(--color-neutral-900)] mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-[var(--color-text-muted)]">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 border border-[var(--color-primary)]/20 backdrop-blur-sm group hover:shadow-xl transition-all duration-300">
            <Zap className="text-[var(--color-accent)]" size={24} />
            <div className="text-left">
              <div className="text-lg font-semibold text-[var(--color-neutral-800)]">
                Prêt à transformer votre institution ?
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">
                Rejoignez les établissements qui ont déjà adopté notre solution
              </div>
            </div>
            <ChevronRight className="ml-4 text-[var(--color-primary)] group-hover:translate-x-2 transition-transform" size={20} />
          </div>
        </motion.div>
      </div>

      {/* Styles CSS */}
      <style>{`
        @keyframes gradient-premium {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .text-gradient-premium {
          background: linear-gradient(
            90deg,
            var(--color-primary),
            var(--color-primary-light),
            var(--color-accent),
            var(--color-primary)
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: gradient-premium 6s ease infinite;
        }
        
        .role-card {
          transform-style: preserve-3d;
          transition: transform 0.3s ease-out;
        }
        
        /* Effet de parallaxe amélioré */
        .parallax-layer {
          transition: transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* Effet de verre premium */
        .glass-premium {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        /* Effet de lévitation */
        @keyframes levitate {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-levitate {
          animation: levitate 6s ease-in-out infinite;
        }
        
        .animate-levitate-delay {
          animation: levitate 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default RolesSection;