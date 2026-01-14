import { useEffect, useState } from "react";
import { createInscription } from "../../services/inscription.service";
import { getClasses } from "../../services/classe.service";
import { getStudentId } from "../../services/etudiant.service";
import { X, Loader2, GraduationCap } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const InscriptionModal = ({ open, onClose, onSuccess }: Props) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [classeId, setClasseId] = useState<number | "">("");
  const [etudiantId, setEtudiantId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      loadClasses();
      loadEtudiantId();
    }
  }, [open]);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const response = await getClasses();
      setClasses(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadEtudiantId = async () => {
    try {
      const id = await getStudentId();
      setEtudiantId(id);
    } catch (error) {
      console.error("Erreur lors du chargement de l'ID étudiant:", error);
    }
  };

  const handleSubmit = async () => {
    if (!classeId || !etudiantId) return;

    try {
      setSubmitting(true);
      await createInscription({
        etudiantId,
        classeId: Number(classeId),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop avec animation */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <GraduationCap className="h-6 w-6 text-[var(--color-primary)] " />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Nouvelle inscription
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Sélectionnez une classe pour continuer
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classe
              </label>
              <div className="relative">
                <select
                  value={classeId}
                  onChange={(e) => setClasseId(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent appearance-none cursor-pointer transition-all hover:border-gray-400"
                  disabled={loading}
                >
                  <option value="" className="text-gray-400">
                    -- Sélectionner une classe --
                  </option>
                  {classes.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      className="py-2"
                    >
                      {c.libelle} [ niveau: {c.niveau} ]
                    </option>
                  ))}
                </select>
                {loading ? (
                  <Loader2 className="absolute right-3 top-3.5 h-5 w-5 animate-spin text-gray-400" />
                ) : (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {classes.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  {classes.length} classe{classes.length > 1 ? 's' : ''} disponible{classes.length > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-[var(--color-warning-light)] " fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-[var(--color-warning)] ">
                    Information importante
                  </h3>
                  <div className="mt-2 text-sm text-[var(--color-accent)] ">
                    <p>
                      Votre inscription sera validée après vérification par l'administration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={!classeId || submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary-light)]  to-[var(--color-primary)]  text-white font-medium rounded-xl hover:from-[var(--color-primary)]  hover:to-[var(--color-primary-dark)]  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)]  flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                "Confirmer l'inscription"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscriptionModal;