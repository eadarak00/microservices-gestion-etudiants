import { useEffect, useState } from "react";
import { Plus, ArrowLeft, Clock, Edit2, Trash2, BookOpen, Search, TrendingUp, Loader2, Layers, UserCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getMatieresParClasse, affecterMatiere, modifierMatiere, supprimerMatiere } from "../../services/classe-matiere.service";
import { getClasseById } from "../../services/classe.service";
import { getMatieres } from "../../services/matiere.service";
import { getAffectationsParClasse, supprimerAffectation } from "../../services/affectation.service";

import type { Classe } from "../../types/classe";
import type { Matiere } from "../../types/matiere";
import type { ClasseMatiereDTO } from "../../types/classe-matiere";
import type { AffectationResponseDto } from "../../types/affectation";

import AffectationMatiereModal from "../../components/AffectationMatiereModal";

const ClasseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const classeId = Number(id);

  // STATES
  const [classe, setClasse] = useState<Classe | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"matieres" | "affectations">("matieres");
  const [searchTerm, setSearchTerm] = useState("");

  const [matieresAffectees, setMatieresAffectees] = useState<ClasseMatiereDTO[]>([]);
  const [matieresDisponibles, setMatieresDisponibles] = useState<Matiere[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState<ClasseMatiereDTO | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [affectations, setAffectations] = useState<AffectationResponseDto[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // FETCH CLASSE
  const fetchClasse = async () => {
    try {
      const res = await getClasseById(classeId);
      setClasse(res.data);
    } catch {
      toast.error("Classe introuvable");
      navigate("/admin/classes");
    }
  };

  // FETCH MATIERES DISPONIBLES
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

  // FETCH AFFECTATIONS
  const fetchAffectations = async () => {
    try {
      const res = await getAffectationsParClasse(classeId);
      setAffectations(res.data);
    } catch {
      setAffectations([]);
    }
  };

  // LOAD INITIAL DATA
  useEffect(() => {
    if (!classeId || isNaN(classeId)) {
      toast.error("ID de classe invalide");
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
        if (e.response?.status === 404) affectees = [];
        else toast.error("Erreur lors du chargement des matières affectées");
      }

      setMatieresAffectees(affectees);
      await fetchMatieresDisponibles(affectees);
      await fetchAffectations();

      setLoading(false);
    };

    load();
  }, [classeId]);

  // =======================
  // AFFECTATION MATIERES
  // =======================
  const handleAffectation = async (matiereId: number, vh: number) => {
    try {
      await affecterMatiere(classeId, matiereId, vh);
      toast.success("Matière affectée avec succès");
      const res = await getMatieresParClasse(classeId);
      setMatieresAffectees(res.data);
      await fetchMatieresDisponibles(res.data);
      await fetchAffectations();
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

  const handleDeleteMatiere = async (matiereId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette matière de la classe ? Cette action est irréversible.")) return;
    try {
      await supprimerMatiere(classeId, matiereId);
      toast.success("Matière supprimée de la classe");
      const res = await getMatieresParClasse(classeId);
      setMatieresAffectees(res.data);
      await fetchMatieresDisponibles(res.data);
      await fetchAffectations();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Erreur de suppression");
    }
  };

  // =======================
  // AFFECTATIONS ENSEIGNANTS
  // =======================
  const handleDeleteAffectation = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette affectation ? Cette action est irréversible.")) return;
    try {
      setDeletingId(id);
      await supprimerAffectation(id);
      toast.success("Affectation supprimée");
      await fetchAffectations();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  // =======================
  // FILTRE
  // =======================
  const filteredMatieres = matieresAffectees.filter(m =>
    m.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAffectations = affectations.filter(a => {
    const enseignant = `${a.enseignantPrenom} ${a.enseignantNom}`.toLowerCase();
    const matiere = matieresAffectees.find(m => m.matiereId === a.matiereId);
    return enseignant.includes(searchTerm.toLowerCase()) || 
           (matiere?.libelle.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (matiere?.code.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // =======================
  // STATISTICS
  // =======================
  const stats = {
    totalHeures: matieresAffectees.reduce((sum, m) => sum + m.volumeHoraire, 0),
    moyenneCoeff: matieresAffectees.length > 0 
      ? (matieresAffectees.reduce((sum, m) => sum + m.coefficient, 0) / matieresAffectees.length).toFixed(1)
      : "0.0",
    matieresUniques: new Set(matieresAffectees.map(m => m.matiereId)).size,
    enseignantsUniques: new Set(affectations.map(a => a.enseignantId)).size
  };

  // =======================
  // LOADING
  // =======================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-main)' }}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
          <p className="text-lg font-medium" style={{ color: 'var(--color-text-main)' }}>
            Chargement des données de la classe...
          </p>
        </div>
      </div>
    );
  }

  if (!classe) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-main)' }}>
        <div className="text-center max-w-md mx-auto p-8 rounded-2xl" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-md)' }}>
          <BookOpen className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--color-neutral-300)' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-main)' }}>Classe introuvable</h2>
          <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
            La classe que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <button
            onClick={() => navigate("/admin/classes")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover-lift mx-auto"
            style={{
              background: 'var(--gradient-primary)',
              color: 'var(--color-text-on-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  // =======================
  // RENDER
  // =======================
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ background: 'var(--color-bg-main)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/classes")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover-lift mb-6"
            style={{
              color: 'var(--color-text-muted)',
              backgroundColor: 'var(--color-neutral-200)',
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux classes
          </button>

          {/* Titre principal */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ background: 'var(--gradient-primary)' }}>
                <BookOpen className="h-7 w-7" style={{ color: 'var(--color-text-on-primary)' }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--color-text-main)' }}>
                  {classe.libelle}
                </h1>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Classe ID: <span className="font-medium">{classe.id}</span>
                  {classe.niveau && ` • Niveau: ${classe.niveau}`}
                  {classe.anneeAcademique && ` • Annee Academique: ${classe.anneeAcademique}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--color-bg-card)] rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Matières affectées</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>{stats.matieresUniques}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg-alt)' }}>
                <Layers className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-card)] rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Volume horaire total</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>{stats.totalHeures}h</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--color-info-light)' }}>
                <Clock className="h-6 w-6" style={{ color: 'var(--color-info)' }} />
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-card)] rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Coefficient moyen</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>{stats.moyenneCoeff}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--color-success-light)' }}>
                <TrendingUp className="h-6 w-6" style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-card)] rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Enseignants affectés</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>{stats.enseignantsUniques}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--color-accent-light)' }}>
                <UserCheck className="h-6 w-6" style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs et recherche */}
        <div className="bg-[var(--color-bg-card)] rounded-xl p-6 mb-6" style={{ boxShadow: 'var(--shadow-md)' }}>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("matieres")}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === "matieres" ? "text-white" : "hover:bg-[var(--color-neutral-200)]"}`}
                style={activeTab === "matieres" ? {
                  background: 'var(--gradient-primary)',
                  boxShadow: 'var(--shadow-sm)',
                } : {
                  color: 'var(--color-text-muted)',
                }}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Matières
                </div>
              </button>
              <button
                onClick={() => setActiveTab("affectations")}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === "affectations" ? "text-white" : "hover:bg-[var(--color-neutral-200)]"}`}
                style={activeTab === "affectations" ? {
                  background: 'var(--gradient-primary)',
                  boxShadow: 'var(--shadow-sm)',
                } : {
                  color: 'var(--color-text-muted)',
                }}
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Affectations
                </div>
              </button>
            </div>

            {/* Recherche */}
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-light)' }} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors"
                style={{
                  borderColor: 'var(--color-neutral-300)',
                  backgroundColor: 'var(--color-neutral-50)',
                  color: 'var(--color-text-main)',
                }}
              />
            </div>

            {/* Bouton d'action selon l'onglet */}
            {activeTab === "matieres" && (
              <button
                onClick={() => setModalOpen(true)}
                disabled={matieresDisponibles.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 hover-lift whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: matieresDisponibles.length === 0 ? 'var(--color-neutral-300)' : 'var(--gradient-primary)',
                  color: 'var(--color-text-on-primary)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <Plus className="h-5 w-5" />
                Affecter une matière
              </button>
            )}
          </div>

          {/* Contenu des tabs */}
          {activeTab === "matieres" ? (
            /* Tableau des matières */
            <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--color-neutral-200)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--color-bg-alt)' }}>
                    <th className="py-3 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-main)' }}>
                      Code
                    </th>
                    <th className="py-3 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-main)' }}>
                      Matière
                    </th>
                    <th className="py-3 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-main)' }}>
                      Coefficient
                    </th>
                    <th className="py-3 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-main)' }}>
                      Volume horaire
                    </th>
                    <th className="py-3 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-main)' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatieres.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <BookOpen className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--color-neutral-300)' }} />
                        <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-main)' }}>
                          Aucune matière affectée
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          {searchTerm ? "Aucun résultat pour votre recherche" : "Commencez par affecter une matière à cette classe"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredMatieres.map(m => (
                      <tr 
                        key={m.matiereId} 
                        className="border-b transition-colors hover:bg-[var(--color-bg-alt)]"
                        style={{ borderColor: 'var(--color-neutral-200)' }}
                      >
                        <td className="py-4 px-6">
                          <div className="font-medium" style={{ color: 'var(--color-text-main)' }}>
                            {m.code}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div style={{ color: 'var(--color-text-main)' }}>{m.libelle}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              background: 'var(--color-success-light)',
                              color: 'var(--color-success)',
                            }}>
                            {m.coefficient}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" style={{ color: 'var(--color-info)' }} />
                            <span className="font-medium" style={{ color: 'var(--color-text-main)' }}>{m.volumeHoraire}h</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(m)}
                              className="p-2 rounded-lg transition-all duration-200 hover-lift"
                              style={{
                                background: 'var(--color-warning-light)',
                                color: 'var(--color-warning)',
                              }}
                              aria-label="Modifier"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMatiere(m.matiereId)}
                              className="p-2 rounded-lg transition-all duration-200 hover-lift"
                              style={{
                                background: 'var(--color-danger-light)',
                                color: 'var(--color-danger)',
                              }}
                              aria-label="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Tableau des affectations */
            <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--color-neutral-200)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--color-bg-alt)' }}>
                    <th className="py-3 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-main)' }}>
                      Matière
                    </th>
                    <th className="py-3 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-main)' }}>
                      Enseignant
                    </th>
                    <th className="py-3 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-main)' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAffectations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                        <UserCheck className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--color-neutral-300)' }} />
                        <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-main)' }}>
                          Aucune affectation trouvée
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          {searchTerm ? "Aucun résultat pour votre recherche" : "Aucun enseignant n'est actuellement affecté à cette classe"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredAffectations.map(a => {
                      const matiere = matieresAffectees.find(m => m.matiereId === a.matiereId);
                      return (
                        <tr 
                          key={a.id} 
                          className="border-b transition-colors hover:bg-[var(--color-bg-alt)]"
                          style={{ borderColor: 'var(--color-neutral-200)' }}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full flex items-center justify-center"
                                style={{ background: 'var(--color-info-light)' }}>
                                <BookOpen className="h-4 w-4" style={{ color: 'var(--color-info)' }} />
                              </div>
                              <div>
                                <div className="font-medium" style={{ color: 'var(--color-text-main)' }}>
                                  {matiere ? matiere.libelle : `Matière #${a.matiereId}`}
                                </div>
                                {matiere && (
                                  <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                    {matiere.code} • {matiere.volumeHoraire}h
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full flex items-center justify-center"
                                style={{ background: 'var(--gradient-primary)' }}>
                                <span className="text-sm font-medium" style={{ color: 'var(--color-text-on-primary)' }}>
                                  {a.enseignantPrenom[0]}{a.enseignantNom[0]}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium" style={{ color: 'var(--color-text-main)' }}>
                                  {a.enseignantPrenom} {a.enseignantNom}
                                </div>
                                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                  ID: {a.enseignantId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDeleteAffectation(a.id)}
                                disabled={deletingId === a.id}
                                className="p-2.5 rounded-lg transition-all duration-200 hover-lift disabled:opacity-50"
                                style={{
                                  background: 'var(--color-danger-light)',
                                  color: 'var(--color-danger)',
                                }}
                                aria-label="Supprimer l'affectation"
                              >
                                {deletingId === a.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'affectation de matière */}
      <AffectationMatiereModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAffectation}
        matieresDisponibles={matieresDisponibles}
      />

      {/* Modal d'édition du volume horaire */}
      {editingMatiere && (
        <div className={`fixed inset-0 z-50 overflow-y-auto ${editModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
          <div
            className="fixed inset-0 bg-[var(--color-neutral-900)]/60 backdrop-blur-sm"
            onClick={() => setEditModalOpen(false)}
          />
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-md transform rounded-2xl bg-[var(--color-bg-card)] p-6 shadow-2xl transition-all duration-300"
              style={{
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--color-neutral-200)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ background: 'var(--color-warning-light)' }}>
                    <Edit2 className="h-5 w-5" style={{ color: 'var(--color-warning)' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-main)' }}>
                      Modifier le volume horaire
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      {editingMatiere.libelle} ({editingMatiere.code})
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-main)' }}>
                      Volume horaire (heures)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      defaultValue={editingMatiere.volumeHoraire}
                      id="editVolumeHoraire"
                      className="w-full rounded-lg border px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2"
                      style={{
                        borderColor: 'var(--color-neutral-300)',
                        backgroundColor: 'var(--color-neutral-50)',
                        color: 'var(--color-text-main)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-warning)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-neutral-300)';
                      }}
                    />
                    <p className="mt-1 text-xs" style={{ color: 'var(--color-text-light)' }}>
                      Définissez le nombre d'heures pour cette matière
                    </p>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setEditModalOpen(false)}
                      className="flex-1 rounded-lg px-4 py-3 font-medium transition-all duration-200 hover:opacity-90"
                      style={{
                        color: 'var(--color-text-muted)',
                        backgroundColor: 'var(--color-neutral-200)',
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        const input = document.getElementById('editVolumeHoraire') as HTMLInputElement;
                        const value = parseInt(input.value);
                        if (value >= 1 && value <= 100) {
                          handleUpdate(value);
                        } else {
                          toast.error("Le volume horaire doit être entre 1 et 100 heures");
                        }
                      }}
                      className="flex-1 rounded-lg px-4 py-3 font-semibold transition-all duration-200 hover-lift"
                      style={{
                        background: 'var(--gradient-primary)',
                        color: 'var(--color-text-on-primary)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClasseDetail;