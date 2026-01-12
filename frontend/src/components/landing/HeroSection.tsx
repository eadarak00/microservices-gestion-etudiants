import { motion } from "framer-motion";
import { ShieldCheck, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Plateforme Moderne de <br />
          <span className="text-primary-gradient">Gestion des Étudiants</span>
        </h1>

        <p className="text-lg text-[var(--color-text-muted)] mb-10">
          Centralisez inscriptions, classes, enseignants et notes dans un
          système sécurisé et performant.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate("/admin/login")}
            className="px-6 py-3 rounded-xl bg-[var(--gradient-primary)] text-white shadow-lg hover:scale-105 transition"
          >
            <LogIn className="inline mr-2" size={18} />
            Accès Administrateur
          </button>

          <button
            onClick={() => navigate("/enseignant/login")}
            className="px-6 py-3 rounded-xl border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition"
          >
            <ShieldCheck className="inline mr-2" size={18} />
            Accès Enseignant
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
