import { useEffect, useState } from "react";
import { X, Users, BookOpen, Link, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { getClasses } from "../services/classe.service";
import { getMatieresParClasse } from "../services/classe-matiere.service";
import { affecterEnseignant } from "../services/affectation.service";

import type { Classe } from "../types/classe";
import type { ClasseMatiereDTO } from "../types/classe-matiere";

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

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Link className="h-5 w-5" />
            Nouvelle affectation
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Classe */}
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Classe
            </label>

            {loadingClasses ? (
              <Loader2 className="animate-spin" />
            ) : (
              <select
                className="w-full rounded-lg border px-3 py-2"
                value={classeId ?? ""}
                onChange={(e) =>
                  setClasseId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              >
                <option value="">Sélectionner une classe</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.libelle}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Matière */}
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              Matière
            </label>

            {loadingMatieres ? (
              <Loader2 className="animate-spin" />
            ) : (
              <select
                className="w-full rounded-lg border px-3 py-2"
                disabled={!classeId}
                value={matiereId ?? ""}
                onChange={(e) =>
                  setMatiereId(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              >
                <option value="">
                  {classeId
                    ? "Sélectionner une matière"
                    : "Sélectionnez d'abord une classe"}
                </option>

                {matieres.map((cm) => (
                  <option key={cm.matiereId} value={cm.matiereId}>
                    {cm.libelle}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 bg-gray-200"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !classeId || !matiereId}
            className="rounded-lg px-4 py-2 bg-blue-600 text-white disabled:opacity-50"
          >
            {submitting ? "Affectation..." : "Affecter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AffectationModal;
