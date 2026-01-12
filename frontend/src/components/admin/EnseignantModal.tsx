import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { X, UserPlus, UserCog, Eye, EyeOff } from "lucide-react";

import {
  creerEnseignant,
  modifierEnseignant,
} from "../../services/enseignant.service";
import type { Enseignant, EnseignantCreate } from "../../types/enseignant";

interface Props {
  open: boolean;
  onClose: () => void;
  enseignant: Enseignant | null;
  onSuccess: () => void;
}

interface FieldConfig {
  key: keyof EnseignantCreate;
  label: string;
  placeholder: string;
  type?: string;
  required: boolean;
  fullWidth: boolean;
}

const EnseignantModal = ({
  open,
  onClose,
  enseignant,
  onSuccess,
}: Props) => {
  const [form, setForm] = useState<EnseignantCreate>({
    matricule: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    specialite: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (enseignant) {
      setForm({
        ...enseignant,
        password: "",
      });
    } else {
      setForm({
        matricule: "",
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        specialite: "",
        password: "",
      });
    }
    setShowPassword(false);
  }, [enseignant, open]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      enseignant
        ? await modifierEnseignant(enseignant.id, form)
        : await creerEnseignant(form);

      toast.success("Opération réussie");
      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Erreur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && !isLoading) handleSubmit();
  };

  if (!open) return null;

  // Configuration des champs en groupes de 2 avec types bien définis
  const fieldGroups: FieldConfig[][] = [
    [
      { key: "matricule", label: "Matricule", placeholder: "Entrez le matricule", required: true, fullWidth: false },
      { key: "nom", label: "Nom", placeholder: "Entrez le nom", required: true, fullWidth: false },
    ],
    [
      { key: "prenom", label: "Prénom", placeholder: "Entrez le prénom", required: true, fullWidth: false },
      { key: "email", label: "Email", placeholder: "exemple@institution.com", type: "email", required: true, fullWidth: false },
    ],
    [
      { key: "telephone", label: "Téléphone", placeholder: "+33 1 23 45 67 89", required: false, fullWidth: false },
      { key: "specialite", label: "Spécialité", placeholder: "Spécialité de l'enseignant", required: true, fullWidth: false },
    ],
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay avec animation */}
      <div
        className="fixed inset-0 bg-[var(--color-neutral-900)]/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-2xl transform rounded-2xl bg-[var(--color-bg-card)] p-6 shadow-2xl transition-all duration-300"
          style={{
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--color-neutral-200)',
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* En-tête */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-3" style={{ background: 'var(--gradient-primary)' }}>
                {enseignant ? (
                  <UserCog className="h-7 w-7" style={{ color: 'var(--color-text-on-primary)' }} />
                ) : (
                  <UserPlus className="h-7 w-7" style={{ color: 'var(--color-text-on-primary)' }} />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>
                  {enseignant ? "Modifier l'enseignant" : "Nouvel enseignant"}
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {enseignant ? "Mettez à jour les informations de l'enseignant" : "Créez un nouveau profil d'enseignant"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 transition-all duration-200 hover:bg-[var(--color-neutral-200)] hover:scale-105"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" style={{ color: 'var(--color-text-muted)' }} />
            </button>
          </div>

          {/* Formulaire */}
          <div className="space-y-6">
            {/* Champs en grille 2x2 */}
            {fieldGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.map((field) => (
                  <div key={field.key} className={field.fullWidth ? "md:col-span-2" : ""}>
                    <label
                      className="mb-2 block text-sm font-semibold"
                      style={{ color: 'var(--color-text-main)' }}
                      htmlFor={field.key}
                    >
                      {field.label}
                      {field.required && <span style={{ color: 'var(--color-danger)' }}> *</span>}
                    </label>
                    <input
                      id={field.key}
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      value={form[field.key] || ""}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full rounded-xl border px-4 py-3.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:shadow-lg"
                      style={{
                        borderColor: 'var(--color-neutral-300)',
                        backgroundColor: 'var(--color-neutral-50)',
                        color: 'var(--color-text-main)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-primary)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(96, 6, 34, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-neutral-300)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}

            {/* Champ mot de passe - Pleine largeur */}
            <div>
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: 'var(--color-text-main)' }}
                htmlFor="password"
              >
                Mot de passe
                {!enseignant && <span style={{ color: 'var(--color-danger)' }}> *</span>}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={enseignant ? "Laissez vide pour ne pas modifier" : "Entrez un mot de passe sécurisé"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3.5 pr-12 transition-all duration-200 focus:outline-none focus:ring-2 focus:shadow-lg"
                  style={{
                    borderColor: 'var(--color-neutral-300)',
                    backgroundColor: 'var(--color-neutral-50)',
                    color: 'var(--color-text-main)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-all duration-200 hover:bg-[var(--color-neutral-200)] hover:scale-110"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {!enseignant && (
                <div className="mt-2 flex items-start gap-2">
                  <div className="mt-0.5 rounded-full p-1" style={{ background: 'var(--color-info-light)' }}>
                    <svg className="h-3 w-3" style={{ color: 'var(--color-info)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                    Le mot de passe doit contenir au moins 8 caractères avec des lettres, chiffres et caractères spéciaux
                  </p>
                </div>
              )}
            </div>

            {/* Informations supplémentaires */}
            <div className="rounded-xl p-4" style={{ background: 'var(--color-bg-alt)' }}>
              <div className="flex items-start gap-3">
                <div className="rounded-lg p-2" style={{ background: 'var(--color-primary-light)' }}>
                  <svg className="h-4 w-4" style={{ color: 'var(--color-text-on-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-main)' }}>
                    Informations importantes
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Tous les champs marqués d'un astérisque (*) sont obligatoires. 
                    Les informations seront utilisées pour l'identification et la communication avec l'enseignant.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pied de page */}
          <div className="mt-10 pt-6 border-t" style={{ borderColor: 'var(--color-neutral-200)' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                <span style={{ color: 'var(--color-danger)' }}>*</span> Champs requis
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none rounded-xl px-6 py-3.5 font-medium transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                  style={{
                    color: 'var(--color-text-muted)',
                    backgroundColor: 'var(--color-neutral-200)',
                  }}
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none rounded-xl px-6 py-3.5 font-semibold transition-all duration-200 hover-lift hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'var(--color-text-on-primary)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      {enseignant ? "Mise à jour..." : "Création..."}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {enseignant ? (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Mettre à jour
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Créer l'enseignant
                        </>
                      )}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnseignantModal;