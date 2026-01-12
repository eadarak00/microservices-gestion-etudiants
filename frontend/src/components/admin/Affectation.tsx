import { useEffect, useState } from "react";
import { X, Users, BookOpen, Link, Loader2, ChevronDown, CheckCircle, GraduationCap } from "lucide-react";
import { toast } from "react-hot-toast";

import { getClasses } from "../../services/classe.service";
import { getMatieresParClasse } from "../../services/classe-matiere.service";
import { affecterEnseignant } from "../../services/affectation.service";

import type { Classe } from "../../types/classe";
import type { ClasseMatiereDTO } from "../../types/classe-matiere";

interface Props {
  open: boolean;
  onClose: () => void;
  enseignantId: number;
  onSuccess: () => void;
}

const AffectationModal = ({
  open,
  onClose,
  enseignantId,
  onSuccess,
}: Props) => {
  /* =========================
     STATES
  ========================= */
  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<ClasseMatiereDTO[]>([]);

  const [classeId, setClasseId] = useState<number>();
  const [matiereId, setMatiereId] = useState<number>();

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingMatieres, setLoadingMatieres] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* =========================
     LOAD CLASSES (ON OPEN)
  ========================= */
  useEffect(() => {
    if (!open) return;

    const loadClasses = async () => {
      setLoadingClasses(true);
      try {
        const res = await getClasses();
        setClasses(res.data);
      } catch {
        toast.error("Erreur de chargement des classes");
      } finally {
        setLoadingClasses(false);
      }
    };

    loadClasses();

    // reset
    setClasseId(undefined);
    setMatiereId(undefined);
    setMatieres([]);
  }, [open]);

  /* =========================
     LOAD MATIERES (ON CLASSE CHANGE)
  ========================= */
  useEffect(() => {
    if (!classeId) {
      setMatieres([]);
      setMatiereId(undefined);
      return;
    }

    const loadMatieres = async () => {
      setLoadingMatieres(true);
      try {
        const res = await getMatieresParClasse(classeId);
        setMatieres(res.data);
        setMatiereId(undefined); // reset matière
      } catch {
        toast.error("Erreur de chargement des matières");
        setMatieres([]);
      } finally {
        setLoadingMatieres(false);
      }
    };

    loadMatieres();
  }, [classeId]);

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    if (!classeId || !matiereId) {
      toast.error("Veuillez sélectionner une classe et une matière");
      return;
    }

    try {
      setSubmitting(true);
      await affecterEnseignant({
        classeId,
        matiereId,
        enseignantId,
      });

      toast.success("Affectation réussie");
      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(
        e.response?.data?.message || "Erreur lors de l'affectation"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  // Trouver les éléments sélectionnés
  const selectedClasse = classes.find(c => c.id === classeId);
  const selectedMatiere = matieres.find(m => m.matiereId === matiereId);

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay avec effet de flou */}
      <div
        className="fixed inset-0 bg-[var(--color-neutral-900)]/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md transform rounded-xl bg-[var(--color-bg-card)] p-5 shadow-xl transition-all duration-200"
          style={{
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-neutral-200)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded p-2.5" style={{ background: 'var(--gradient-primary)' }}>
                <Link className="h-4.5 w-4.5" style={{ color: 'var(--color-text-on-primary)' }} />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-text-main)', fontSize: '17px' }}>
                  Nouvelle affectation
                </h2>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Associez l'enseignant à une classe et matière
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 transition-all duration-200 hover:bg-[var(--color-neutral-200)] hover:scale-105"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" style={{ color: 'var(--color-text-muted)' }} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Sélection Classe */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded" style={{ background: 'var(--color-bg-alt)' }}>
                  <Users className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold tracking-wide" style={{ color: 'var(--color-text-main)', fontSize: '13px' }}>
                    Classe
                  </label>
                  <p className="text-xs" style={{ color: 'var(--color-text-light)', fontSize: '11px' }}>
                    Sélectionnez une classe
                  </p>
                </div>
              </div>
              
              <div className="relative">
                {loadingClasses ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--color-primary)' }} />
                    <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      Chargement...
                    </span>
                  </div>
                ) : (
                  <>
                    <select
                      className="w-full rounded-lg border px-3.5 py-2.5 pr-9 appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-1 focus:shadow-sm"
                      style={{
                        borderColor: classeId ? 'var(--color-primary)' : 'var(--color-neutral-300)',
                        backgroundColor: 'var(--color-neutral-50)',
                        color: 'var(--color-text-main)',
                        fontSize: '14px',
                        fontFamily: 'var(--font-primary)',
                      }}
                      value={classeId ?? ""}
                      onChange={(e) =>
                        setClasseId(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    >
                      <option value="" style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>
                        Sélectionnez une classe
                      </option>
                      {classes.map((c) => (
                        <option 
                          key={c.id} 
                          value={c.id}
                          style={{ color: 'var(--color-text-main)', fontSize: '14px' }}
                        >
                          {c.libelle}
                          {c.niveau && ` • ${c.niveau}`}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                      <ChevronDown className="h-4 w-4" style={{ color: 'var(--color-text-muted)' }} />
                    </div>
                  </>
                )}
              </div>

              {selectedClasse && (
                <div className="rounded-lg p-3" style={{ background: 'var(--color-success-light)' }}>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: 'var(--color-success)' }} />
                    <div>
                      <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--color-text-main)', fontSize: '12px' }}>
                        Classe sélectionnée
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {selectedClasse.libelle}
                        {selectedClasse.niveau && ` • ${selectedClasse.niveau}`}
                        {selectedClasse.anneeAcademique && ` • ${selectedClasse.anneeAcademique}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sélection Matière */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded" style={{ background: 'var(--color-bg-alt)' }}>
                  <BookOpen className="h-4 w-4" style={{ color: 'var(--color-secondary)' }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold tracking-wide" style={{ color: 'var(--color-text-main)', fontSize: '13px' }}>
                    Matière
                  </label>
                  <p className="text-xs" style={{ color: 'var(--color-text-light)', fontSize: '11px' }}>
                    Sélectionnez une matière
                  </p>
                </div>
              </div>
              
              <div className="relative">
                {loadingMatieres ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--color-primary)' }} />
                    <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      Chargement...
                    </span>
                  </div>
                ) : (
                  <>
                    <select
                      className="w-full rounded-lg border px-3.5 py-2.5 pr-9 appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-1 focus:shadow-sm"
                      style={{
                        borderColor: matiereId ? 'var(--color-secondary)' : 'var(--color-neutral-300)',
                        backgroundColor: 'var(--color-neutral-50)',
                        color: 'var(--color-text-main)',
                        fontSize: '14px',
                        fontFamily: 'var(--font-primary)',
                      }}
                      disabled={!classeId || loadingMatieres}
                      value={matiereId ?? ""}
                      onChange={(e) =>
                        setMatiereId(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    >
                      <option value="" style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>
                        {classeId ? "Sélectionnez une matière" : "Sélectionnez d'abord une classe"}
                      </option>
                      {matieres.map((cm) => (
                        <option 
                          key={cm.matiereId} 
                          value={cm.matiereId}
                          style={{ color: 'var(--color-text-main)', fontSize: '14px' }}
                        >
                          {cm.libelle} • {cm.volumeHoraire}h • Coef. {cm.coefficient}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                      <ChevronDown className="h-4 w-4" style={{ color: 'var(--color-text-muted)' }} />
                    </div>
                  </>
                )}
              </div>

              {selectedMatiere && (
                <div className="rounded-lg p-3" style={{ background: 'var(--color-info-light)' }}>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: 'var(--color-info)' }} />
                    <div>
                      <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--color-text-main)', fontSize: '12px' }}>
                        Matière sélectionnée
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div>
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>Code:</span>
                          <span className="ml-1.5 font-medium" style={{ color: 'var(--color-text-main)', fontSize: '12px' }}>{selectedMatiere.code}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>Heures:</span>
                          <span className="ml-1.5 font-medium" style={{ color: 'var(--color-text-main)', fontSize: '12px' }}>{selectedMatiere.volumeHoraire}h</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>Coefficient:</span>
                          <span className="ml-1.5 font-medium" style={{ color: 'var(--color-text-main)', fontSize: '12px' }}>{selectedMatiere.coefficient}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>Classe:</span>
                          <span className="ml-1.5 font-medium truncate" style={{ color: 'var(--color-text-main)', fontSize: '12px' }}>
                            {selectedClasse?.libelle || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Visualisation résumé */}
            {(selectedClasse && selectedMatiere) && (
              <div className="rounded-xl p-4" style={{ background: 'var(--gradient-card)' }}>
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <div className="p-3 rounded-full" style={{ background: 'var(--color-bg-alt)' }}>
                    <GraduationCap className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2 tracking-tight" style={{ color: 'var(--color-text-main)' }}>
                      Résumé de l'affectation
                    </h4>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
                      <span className="px-3 py-1.5 rounded-full font-medium" style={{ 
                        background: 'var(--color-primary-light)', 
                        color: 'var(--color-text-on-primary)',
                        fontSize: '11px'
                      }}>
                        Enseignant #{enseignantId}
                      </span>
                      <span className="text-base font-bold" style={{ color: 'var(--color-accent)' }}>→</span>
                      <span className="px-3 py-1.5 rounded-full font-medium" style={{ 
                        background: 'var(--color-success-light)', 
                        color: 'var(--color-success)',
                        fontSize: '11px'
                      }}>
                        {selectedClasse.libelle}
                      </span>
                      <span className="text-base font-bold" style={{ color: 'var(--color-accent)' }}>+</span>
                      <span className="px-3 py-1.5 rounded-full font-medium" style={{ 
                        background: 'var(--color-info-light)', 
                        color: 'var(--color-info)',
                        fontSize: '11px'
                      }}>
                        {selectedMatiere.libelle}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-5 border-t" style={{ borderColor: 'var(--color-neutral-200)' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                {!classeId || !matiereId ? (
                  <span style={{ color: 'var(--color-warning)' }}>Sélectionnez une classe et une matière</span>
                ) : (
                  <span className="flex items-center gap-1.5" style={{ color: 'var(--color-success)', fontSize: '12px' }}>
                    <CheckCircle className="h-3.5 w-3.5" />
                    Prêt pour l'affectation
                  </span>
                )}
              </div>
              <div className="flex gap-2.5 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none rounded-lg px-5 py-2.5 font-medium transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 text-sm"
                  style={{
                    color: 'var(--color-text-muted)',
                    backgroundColor: 'var(--color-neutral-200)',
                  }}
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !classeId || !matiereId}
                  className="flex-1 sm:flex-none rounded-lg px-5 py-2.5 font-semibold transition-all duration-200 hover-lift hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  style={{
                    background: !classeId || !matiereId ? 'var(--color-neutral-300)' : 'var(--gradient-primary)',
                    color: !classeId || !matiereId ? 'var(--color-text-muted)' : 'var(--color-text-on-primary)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      En cours...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      <Link className="h-3.5 w-3.5" />
                      Confirmer
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

export default AffectationModal;