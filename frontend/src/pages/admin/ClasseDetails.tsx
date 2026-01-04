import { useEffect, useState } from "react";
import { Plus, ArrowLeft, Clock, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  affecterMatiere,
  getMatieresParClasse,
} from "../../services/classe-matiere.service";

import { getMatieres } from "../../services/matiere.service";
import { getClasseById } from "../../services/classe.service";

import type { ClasseMatiereDTO } from "../../types/classe-matiere";
import type { Matiere } from "../../types/matiere";
import type { Classe } from "../../types/classe";

import AffectationMatiereModal from "../../components/AffectationMatiereModal";

const ClasseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const classeId = Number(id);

  const [classe, setClasse] = useState<Classe | null>(null);
  const [loading, setLoading] = useState(true);

  const [matieresAffectees, setMatieresAffectees] =
    useState<ClasseMatiereDTO[]>([]);

  const [matieresDisponibles, setMatieresDisponibles] =
    useState<Matiere[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  /* =========================
      FETCH CLASSE
  ========================== */
  const fetchClasse = async () => {
    try {
      const res = await getClasseById(classeId);
      setClasse(res.data);
    } catch {
      toast.error("Classe introuvable");
      navigate("/admin/classes");
    }
  };

  /* =========================
      FETCH MATIÈRES AFFECTÉES
  ========================== */
  // const fetchMatieresAffectees = async () => {
  //   try {
  //     const res = await getMatieresParClasse(classeId);
  //     setMatieresAffectees(res.data);
  //   } catch {
  //     toast.error("Eryreur lors du chargement des matières affectées");
  //   }
  // };

  /* =========================
      FETCH MATIÈRES DISPONIBLES
  ========================== */
  const fetchMatieresDisponibles = async (
    affectees: ClasseMatiereDTO[]
  ) => {
    try {
      const res = await getMatieres();
      const affecteesIds = affectees.map((m) => m.matiereId);

      const disponibles = res.data.filter(
        (m) => !affecteesIds.includes(m.id)
      );

      setMatieresDisponibles(disponibles);
    } catch {
      toast.error("Erreur lors du chargement des matières disponibles");
    }
  };

  /* =========================
      LOAD INITIAL
  ========================== */
  useEffect(() => {
    if (!classeId) {
      navigate("/admin/classes");
      return;
    }

    const load = async () => {
      setLoading(true);
      await fetchClasse();
      const res = await getMatieresParClasse(classeId);
      setMatieresAffectees(res.data);
      await fetchMatieresDisponibles(res.data);
      setLoading(false);
    };

    load();
  }, [classeId]);

  /* =========================
      AFFECTATION
  ========================== */
  const handleAffectation = async (matiereId: number, vh: number) => {
    try {
      await affecterMatiere(classeId, matiereId, vh);
      toast.success("Matière affectée avec succès");

      const res = await getMatieresParClasse(classeId);
      setMatieresAffectees(res.data);
      await fetchMatieresDisponibles(res.data);

      setModalOpen(false);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Erreur d’affectation");
    }
  };

  /* =========================
      UI STATES
  ========================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (!classe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <X size={40} />
        <p>Classe introuvable</p>
      </div>
    );
  }

  /* =========================
      RENDER
  ========================== */
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <button
        onClick={() => navigate("/admin/classes")}
        className="flex items-center gap-2 mb-6"
      >
        <ArrowLeft /> Retour
      </button>

      <h1 className="text-2xl font-bold mb-4">{classe.libelle}</h1>

      <button
        onClick={() => setModalOpen(true)}
        disabled={matieresDisponibles.length === 0}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        <Plus /> Affecter une matière
      </button>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Code</th>
            <th>Libellé</th>
            <th>Coeff</th>
            <th>Heures</th>
          </tr>
        </thead>

        <tbody>
          {matieresAffectees.map((ma) => (
            <tr key={ma.matiereId}>
              <td>{ma.code}</td>
              <td>{ma.libelle}</td>
              <td>{ma.coefficient}</td>
              <td>
                <Clock size={14} /> {ma.volumeHoraire} h
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      <AffectationMatiereModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAffectation}
        matieresDisponibles={matieresDisponibles}
      />
    </div>
  );
};

export default ClasseDetail;
