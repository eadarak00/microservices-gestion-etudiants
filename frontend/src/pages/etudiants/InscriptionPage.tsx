import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getStudentId } from "../../services/etudiant.service";
import { getAllInscriptionEtudiants } from "../../services/inscription.service";
import InscriptionModal from "../../components/etudiants/InscriptionModal";

import type { Inscription } from "../../types/inscription";

const InscriptionsPage = () => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [etudiantId, setEtudiantId] = useState<number | null>(null);


  const loadData = async (id: number) => {
    try {
      setLoading(true);
      const response = await getAllInscriptionEtudiants(id);
      setInscriptions(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const id = await getStudentId();
      setEtudiantId(id);
      if (id) {
        loadData(id);
      } else {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Mes inscriptions</h1>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> S'inscrire
        </button>
      </div>

      {/* Liste */}
      {loading ? (
        <p>Chargement...</p>
      ) : inscriptions.length === 0 ? (
        <p className="text-gray-500">Aucune inscription</p>
      ) : (
        <div className="grid gap-4">
          {inscriptions.map((i) => (
            <div
              key={i.id}
              className="bg-white rounded-xl shadow p-4 flex justify-between"
            >
              <div>
                <p className="font-medium">Classe ID : {i.classeId}</p>
                <p className="text-sm text-gray-500">
                  Date : {new Date(i.dateInscription).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm ${i.etat === "VALIDEE"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {i.etat}
              </span>
            </div>
          ))}
        </div>
      )}

      <InscriptionModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => etudiantId && loadData(etudiantId)}
      />
    </div>
  );
};

export default InscriptionsPage;
