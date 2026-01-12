import { useNavigate } from "react-router-dom";

const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-[var(--color-primary)] text-white text-center">
      <h2 className="text-4xl font-bold mb-6">
        Prêt à digitaliser votre établissement ?
      </h2>

      <p className="mb-8 opacity-90">
        Simplifiez la gestion académique dès aujourd’hui.
      </p>

      <button
        onClick={() => navigate("/admin/login")}
        className="px-8 py-3 rounded-xl bg-white text-[var(--color-primary)] font-semibold hover:scale-105 transition"
      >
        Commencer maintenant
      </button>
    </section>
  );
};

export default CtaSection;
