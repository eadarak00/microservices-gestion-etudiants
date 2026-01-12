import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 px-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-light)]">
      <div className="max-w-4xl mx-auto text-center">
        {/* Contenu principal */}
        <div className="space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Prêt à moderniser
            <span className="block text-[var(--color-accent)]">votre établissement ?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/80 max-w-2xl mx-auto"
          >
            Rejoignez les centaines d'établissements qui ont déjà transformé leur gestion académique.
          </motion.p>

          {/* Bouton CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => navigate("/admin/login")}
              className="group px-8 py-4 rounded-xl bg-white text-[var(--color-primary)] font-semibold text-lg shadow-lg flex items-center gap-3 mx-auto hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Démarrer gratuitement</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <p className="text-white/60 text-sm mt-4">
              30 jours d'essai • Configuration en quelques minutes
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;