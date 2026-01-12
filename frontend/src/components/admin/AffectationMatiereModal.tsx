import { X } from "lucide-react";
import { useState } from "react";
import type { Matiere } from "../../types/matiere";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (matiereId: number, vh: number) => void;
  matieresDisponibles: Matiere[];
}

const AffectationMatiereModal = ({ open, onClose, onSubmit, matieresDisponibles }: Props) => {
  const [selectedMatiere, setSelectedMatiere] = useState<number | null>(null);
  const [vh, setVh] = useState<number>(0);

  if (!open) return null;

  const handleSubmit = () => {
    if (selectedMatiere && vh > 0) {
      onSubmit(selectedMatiere, vh);
      setSelectedMatiere(null);
      setVh(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-main">Affecter une matière</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-200 transition"
          >
            <X />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <select
            value={selectedMatiere ?? ""}
            onChange={(e) => setSelectedMatiere(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-accent outline-none"
          >
            <option value="">Sélectionner une matière</option>
            {matieresDisponibles.map((m) => (
              <option key={m.id} value={m.id}>
                {m.code} - {m.libelle}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Nombre d'heures (vh)"
            value={vh}
            onChange={(e) => setVh(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-accent outline-none"
            min={1}
          />
        </div>

        {/* Actions */}
        <button
          onClick={handleSubmit}
          disabled={!selectedMatiere || vh <= 0}
          className={`mt-6 w-full py-3 rounded-xl font-medium transition ${
            !selectedMatiere || vh <= 0
              ? "bg-neutral-300 cursor-not-allowed"
              : "bg-gradient-primary text-white hover:scale-105"
          }`}
        >
          Affecter
        </button>
      </div>
    </div>
  );
};

export default AffectationMatiereModal;
