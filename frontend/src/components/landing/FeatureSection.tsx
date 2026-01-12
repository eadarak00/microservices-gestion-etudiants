import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Shield,
  TrendingUp,
  BookCheck,
  UserCheck,
  Sparkles,
  ChevronRight
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestion des étudiants",
    desc: "Inscriptions, profils, suivi académique complet avec historique détaillé.",
    color: "var(--color-primary)",
    gradient: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)",
    stats: "100% automatisé"
  },
  {
    icon: BookOpen,
    title: "Classes & Matières",
    desc: "Organisation pédagogique complète avec emplois du temps dynamiques.",
    color: "var(--color-secondary)",
    gradient: "linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%)",
    stats: "+50% d'efficacité"
  },
  {
    icon: BarChart3,
    title: "Analytique Avancée",
    desc: "Suivi des performances par classe avec prédictions intelligentes.",
    color: "var(--color-accent)",
    gradient: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%)",
    stats: "Données en temps réel"
  },
  {
    icon: Shield,
    title: "Sécurité Maximale",
    desc: "Accès par rôles, authentification JWT et chiffrement AES-256.",
    color: "var(--color-success)",
    gradient: "linear-gradient(135deg, var(--color-success) 0%, #34D399 100%)",
    stats: "Niveau militaire"
  },
  {
    icon: UserCheck,
    title: "Suivi Personnalisé",
    desc: "Accompagnement individualisé pour chaque étudiant.",
    color: "var(--color-primary-light)",
    gradient: "linear-gradient(135deg, var(--color-primary-light) 0%, #A8325D 100%)",
    stats: "100% personnalisé"
  },
  {
    icon: BookCheck,
    title: "Évaluations",
    desc: "Système d'évaluation complet avec corrections automatisées.",
    color: "var(--color-secondary-light)",
    gradient: "linear-gradient(135deg, var(--color-secondary-light) 0%, #5A9BD4 100%)",
    stats: "Corrections instantanées"
  },
];

const FeaturesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  
  const rotateX = useTransform(springY, [0, window.innerHeight], [15, -15]);
  const rotateY = useTransform(springX, [0, window.innerWidth], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-[var(--color-bg-main)] to-[var(--color-bg-alt)]">
      {/* Arrière-plan avec effets 3D */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[var(--color-primary)]/5 to-transparent"></div>
        
        {/* Grille 3D animée */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 95%, var(--color-primary)/20 100%),
                linear-gradient(0deg, transparent 95%, var(--color-primary)/20 100%)
              `,
              backgroundSize: '50px 50px',
              transform: 'perspective(500px) rotateX(60deg)',
              transformOrigin: 'center top',
            }}
          />
        </div>

        {/* Points flottants */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[var(--color-primary)]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* En-tête avec badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 border border-[var(--color-primary)]/20 mb-6">
            <Sparkles size={16} className="text-[var(--color-accent)]" />
            <span className="text-sm font-medium text-[var(--color-primary)]">
              Plateforme révolutionnaire
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[var(--color-neutral-900)] via-[var(--color-primary)] to-[var(--color-neutral-900)] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Fonctionnalités Intelligentes
          </h2>
          
          <p className="text-xl text-[var(--color-text-muted)] max-w-3xl mx-auto">
            Découvrez les outils puissants qui transforment la gestion scolaire en une expérience fluide et moderne.
          </p>
        </motion.div>

        {/* Grille de fonctionnalités avec effet 3D */}
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{
                transformStyle: "preserve-3d",
                transform: hoveredIndex === index 
                  ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(50px)`
                  : "none",
              }}
            >
              {/* Carte principale */}
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border border-white/40 shadow-2xl group-hover:shadow-3xl transition-all duration-500 h-full">
                {/* Effet de brillance */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Effet de bordure animée */}
                <div 
                  className="absolute inset-0 rounded-3xl p-px bg-gradient-to-br from-transparent via-[var(--color-primary)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: feature.gradient }}
                />
                
                {/* Numéro d'ordre */}
                <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-white to-gray-100 shadow-lg">
                  <span className="text-lg font-bold text-[var(--color-primary)]">
                    0{index + 1}
                  </span>
                </div>

                {/* Icône avec effet 3D */}
                <div className="relative mb-6">
                  <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                    {/* Effet 3D derrière l'icône */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                      style={{ background: feature.gradient }}
                    />
                    
                    {/* Icône principale */}
                    <div className="relative">
                      <feature.icon 
                        size={32}
                        className="relative z-10"
                        style={{ color: feature.color }}
                      />
                      
                      {/* Effet de lueur */}
                      <div 
                        className="absolute inset-0 w-8 h-8 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                        style={{ backgroundColor: feature.color }}
                      />
                    </div>
                  </div>
                  
                  {/* Badge de statistique */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: hoveredIndex === index ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
                    style={{ background: feature.gradient }}
                  >
                    {feature.stats}
                  </motion.div>
                </div>

                {/* Titre */}
                <h3 className="text-2xl font-bold mb-4 text-[var(--color-neutral-900)] group-hover:text-[var(--color-primary)] transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[var(--color-text-muted)] mb-6 leading-relaxed">
                  {feature.desc}
                </p>

                {/* Indicateur de survol */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium text-[var(--color-primary)]">
                    En savoir plus
                  </span>
                  <ChevronRight size={16} className="text-[var(--color-primary)]" />
                </div>

                {/* Points décoratifs */}
                <div className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ background: feature.gradient }}
                />
              </div>

              {/* Ombre portée 3D */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--color-neutral-900)]/20 to-transparent opacity-0 group-hover:opacity-100 -z-10 blur-xl transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* CTA en bas de section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 border border-[var(--color-primary)]/20 backdrop-blur-sm">
            <TrendingUp className="text-[var(--color-accent)]" size={24} />
            <span className="text-lg font-semibold text-[var(--color-neutral-800)]">
              Boostez votre productivité de <span className="text-[var(--color-primary)]">+200%</span>
            </span>
          </div>
        </motion.div>
      </div>

      {/* Styles CSS pour les effets 3D */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .group:hover .icon-3d {
          transform: translateZ(20px) rotate(10deg);
        }
        
        /* Effet de refraction sur les cartes */
        .glass-refraction {
          position: relative;
          overflow: hidden;
        }
        
        .glass-refraction::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 50%
          );
          transform: rotate(30deg);
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;