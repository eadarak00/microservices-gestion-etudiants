import { X, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import type { EtudiantCreate, EtudiantUpdate } from "../../types/etudiant";
import { Input } from "./Input";

interface EtudiantModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EtudiantCreate | EtudiantUpdate) => void;
  initialData?: EtudiantUpdate | null;
}

const initialState: EtudiantCreate = {
  matricule: "",
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  sexe: "M",
  password: "",
};

const EtudiantModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: EtudiantModalProps) => {
  const [form, setForm] = useState<EtudiantCreate>(initialState);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialState, ...initialData });
    } else {
      setForm(initialState);
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isDisabled =
    !form.matricule || !form.nom || !form.prenom || (!form.password && !initialData);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl p-6 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-main">
            {initialData ? "Modifier un étudiant" : "Ajouter un étudiant"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-200 transition"
          >
            <X />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="Matricule" name="matricule" value={form.matricule} onChange={handleChange} />
          <Input label="Nom" name="nom" value={form.nom} onChange={handleChange} />
          <Input label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} />
          <Input label="Email" name="email" value={form.email ?? ""} onChange={handleChange} />
          <Input label="Téléphone" name="telephone" value={form.telephone ?? ""} onChange={handleChange} />

          {/* Password field */}
          <div className="relative col-span-2">
            <Input
              label={initialData ? "Mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password ?? ""}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium text-text-muted">Sexe</label>
            <select
              name="sexe"
              value={form.sexe}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            >
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <button
          disabled={isDisabled}
          onClick={() => onSubmit(form)}
          className={`mt-6 w-full py-3 rounded-xl font-medium transition
            ${isDisabled
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

export default EtudiantModal;
