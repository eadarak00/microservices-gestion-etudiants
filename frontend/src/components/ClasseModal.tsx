import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ClasseCreate, ClasseUpdate } from "../types/classe";
import { Input } from "./Input";

interface ClasseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClasseCreate | ClasseUpdate) => void;
  initialData?: ClasseUpdate | null;
}

const initialState: ClasseCreate = {
  libelle: "",
  niveau: 1,
  anneeAcademique: "",
};

const ClasseModal = ({ open, onClose, onSubmit, initialData }: ClasseModalProps) => {
  const [form, setForm] = useState<ClasseCreate>(initialState);

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
    setForm((prev) => ({ ...prev, [name]: name === "niveau" ? Number(value) : value }));
  };

  const isDisabled = !form.libelle || !form.niveau || !form.anneeAcademique;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-main">
            {initialData ? "Modifier une classe" : "Ajouter une classe"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-200 transition">
            <X />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Input label="Libellé" name="libelle" value={form.libelle} onChange={handleChange} />
          <Input label="Niveau" name="niveau" type="number" value={form.niveau} onChange={handleChange} />
          <Input label="Année académique" name="anneeAcademique" value={form.anneeAcademique} onChange={handleChange} />
        </div>

        <button
          disabled={isDisabled}
          onClick={() => onSubmit(form)}
          className={`mt-6 w-full py-3 rounded-xl font-medium transition ${
            isDisabled ? "bg-neutral-300 cursor-not-allowed" : "bg-gradient-primary text-white hover:scale-105"
          }`}
        >
          {initialData ? "Mettre à jour" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
};

export default ClasseModal;
