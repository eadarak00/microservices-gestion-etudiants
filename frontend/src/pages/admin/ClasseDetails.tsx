import { useEffect, useState } from "react";
import { Plus, ArrowLeft, Clock, Edit2, Trash2, BookOpen, Users, Calendar, Search, TrendingUp, FileClock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  affecterMatiere,
  getMatieresParClasse,
  modifierMatiere,
  supprimerMatiere,
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
  const [searchTerm, setSearchTerm] = useState("");

  const [matieresAffectees, setMatieresAffectees] = useState<ClasseMatiereDTO[]>([]);
  const [matieresDisponibles, setMatieresDisponibles] = useState<Matiere[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState<ClasseMatiereDTO | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

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
      FETCH MATIÈRES DISPONIBLES
  ========================== */
  const fetchMatieresDisponibles = async (affectees: ClasseMatiereDTO[]) => {
    try {
      const res = await getMatieres();
      const affecteesIds = affectees.map((m) => m.matiereId);

      const disponibles = res.data.filter((m) => !affecteesIds.includes(m.id));

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

      let affectees: ClasseMatiereDTO[] = [];

      try {
        const res = await getMatieresParClasse(classeId);
        affectees = res.data;
      } catch (e: any) {
        if (e.response?.status === 404) {
          affectees = [];
        } else {
          toast.error("Erreur lors du chargement des matières affectées");
        }
      }

      setMatieresAffectees(affectees);
      await fetchMatieresDisponibles(affectees);

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
      toast.success("Matière affectée");

      const res = await getMatieresParClasse(classeId);
      setMatieresAffectees(res.data);
      await fetchMatieresDisponibles(res.data);

      setModalOpen(false);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Erreur d'affectation");
    }
  };

  const handleEdit = (matiere: ClasseMatiereDTO) => {
    setEditingMatiere(matiere);
    setEditModalOpen(true);
  };

  const handleUpdate = async (volumeHoraire: number) => {
    if (!editingMatiere) return;

    try {
      await modifierMatiere(classeId, editingMatiere.matiereId, volumeHoraire);
      toast.success("Volume horaire mis à jour");

      const res = await getMatieresParClasse(classeId);
      setMatieresAffectees(res.data);

      setEditModalOpen(false);
      setEditingMatiere(null);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Erreur de modification");
    }
  };

  const handleDelete = async (matiereId: number) => {
    if (!confirm("Supprimer cette matière ?")) return;

    try {
      await supprimerMatiere(classeId, matiereId);
      toast.success("Matière supprimée");

      const res = await getMatieresParClasse(classeId);
      setMatieresAffectees(res.data);
      await fetchMatieresDisponibles(res.data);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Erreur de suppression");
    }
  };

  /* =========================
      FILTER MATIERES
  ========================== */
  const filteredMatieres = matieresAffectees.filter(matiere =>
    matiere.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    matiere.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcul des statistiques
  const stats = {
    totalHeures: matieresAffectees.reduce((sum, m) => sum + m.volumeHoraire, 0),
    moyenneCoeff: matieresAffectees.length > 0 
      ? (matieresAffectees.reduce((sum, m) => sum + m.coefficient, 0) / matieresAffectees.length).toFixed(1)
      : "0.0",
    matieresUniques: new Set(matieresAffectees.map(m => m.matiereId)).size
  };

  /* =========================
      LOADING STATE
  ========================== */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg-main)] to-[var(--color-neutral-200)] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-3">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin"></div>
            <BookOpen className="absolute inset-0 m-auto text-[var(--color-primary)]" size={20} />
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!classe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg-main)] to-[var(--color-neutral-200)] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--color-neutral-200)] text-center max-w-sm">
          <div className="w-12 h-12 mx-auto mb-3 bg-[var(--color-danger-light)] rounded-full flex items-center justify-center">
            <Users className="text-[var(--color-danger)]" size={24} />
          </div>
          <h2 className="text-base font-semibold text-[var(--color-text-main)] mb-2">Classe introuvable</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">La classe que vous recherchez n'existe pas.</p>
          <button
            onClick={() => navigate("/admin/classes")}
            className="px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white text-sm rounded-lg hover:opacity-90 transition-opacity"
          >
            Retour aux classes
          </button>
        </div>
      </div>
    );
  }

  /* =========================
      RENDER
  ========================== */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg-main)] to-[var(--color-neutral-200)] p-4 sm:p-5 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/classes")}
            className="group flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-4"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
            <span>Retour aux classes</span>
          </button>

          {/* CLASSE CARD */}
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-lg p-5 shadow-md mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold text-white mb-1">{classe.libelle}</h1>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 text-white/90">
                    <Users size={14} />
                    <span className="text-sm">Niveau {classe.niveau}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/90">
                    <Calendar size={14} />
                    <span className="text-sm">{classe.anneeAcademique}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <p className="text-white text-xs">Matières</p>
                  <p className="text-white text-lg font-semibold">{matieresAffectees.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* LEFT COLUMN - STATS & ACTIONS */}
          <div className="lg:col-span-1 space-y-4">
            {/* ACTIONS CARD */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-[var(--color-neutral-200)]">
              <h2 className="text-sm font-semibold text-[var(--color-text-main)] mb-3">Actions</h2>
              
              <button
                onClick={() => setModalOpen(true)}
                disabled={matieresDisponibles.length === 0}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  matieresDisponibles.length === 0
                    ? "bg-[var(--color-neutral-200)] text-[var(--color-neutral-600)] cursor-not-allowed"
                    : "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white hover:shadow"
                }`}
              >
                <Plus size={16} />
                Affecter une matière
                {matieresDisponibles.length > 0 && (
                  <span className="ml-auto bg-white/20 px-1.5 py-0.5 rounded text-xs">
                    {matieresDisponibles.length}
                  </span>
                )}
              </button>

              {matieresDisponibles.length === 0 && (
                <p className="text-xs text-[var(--color-text-muted)] text-center mt-2">
                  Toutes les matières sont affectées
                </p>
              )}
            </div>

            {/* STATS CARD */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-[var(--color-neutral-200)]">
              <h2 className="text-sm font-semibold text-[var(--color-text-main)] mb-3">Statistiques</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[var(--color-primary)]" />
                    <span className="text-sm text-[var(--color-text-muted)]">Total heures</span>
                  </div>
                  <span className="text-base font-semibold text-[var(--color-primary)]">
                    {stats.totalHeures}h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-[var(--color-secondary)]" />
                    <span className="text-sm text-[var(--color-text-muted)]">Moyenne coeff</span>
                  </div>
                  <span className="text-base font-semibold text-[var(--color-secondary)]">
                    {stats.moyenneCoeff}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileClock size={14} className="text-[var(--color-accent)]" />
                    <span className="text-sm text-[var(--color-text-muted)]">Matières uniques</span>
                  </div>
                  <span className="text-base font-semibold text-[var(--color-accent)]">
                    {stats.matieresUniques}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - MATIERES LIST */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-[var(--color-neutral-200)] overflow-hidden">
              {/* TABLE HEADER */}
              <div className="p-4 border-b border-[var(--color-neutral-200)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-[var(--color-text-main)]">Matières affectées</h2>
                    <p className="text-xs text-[var(--color-text-light)] mt-0.5">
                      {matieresAffectees.length} matière{matieresAffectees.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  {/* SEARCH */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-500)]" size={14} />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-2 w-full sm:w-48 border border-[var(--color-neutral-300)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
              </div>

              {/* TABLE CONTENT */}
              <div className="overflow-x-auto">
                {filteredMatieres.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-[var(--color-neutral-100)] rounded-full flex items-center justify-center">
                      <BookOpen className="text-[var(--color-neutral-500)]" size={20} />
                    </div>
                    <h3 className="text-sm font-medium text-[var(--color-text-main)] mb-2">
                      {searchTerm ? "Aucun résultat" : "Aucune matière"}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] mb-4">
                      {searchTerm
                        ? "Essayez d'autres termes"
                        : "Affectez une matière à cette classe"}
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={() => setModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white text-sm rounded-md hover:opacity-90 transition-opacity"
                      >
                        <Plus className="inline mr-1.5" size={14} />
                        Affecter une matière
                      </button>
                    )}
                  </div>
                ) : (
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-[var(--color-neutral-50)]">
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                          Matière
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                          Coeff
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                          Heures
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-neutral-100)]">
                      {filteredMatieres.map((ma) => (
                        <tr 
                          key={ma.matiereId} 
                          className="hover:bg-[var(--color-bg-alt)] transition-colors group"
                        >
                          <td className="px-4 py-3">
                            <div className="bg-[var(--color-primary-light)]/10 text-[var(--color-primary)] font-medium text-xs px-2 py-1 rounded inline-block">
                              {ma.code}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-[var(--color-text-main)]">{ma.libelle}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center justify-center w-7 h-7 bg-[var(--color-secondary-light)]/10 text-[var(--color-secondary)] text-sm font-semibold rounded">
                              {ma.coefficient}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <Clock size={12} className="text-[var(--color-accent)]" />
                              <span className="text-sm font-medium text-[var(--color-text-main)]">{ma.volumeHoraire}h</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(ma)}
                                className="p-1.5 bg-[var(--color-warning-light)] text-[var(--color-warning)] rounded hover:bg-[var(--color-warning)] hover:text-white transition-colors"
                                title="Modifier"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleDelete(ma.matiereId)}
                                className="p-1.5 bg-[var(--color-danger-light)] text-[var(--color-danger)] rounded hover:bg-[var(--color-danger)] hover:text-white transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AffectationMatiereModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAffectation}
        matieresDisponibles={matieresDisponibles}
      />

      {/* EDIT MODAL */}
      {editingMatiere && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${editModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditModalOpen(false)} />
          <div className="relative bg-white rounded-lg p-5 max-w-sm w-full shadow-lg">
            <h3 className="text-base font-semibold text-[var(--color-text-main)] mb-1">Modifier volume horaire</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-3">
              <span className="font-medium text-[var(--color-primary)]">{editingMatiere.libelle}</span> ({editingMatiere.code})
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                  Volume horaire (heures)
                </label>
                <input
                  type="number"
                  min="1"
                  max="999"
                  defaultValue={editingMatiere.volumeHoraire}
                  id="editVolumeHoraire"
                  className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                />
              </div>
              
              <div className="flex gap-2 pt-3">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 px-3 py-2 border border-[var(--color-neutral-300)] text-sm text-[var(--color-text-muted)] rounded hover:bg-[var(--color-neutral-100)] transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById('editVolumeHoraire') as HTMLInputElement;
                    handleUpdate(parseInt(input.value) || editingMatiere.volumeHoraire);
                  }}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white text-sm rounded hover:opacity-90 transition-opacity"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClasseDetail;