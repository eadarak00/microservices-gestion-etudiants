import { GraduationCap, UserCog, User } from "lucide-react";

const roles = [
  {
    icon: UserCog,
    title: "Administration",
    desc: "Gestion complète du système",
  },
  {
    icon: GraduationCap,
    title: "Enseignants",
    desc: "Notes, absences, matières",
  },
  {
    icon: User,
    title: "Étudiants",
    desc: "Consultation des résultats",
  },
];

const RolesSection = () => {
  return (
    <section className="py-24 px-6">
      <h2 className="text-3xl font-bold text-center mb-14">
        Une plateforme pour tous
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {roles.map((r, i) => (
          <div
            key={i}
            className="p-8 rounded-2xl bg-[var(--color-bg-card)] shadow hover:shadow-xl transition text-center"
          >
            <r.icon
              size={36}
              className="mx-auto text-[var(--color-primary)] mb-4"
            />
            <h3 className="font-semibold mb-2">{r.title}</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              {r.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RolesSection;
