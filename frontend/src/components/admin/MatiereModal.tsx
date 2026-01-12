import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./Input";
import type { MatiereCreate, MatiereUpdate } from "../../types/matiere";

interface MatiereModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MatiereCreate | MatiereUpdate) => void;
  initialData?: MatiereUpdate | null;
}

const initialState: MatiereCreate = {
  code: "",
  libelle: "",
  coefficient: 1,
};

const MatiereModal = ({ open, onClose, onSubmit, initialData }: MatiereModalProps) => {
  const [form, setForm] = useState<MatiereCreate>(initialState);

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialState, ...initialData });
    } else {
      setForm(initialState);
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "coefficient" ? Number(value) : value,
    }));
  };

  const isDisabled = !form.code || !form.libelle || form.coefficient <= 0;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-main">
            {initialData ? "Modifier une matière" : "Ajouter une matière"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-200 transition"
          >
            <X />
          </button>
        </div>

        {/* Formulaire */}
        <div className="flex flex-col gap-4">
          <Input label="Code" name="code" value={form.code} onChange={handleChange} />
          <Input label="Libellé" name="libelle" value={form.libelle} onChange={handleChange} />
          <Input
            label="Coefficient"
            name="coefficient"
            type="number"
            min={1}
            value={form.coefficient}
            onChange={handleChange}
          />
        </div>

        {/* Bouton d'action */}
        <button
          disabled={isDisabled}
          onClick={() => onSubmit(form)}
          className={`mt-6 w-full py-3 rounded-xl font-medium transition ${
            isDisabled
              ? "bg-neutral-300 cursor-not-allowed"
              : "bg-gradient-primary text-white hover:scale-105"
          }`}
        >
          {initialData ? "Mettre à jour" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
};

export default MatiereModal;
