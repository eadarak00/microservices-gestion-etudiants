import { useState } from "react";
import {
  Shield,
  User,
  Lock,
  ArrowRight,
  GraduationCap,
  Eye,
  EyeOff,
  Loader2,
  BookOpen,
  Award,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { login } from "../../services/auth.service";
import {
  clearTokens,
  hasStudentRole,
  saveTokens,
} from "../../services/token.service";

const StudentLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isDisabled = !username.trim() || !password.trim();

  const showError = (message: string) => {
    api.error({
      message: "Erreur de connexion",
      description: message,
      placement: "topRight",
      duration: 4,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(username, password);
      console.log("LOGIN RESPONSE", response);

      const accessToken = response.access_token;
      const refreshToken = response.refresh_token;

      if (!accessToken || !refreshToken) {
        throw new Error("Tokens manquants dans la réponse");
      }

      saveTokens(accessToken, refreshToken);

      if (!hasStudentRole()) {
        clearTokens();
        showError("Accès refusé : rôle Etudiant requis");
        return;
      }

      // Notification de succès
      api.success({
        message: "Connexion réussie",
        description: "Redirection vers le tableau de bord...",
        placement: "topRight",
        duration: 2,
      });

      // Navigation après un court délai pour laisser voir la notification
      setTimeout(() => {
        navigate("/etudiant");
      }, 500);
    } catch (err: any) {
      console.error("LOGIN ERROR", err?.response || err);

      // Gestion des différentes erreurs
      let errorMessage = "Identifiants invalides";

      if (err?.message?.includes("Tokens manquants")) {
        errorMessage = "Erreur technique : réponse du serveur invalide";
      } else if (err?.response?.status === 401) {
        errorMessage = "Nom d'utilisateur ou mot de passe incorrect";
      } else if (err?.response?.status === 403) {
        errorMessage = "Accès interdit. Vérifiez vos permissions.";
      } else if (err?.response?.status === 500) {
        errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
      } else if (!err?.response) {
        errorMessage = "Erreur de réseau. Vérifiez votre connexion.";
      }

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: "var(--color-bg-main)",
          fontFamily: "var(--font-primary)",
        }}
      >
        {/* Decorative Background Elements */}
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--color-primary)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: "var(--color-accent)" }}
        />

        <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Panel - Enhanced Branding */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Decorative Circle */}
                <div
                  className="absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-30 blur-2xl"
                  style={{ background: "var(--color-accent)" }}
                />

                <div
                  className="rounded-3xl p-12 relative overflow-hidden"
                  style={{
                    background: "var(--gradient-sidebar)",
                    boxShadow: "var(--shadow-xl)",
                  }}
                >
                  {/* Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: `radial-gradient(circle, var(--color-accent) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />

                  <div className="relative z-10">
                    {/* Logo */}
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "var(--shadow-lg)",
                      }}
                    >
                      <GraduationCap
                        className="w-10 h-10"
                        style={{ color: "var(--color-accent)" }}
                      />
                    </div>

                    <h1
                      className="text-5xl font-bold mb-4"
                      style={{ color: "var(--color-text-invert)" }}
                    >
                      CampusHub
                    </h1>
                    <p
                      className="text-xl mb-12 opacity-90"
                      style={{ color: "var(--color-text-invert)" }}
                    >
                      Votre portail d'excellence académique
                    </p>

                    {/* Features */}
                    <div className="space-y-6">
                      {[
                        {
                          icon: BookOpen,
                          text: "Accès à tous vos cours en ligne",
                        },
                        {
                          icon: Award,
                          text: "Suivi personnalisé de vos performances",
                        },
                        {
                          icon: Users,
                          text: "Collaboration avec vos enseignants",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:translate-x-2"
                          style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "var(--gradient-accent)" }}
                          >
                            <item.icon
                              className="w-6 h-6"
                              style={{ color: "var(--color-primary-dark)" }}
                            />
                          </div>
                          <span
                            className="text-base font-medium"
                            style={{ color: "var(--color-text-invert)" }}
                          >
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div
                      className="grid grid-cols-3 gap-4 mt-12 pt-8"
                      style={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      {[
                        { label: "Étudiants", value: "12K+" },
                        { label: "Cours", value: "500+" },
                        { label: "Taux de réussite", value: "95%" },
                      ].map((stat, idx) => (
                        <div key={idx} className="text-center">
                          <div
                            className="text-2xl font-bold mb-1"
                            style={{ color: "var(--color-accent)" }}
                          >
                            {stat.value}
                          </div>
                          <div
                            className="text-sm opacity-75"
                            style={{ color: "var(--color-text-invert)" }}
                          >
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Enhanced Login Form */}
            <div className="w-full">
              {/* Mobile Branding */}
              <div className="lg:hidden text-center mb-8">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <GraduationCap
                    className="w-8 h-8"
                    style={{ color: "var(--color-text-invert)" }}
                  />
                </div>
                <h1
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  CampusHub
                </h1>
                <p
                  style={{ color: "var(--color-text-muted)" }}
                  className="mt-2"
                >
                  Espace étudiant
                </p>
              </div>

              {/* Login Card */}
              <div
                className="rounded-2xl p-8 lg:p-10"
                style={{
                  background: "var(--color-bg-card)",
                  border: `1px solid var(--color-neutral-200)`,
                  boxShadow: "var(--shadow-xl)",
                }}
              >
                <div className="mb-8">
                  <div
                    className="inline-block px-4 py-2 rounded-full mb-4"
                    style={{
                      background: `${String(
                        getComputedStyle(
                          document.documentElement
                        ).getPropertyValue("--color-primary")
                      ).trim()}15`,
                      color: "var(--color-primary)",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    Connexion sécurisée
                  </div>
                  <h2
                    className="text-3xl font-bold mb-2"
                    style={{ color: "var(--color-text-main)" }}
                  >
                    Bon retour !
                  </h2>
                  <p style={{ color: "var(--color-text-muted)" }}>
                    Connectez-vous avec vos identifiants académiques
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--color-text-main)" }}
                    >
                      Adresse email académique
                    </label>
                    <div className="relative group">
                      <div
                        className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                        style={{
                          color: username
                            ? "var(--color-primary)"
                            : "var(--color-text-muted)",
                        }}
                      >
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="prenom.nom@etudiant.xyz.sn"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all"
                        style={{
                          border: `2px solid ${
                            username
                              ? "var(--color-primary)"
                              : "var(--color-neutral-300)"
                          }`,
                          background: "var(--color-neutral-50)",
                          color: "var(--color-text-main)",
                        }}
                        disabled={loading}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        className="block text-sm font-semibold"
                        style={{ color: "var(--color-text-main)" }}
                      >
                        Mot de passe
                      </label>
                      <button
                        type="button"
                        className="text-sm font-medium transition-colors"
                        style={{ color: "var(--color-primary)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color =
                            "var(--color-primary-light)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "var(--color-primary)")
                        }
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div className="relative group">
                      <div
                        className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                        style={{
                          color: password
                            ? "var(--color-primary)"
                            : "var(--color-text-muted)",
                        }}
                      >
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3.5 rounded-xl outline-none transition-all"
                        style={{
                          border: `2px solid ${
                            password
                              ? "var(--color-primary)"
                              : "var(--color-neutral-300)"
                          }`,
                          background: "var(--color-neutral-50)",
                          color: "var(--color-text-main)",
                        }}
                        disabled={loading}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all"
                        style={{
                          background: showPassword
                            ? "var(--color-neutral-200)"
                            : "transparent",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isDisabled || loading}
                    className="w-full py-4 rounded-xl font-semibold transition-all relative overflow-hidden group"
                    style={{
                      background:
                        isDisabled || loading
                          ? "var(--color-neutral-300)"
                          : "var(--gradient-primary)",
                      color:
                        isDisabled || loading
                          ? "var(--color-text-muted)"
                          : "var(--color-text-invert)",
                      cursor: isDisabled || loading ? "not-allowed" : "pointer",
                      boxShadow:
                        isDisabled || loading ? "none" : "var(--shadow-lg)",
                    }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Se connecter</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                    {!isDisabled && !loading && (
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(255, 255, 255, 0.1)" }}
                      />
                    )}
                  </button>

                  {/* Security Notice */}
                  <div
                    className="flex items-center justify-center gap-2 pt-6"
                    style={{ borderTop: `1px solid var(--color-neutral-200)` }}
                  >
                    <Shield
                      className="w-4 h-4"
                      style={{ color: "var(--color-success)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Connexion sécurisée SSL/TLS
                    </span>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Problème de connexion ?{" "}
                  <a
                    href="#support"
                    className="font-semibold transition-colors"
                    style={{ color: "var(--color-primary)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "var(--color-primary-light)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-primary)")
                    }
                  >
                    Contactez le support
                  </a>
                </p>
                <p
                  className="text-xs mt-3"
                  style={{ color: "var(--color-text-light)" }}
                >
                  © {new Date().getFullYear()} CampusHub • Plateforme
                  d'apprentissage
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentLogin;
