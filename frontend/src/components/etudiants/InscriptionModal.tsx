import { useEffect, useState } from "react";
import { createInscription } from "../../services/inscription.service";
import { getClasses } from "../../services/classe.service";
import { getStudentId } from "../../services/etudiant.service";

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

  useEffect(() => {
    if (open) {
      loadClasses();
      loadEtudiantId();
    }
  }, [open]);

  const loadClasses = async () => {
    const response = await getClasses(); // API scolarite-service
    setClasses(response.data);
  };

  const loadEtudiantId = async () => {
    const id = await getStudentId();
    setEtudiantId(id);
  };

  const handleSubmit = async () => {
    if (!classeId || !etudiantId) return;

    try {
      setLoading(true);
      console.log(`Data sent on request [ Student ID = ${etudiantId}, Class ID = ${classeId} ]`)
      await createInscription({
        etudiantId,
        classeId: Number(classeId),
      });
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold">Nouvelle inscription</h2>

        <select
          value={classeId}
          onChange={(e) => setClasseId(Number(e.target.value))}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">-- Choisir une classe --</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.libelle}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-primary text-white"
          >
            {loading ? "Envoi..." : "S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InscriptionModal;
