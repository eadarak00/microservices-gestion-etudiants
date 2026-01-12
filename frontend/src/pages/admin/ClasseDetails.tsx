import { useEffect, useState } from "react";
import { Plus, ArrowLeft, Clock, Edit2, Trash2, BookOpen, Search, TrendingUp, Loader2, Layers, UserCheck, Hash, Eye, Mail} from "lucide-react";
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

import AffectationMatiereModal from "../../components/admin/AffectationMatiereModal";

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
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-main)', fontSize: '14px' }}>
            Chargement des données...
          </p>
        </div>
      </div>
    );
  }

  if (!classe) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-main)' }}>
        <div className="text-center max-w-sm mx-auto p-6 rounded-lg" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
          <BookOpen className="h-12 w-12 mx-auto mb-3" style={{ color: 'var(--color-neutral-300)' }} />
          <h2 className="text-lg font-bold mb-1.5" style={{ color: 'var(--color-text-main)', fontSize: '17px' }}>Classe introuvable</h2>
          <p className="mb-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            La classe que vous recherchez n'existe pas.
          </p>
          <button
            onClick={() => navigate("/admin/classes")}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover-lift mx-auto text-sm"
            style={{
              background: 'var(--gradient-primary)',
              color: 'var(--color-text-on-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
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
    <div className="min-h-screen p-4 md:p-5" style={{ 
      background: 'var(--color-bg-main)',
      fontFamily: 'var(--font-primary)'
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header avec bouton retour */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/classes")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover-lift mb-4 text-sm"
            style={{
              color: 'var(--color-text-muted)',
              backgroundColor: 'var(--color-neutral-200)',
              fontSize: '14px'
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour aux classes
          </button>

          {/* Titre principal */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg" style={{ background: 'var(--gradient-primary)' }}>
                <BookOpen className="h-5 w-5" style={{ color: 'var(--color-text-on-primary)' }} />
              </div>
              <div>
                <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--color-text-main)', fontSize: '19px' }}>
                  {classe.libelle}
                </h1>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
                  <div className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    <span>ID: <span className="font-medium">{classe.id}</span></span>
                  </div>
                  {classe.niveau && (
                    <>
                      <div className="h-3 w-px" style={{ background: 'var(--color-neutral-300)' }} />
                      <span>Niveau: <span className="font-medium">{classe.niveau}</span></span>
                    </>
                  )}
                  {classe.anneeAcademique && (
                    <>
                      <div className="h-3 w-px" style={{ background: 'var(--color-neutral-300)' }} />
                      <span>Année: <span className="font-medium">{classe.anneeAcademique}</span></span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <div className="bg-[var(--color-bg-card)] rounded-lg p-4" style={{ boxShadow: 'var(--shadow-xs)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                  Matières affectées
                </p>
                <p className="text-lg font-bold" style={{ color: 'var(--color-text-main)', fontSize: '20px' }}>
                  {stats.matieresUniques}
                </p>
              </div>
              <div className="p-2 rounded" style={{ background: 'var(--color-bg-alt)' }}>
                <Layers className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-card)] rounded-lg p-4" style={{ boxShadow: 'var(--shadow-xs)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                  Volume horaire total
                </p>
                <p className="text-lg font-bold" style={{ color: 'var(--color-text-main)', fontSize: '20px' }}>
                  {stats.totalHeures}h
                </p>
              </div>
              <div className="p-2 rounded" style={{ background: 'var(--color-info-light)' }}>
                <Clock className="h-4 w-4" style={{ color: 'var(--color-info)' }} />
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-card)] rounded-lg p-4" style={{ boxShadow: 'var(--shadow-xs)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                  Coefficient moyen
                </p>
                <p className="text-lg font-bold" style={{ color: 'var(--color-text-main)', fontSize: '20px' }}>
                  {stats.moyenneCoeff}
                </p>
              </div>
              <div className="p-2 rounded" style={{ background: 'var(--color-success-light)' }}>
                <TrendingUp className="h-4 w-4" style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-card)] rounded-lg p-4" style={{ boxShadow: 'var(--shadow-xs)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                  Enseignants affectés
                </p>
                <p className="text-lg font-bold" style={{ color: 'var(--color-text-main)', fontSize: '20px' }}>
                  {stats.enseignantsUniques}
                </p>
              </div>
              <div className="p-2 rounded" style={{ background: 'var(--color-accent-light)' }}>
                <UserCheck className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs et recherche */}
        <div className="bg-[var(--color-bg-card)] rounded-lg p-4 mb-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between mb-4">
            {/* Tabs */}
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveTab("matieres")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${activeTab === "matieres" ? "text-white" : "hover:bg-[var(--color-neutral-200)]"}`}
                style={activeTab === "matieres" ? {
                  background: 'var(--gradient-primary)',
                  boxShadow: 'var(--shadow-xs)',
                } : {
                  color: 'var(--color-text-muted)',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Matières</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("affectations")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${activeTab === "affectations" ? "text-white" : "hover:bg-[var(--color-neutral-200)]"}`}
                style={activeTab === "affectations" ? {
                  background: 'var(--gradient-primary)',
                  boxShadow: 'var(--shadow-xs)',
                } : {
                  color: 'var(--color-text-muted)',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Affectations</span>
                </div>
              </button>
            </div>

            {/* Recherche */}
            <div className="relative w-full lg:w-56">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--color-text-light)' }} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border transition-colors text-sm"
                style={{
                  borderColor: 'var(--color-neutral-300)',
                  backgroundColor: 'var(--color-neutral-50)',
                  color: 'var(--color-text-main)',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Bouton d'action selon l'onglet */}
            {activeTab === "matieres" && (
              <button
                onClick={() => setModalOpen(true)}
                disabled={matieresDisponibles.length === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover-lift whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{
                  background: matieresDisponibles.length === 0 ? 'var(--color-neutral-300)' : 'var(--gradient-primary)',
                  color: 'var(--color-text-on-primary)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <Plus className="h-3.5 w-3.5" />
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
                    <th className="py-2 px-4 text-left font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-main)', fontSize: '11px' }}>
                      Code
                    </th>
                    <th className="py-2 px-4 text-left font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-main)', fontSize: '11px' }}>
                      Matière
                    </th>
                    <th className="py-2 px-4 text-left font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-main)', fontSize: '11px' }}>
                      Coef.
                    </th>
                    <th className="py-2 px-4 text-left font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-main)', fontSize: '11px' }}>
                      Heures
                    </th>
                    <th className="py-2 px-4 text-left font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-main)', fontSize: '11px' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatieres.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center">
                        <BookOpen className="h-10 w-10 mx-auto mb-2.5" style={{ color: 'var(--color-neutral-300)' }} />
                        <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-main)', fontSize: '14px' }}>
                          Aucune matière affectée
                        </p>
                        <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
                          {searchTerm ? "Aucun résultat pour votre recherche" : "Commencez par affecter une matière"}
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
                        <td className="py-2.5 px-4">
                          <div className="font-medium text-sm" style={{ color: 'var(--color-text-main)', fontSize: '14px' }}>
                            {m.code}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="text-sm" style={{ color: 'var(--color-text-main)', fontSize: '14px' }}>{m.libelle}</div>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              background: 'var(--color-success-light)',
                              color: 'var(--color-success)',
                              fontSize: '12px'
                            }}>
                            {m.coefficient}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" style={{ color: 'var(--color-info)' }} />
                            <span className="font-medium text-sm" style={{ color: 'var(--color-text-main)', fontSize: '14px' }}>{m.volumeHoraire}h</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEdit(m)}
                              className="p-1.5 rounded transition-all duration-200 hover-lift hover:shadow-xs"
                              style={{
                                background: 'var(--color-warning-light)',
                                color: 'var(--color-warning)',
                              }}
                              aria-label="Modifier"
                              title="Modifier le volume horaire"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMatiere(m.matiereId)}
                              className="p-1.5 rounded transition-all duration-200 hover-lift hover:shadow-xs"
                              style={{
                                background: 'var(--color-danger-light)',
                                color: 'var(--color-danger)',
                              }}
                              aria-label="Supprimer"
                              title="Supprimer cette matière"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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
                    <th className="py-2 px-4 text-left font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-main)', fontSize: '11px' }}>
                      Matière
                    </th>
                    <th className="py-2 px-4 text-left font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-main)', fontSize: '11px' }}>
                      Enseignant
                    </th>
                    <th className="py-2 px-4 text-left font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-main)', fontSize: '11px' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAffectations.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center">
                        <UserCheck className="h-10 w-10 mx-auto mb-2.5" style={{ color: 'var(--color-neutral-300)' }} />
                        <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-main)', fontSize: '14px' }}>
                          Aucune affectation trouvée
                        </p>
                        <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
                          {searchTerm ? "Aucun résultat pour votre recherche" : "Aucun enseignant affecté"}
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
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: 'var(--color-info-light)' }}>
                                <BookOpen className="h-3.5 w-3.5" style={{ color: 'var(--color-info)' }} />
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-sm truncate" style={{ color: 'var(--color-text-main)', fontSize: '14px' }}>
                                  {matiere ? matiere.libelle : `Matière #${a.matiereId}`}
                                </div>
                                {matiere && (
                                  <div className="text-xs" style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
                                    {matiere.code} • {matiere.volumeHoraire}h
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: 'var(--gradient-primary)' }}>
                                <span className="text-xs font-medium" style={{ color: 'var(--color-text-on-primary)', fontSize: '11px' }}>
                                  {a.enseignantPrenom[0]}{a.enseignantNom[0]}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-sm truncate" style={{ color: 'var(--color-text-main)', fontSize: '14px' }}>
                                  {a.enseignantPrenom} {a.enseignantNom}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <Mail className="h-3 w-3" style={{ color: 'var(--color-text-light)' }} />
                                  <div className="text-xs truncate" style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
                                    ID: {a.enseignantId}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => navigate(`/admin/enseignants/${a.enseignantId}`)}
                                className="p-1.5 rounded transition-all duration-200 hover-lift hover:shadow-xs"
                                style={{
                                  background: 'var(--color-neutral-100)',
                                  color: 'var(--color-primary)',
                                }}
                                aria-label="Voir enseignant"
                                title="Voir le profil de l'enseignant"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              
                              <button
                                onClick={() => handleDeleteAffectation(a.id)}
                                disabled={deletingId === a.id}
                                className="p-1.5 rounded transition-all duration-200 hover-lift hover:shadow-xs disabled:opacity-50"
                                style={{
                                  background: 'var(--color-danger-light)',
                                  color: 'var(--color-danger)',
                                }}
                                aria-label="Supprimer l'affectation"
                                title="Supprimer cette affectation"
                              >
                                {deletingId === a.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
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
        <div className={`fixed inset-0 z-50 overflow-y-auto ${editModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-200`}>
          <div
            className="fixed inset-0 bg-[var(--color-neutral-900)]/60 backdrop-blur-sm"
            onClick={() => setEditModalOpen(false)}
          />
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-sm transform rounded-lg bg-[var(--color-bg-card)] p-5 shadow-lg transition-all duration-200"
              style={{
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-neutral-200)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-1.5 rounded" style={{ background: 'var(--color-warning-light)' }}>
                    <Edit2 className="h-4 w-4" style={{ color: 'var(--color-warning)' }} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold" style={{ color: 'var(--color-text-main)', fontSize: '16px' }}>
                      Modifier volume horaire
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
                      {editingMatiere.libelle} ({editingMatiere.code})
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-main)', fontSize: '13px' }}>
                      Volume horaire (heures)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      defaultValue={editingMatiere.volumeHoraire}
                      id="editVolumeHoraire"
                      className="w-full rounded-lg border px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-1 text-sm"
                      style={{
                        borderColor: 'var(--color-neutral-300)',
                        backgroundColor: 'var(--color-neutral-50)',
                        color: 'var(--color-text-main)',
                        fontSize: '14px'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-warning)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-neutral-300)';
                      }}
                    />
                    <p className="mt-1 text-xs" style={{ color: 'var(--color-text-light)', fontSize: '11px' }}>
                      Entre 1 et 100 heures
                    </p>
                  </div>
                  
                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => setEditModalOpen(false)}
                      className="flex-1 rounded-lg px-3.5 py-2.5 font-medium transition-all duration-200 hover:opacity-90 text-sm"
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
                      className="flex-1 rounded-lg px-3.5 py-2.5 font-semibold transition-all duration-200 hover-lift text-sm"
                      style={{
                        background: 'var(--gradient-primary)',
                        color: 'var(--color-text-on-primary)',
                        boxShadow: 'var(--shadow-xs)',
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