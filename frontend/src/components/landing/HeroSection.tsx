import { motion } from "framer-motion";
import { ShieldCheck, LogIn, Sparkles, ChevronRight, Users, BookOpen, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20">
      {/* Arrière-plan avec quadrillage animé */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-alt)] via-[var(--color-bg-main)] to-[var(--color-neutral-200)]"></div>

        {/* Quadrillage principal */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(to right, var(--color-primary) 1px, transparent 1px),
                             linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
          }}
        ></div>

        {/* Quadrillage secondaire avec animation de "pulse" */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, var(--color-secondary) 1px, transparent 1px),
                             linear-gradient(to bottom, var(--color-secondary) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        ></motion.div>

        {/* Points lumineux animés */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[var(--color-accent)] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Effets de lumière avec couleurs du thème */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--color-primary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[var(--color-secondary)] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 max-w-6xl text-center">
        {/* Badge de nouveauté */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white text-sm font-medium"
        >
          <Sparkles size={16} />
          <span>Plateforme Révolutionnaire • Disponible Maintenant</span>
        </motion.div>

        {/* Titre principal avec effet de dégradé animé */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight font-[var(--font-primary)]"
        >
          <span className="block text-[var(--color-neutral-900)]">Gestion Scolaire</span>
          <span className="relative">
            <span className="text-primary-gradient">Intelligente</span>
            <motion.span
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1 }}
            />
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-xl md:text-2xl text-[var(--color-text-muted)] mb-12 max-w-3xl mx-auto leading-relaxed font-[var(--font-primary)]"
        >
          Centralisez inscriptions, classes, enseignants et notes dans un
          <span className="font-semibold text-[var(--color-primary)]"> système sécurisé </span>
          et performant conçu pour les institutions modernes.
        </motion.p>

        {/* Boutons d'action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-wrap gap-6 justify-center mb-16"
        >
          <button
            onClick={() => navigate("/admin/login")}
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 hover:scale-105 hover-lift"
          >
            <div className="relative">
              <LogIn size={20} />
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-success)] rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <span className="font-semibold text-lg">Accès Administrateur</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>

          <button
            onClick={() => navigate("/enseignant/login")}
            className="group px-8 py-4 rounded-xl bg-[var(--color-bg-card)]/80 backdrop-blur-sm border-2 border-[var(--color-neutral-300)] text-[var(--color-primary)] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 hover:scale-105 hover:bg-[var(--color-neutral-50)] hover-lift"
          >
            <ShieldCheck size={20} />
            <span className="font-semibold text-lg">Accès Enseignant</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" size={20} />
          </button>
        </motion.div>

        {/* Statistiques / Fonctionnalités */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { icon: Users, label: "Gestion des Étudiants", value: "100%", color: "var(--color-primary)" },
            { icon: BookOpen, label: "Suivi Pédagogique", value: "Intégral", color: "var(--color-secondary)" },
            { icon: ShieldCheck, label: "Sécurité", value: "Maximale", color: "var(--color-accent)" },
            { icon: BarChart, label: "Analytique", value: "Avancée", color: "var(--color-primary-light)" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-2xl bg-[var(--color-bg-card)] backdrop-blur-sm border border-[var(--color-neutral-200)] shadow-lg hover-lift"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
            >
              <div className="flex flex-col items-center">
                <div 
                  className="p-3 rounded-full mb-3"
                  style={{ 
                    background: `linear-gradient(135deg, ${item.color}15, ${item.color}30)`,
                    border: `1px solid ${item.color}20`
                  }}
                >
                  <item.icon 
                    size={24} 
                    style={{ color: item.color }}
                  />
                </div>
                <div className="text-2xl font-bold text-[var(--color-neutral-900)]">{item.value}</div>
                <div className="text-sm text-[var(--color-text-muted)] mt-1">{item.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Indicateur de défilement */}
        <motion.div
          className="absolute -bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-[var(--color-neutral-300)] rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mt-2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Styles CSS pour les effets supplémentaires */}
      <style>{`
        .text-gradient-animated {
          background: linear-gradient(
            90deg, 
            var(--color-primary), 
            var(--color-primary-light), 
            var(--color-secondary), 
            var(--color-primary)
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradientShift 8s ease infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .text-gradient-animated:hover {
          animation: gradientShift 3s ease infinite;
        }
        
        /* Animation de pulse subtile avec couleurs du thème */
        @keyframes subtle-pulse {
          0%, 100% { 
            opacity: 0.1; 
            box-shadow: 0 0 20px var(--color-primary-light);
          }
          50% { 
            opacity: 0.2; 
            box-shadow: 0 0 40px var(--color-primary);
          }
        }
        
        .animate-pulse {
          animation: subtle-pulse 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;