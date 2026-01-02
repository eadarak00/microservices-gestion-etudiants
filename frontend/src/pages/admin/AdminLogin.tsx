import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/auth.service";
import { saveTokens } from "../../services/token.service";
import { Shield, User, Lock, ArrowRight, Sparkles, Loader2 } from "lucide-react";

// Fonction pour décoder le token JWT
const decodeJWT = (token: string) => {
  try {
    // Le token JWT est composé de 3 parties séparées par des points : header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return null;
  }
};

// Fonction pour vérifier si l'utilisateur a le rôle ADMIN
const hasAdminRole = (decodedToken: any): boolean => {
  if (!decodedToken) return false;

  // Vérifier dans realm_access.roles
  if (decodedToken.realm_access && decodedToken.realm_access.roles) {
    return decodedToken.realm_access.roles.includes("ADMIN");
  }

  // Vérifier dans resource_access si nécessaire
  if (decodedToken.resource_access) {
    for (const resource in decodedToken.resource_access) {
      const roles = decodedToken.resource_access[resource]?.roles || [];
      if (roles.includes("ADMIN")) {
        return true;
      }
    }
  }

  // Vérifier directement dans les claims
  if (decodedToken.roles && Array.isArray(decodedToken.roles)) {
    return decodedToken.roles.includes("ADMIN");
  }

  return false;
};

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
      console.log("LOGIN RESPONSE", response);

      // Décoder le token pour vérifier le rôle
      const decodedToken = decodeJWT(response.accessToken);
      console.log("Token décodé:", decodedToken);

      if (!decodedToken) {
        throw new Error("Token invalide");
      }

      // Vérifier si l'utilisateur a le rôle ADMIN
      const isAdmin = hasAdminRole(decodedToken);
      console.log("Utilisateur est ADMIN:", isAdmin);

      if (!isAdmin) {
        throw new Error("Accès réservé aux administrateurs");
      }

      // Sauvegarder les tokens
      saveTokens(response.accessToken, response.refreshToken);

      // Rediriger vers la page admin
      navigate("/admin");

    } catch (err: any) {
      console.error("LOGIN ERROR", err?.response || err);

      // Gérer différents types d'erreurs
      if (err.message === "Accès réservé aux administrateurs") {
        setError("Accès refusé : rôle ADMIN requis");
      } else if (err.message === "Token invalide") {
        setError("Erreur d'authentification : token invalide");
      } else if (err.response?.status === 401) {
        setError("Identifiants invalides");
      } else if (err.response?.status === 403) {
        setError("Accès non autorisé");
      } else if (err.response?.status === 404) {
        setError("Service d'authentification indisponible");
      } else if (err.response?.status >= 500) {
        setError("Erreur serveur. Veuillez réessayer plus tard.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
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
            Connexion Admin
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Accès sécurisé réservé aux administrateurs
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg text-center text-sm transition-all animate-in fade-in duration-300"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "var(--color-error)",
              border: "1px solid var(--color-error)"
            }}
          >
            <div className="font-semibold mb-1">Erreur d'authentification</div>
            <div>{error}</div>
          </div>
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
              className="w-full py-3 pl-12 pr-4 rounded-xl bg-transparent transition-all focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-30"
              style={{
                border: "1px solid var(--color-neutral-300)",
                outline: "none",
              }}
              disabled={loading}
              autoComplete="username"
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
              className="w-full py-3 pl-12 pr-4 rounded-xl bg-transparent transition-all focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-30"
              style={{
                border: "1px solid var(--color-neutral-300)",
                outline: "none",
              }}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button with Loader */}
          <button
            type="submit"
            disabled={isDisabled || loading}
            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all relative overflow-hidden
                ${(isDisabled || loading) ? "cursor-not-allowed" : "hover-lift"}
              `}
            style={{
              background: isDisabled
                ? "var(--color-neutral-200)"
                : "var(--gradient-primary)",
              color: isDisabled
                ? "var(--color-text-muted)"
                : "var(--color-text-on-primary)",
              boxShadow: (isDisabled || loading) ? "none" : "var(--shadow-lg)",
            }}
          >
            {/* Loader Overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-primary)]">
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              </div>
            )}

            {/* Button Content */}
            <span className={`transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}>
              {loading ? "Vérification..." : "Se connecter"}
            </span>
            {!loading && <ArrowRight className="w-5 h-5 transition-opacity duration-300" />}
          </button>
        </form>

        {/* Security Info */}
        <div className="mt-6 p-3 rounded-lg text-xs text-center"
          style={{
            background: "rgba(var(--color-primary-rgb), 0.05)",
            color: "var(--color-text-muted)",
            border: "1px solid rgba(var(--color-primary-rgb), 0.1)"
          }}
        >
          <Lock className="w-3 h-3 inline-block mr-1" />
          Connexion sécurisée avec vérification des privilèges administrateur
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;