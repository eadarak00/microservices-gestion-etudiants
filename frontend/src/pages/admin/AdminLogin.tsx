import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/auth.service";
import { saveTokens } from "../../services/token.service";
import { Shield, User, Lock, ArrowRight, Sparkles } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focus, setFocus] = useState<"username" | "password" | null>(null);
  const isDisabled = !username.trim() || !password.trim();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginAdmin(username, password);
      saveTokens(response.accessToken, response.refreshToken);
      navigate("/admin");
    } catch (err) {
      setError("Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--color-bg-main), var(--color-bg-alt))",
        fontFamily: "var(--font-primary)",
      }}
    >
      {/* Glow background */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[var(--color-primary)] opacity-20 blur-3xl animate-float-slow" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[var(--color-accent)] opacity-20 blur-3xl animate-float-slow delay-2000" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md p-10 rounded-3xl backdrop-blur-xl"
        style={{
          background: "var(--color-bg-card)",
          boxShadow: "var(--shadow-xl)",
          borderRadius: "var(--border-radius-xl)",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Shield className="w-10 h-10 text-[var(--color-text-on-primary)]" />
            </div>
            <div
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center animate-pulse"
              style={{ background: "var(--color-accent)" }}
            >
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-gradient mb-2">
            Bienvenue
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Accès sécurisé administrateur
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-sm text-red-500 mt-4">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="relative">
            <User
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors`}
              style={{
                color:
                  focus === "username"
                    ? "var(--color-primary)"
                    : "var(--color-text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocus("username")}
              onBlur={() => setFocus(null)}
              className="w-full py-3 pl-12 pr-4 rounded-xl bg-transparent transition-all"
              style={{
                border: "1px solid var(--color-neutral-300)",
                outline: "none",
              }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
              style={{
                color:
                  focus === "password"
                    ? "var(--color-primary)"
                    : "var(--color-text-muted)",
              }}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocus("password")}
              onBlur={() => setFocus(null)}
              className="w-full py-3 pl-12 pr-4 rounded-xl bg-transparent transition-all"
              style={{
                border: "1px solid var(--color-neutral-300)",
                outline: "none",
              }}
            />
          </div>

          {/* Forgot */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm transition-colors"
              style={{ color: "var(--color-text-light)" }}
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isDisabled || loading}
            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                ${isDisabled ? "cursor-not-allowed opacity-50" : "hover-lift"}
              `}
            style={{
              background: "var(--gradient-primary)",
              color: "var(--color-text-on-primary)",
              boxShadow: isDisabled ? "none" : "var(--shadow-lg)",
            }}
          >
            Se connecter
            <ArrowRight className="w-5 h-5" />
          </button>

        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-[var(--color-text-light)]">
          Accès réservé aux administrateurs
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
