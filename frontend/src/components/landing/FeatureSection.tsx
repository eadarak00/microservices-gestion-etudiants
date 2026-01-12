import { Users, BookOpen, BarChart3, Lock } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestion des étudiants",
    desc: "Inscriptions, profils, suivi académique",
  },
  {
    icon: BookOpen,
    title: "Classes & Matières",
    desc: "Organisation pédagogique complète",
  },
  {
    icon: BarChart3,
    title: "Statistiques",
    desc: "Suivi des performances par classe",
  },
  {
    icon: Lock,
    title: "Sécurité",
    desc: "Accès par rôles et authentification JWT",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-6 bg-[var(--color-bg-alt)]">
      <h2 className="text-3xl font-bold text-center mb-14">
        Fonctionnalités principales
      </h2>

      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-[var(--color-bg-card)] shadow-md hover:shadow-xl transition"
          >
            <f.icon
              size={32}
              className="text-[var(--color-primary)] mb-4"
            />
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
