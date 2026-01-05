import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Filter, Loader2, Users, ChevronDown, Eye } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  getEnseignants,
  supprimerEnseignant,
} from "../../services/enseignant.service";

import EnseignantModal from "../../components/EnseignantModal";
import type { Enseignant } from "../../types/enseignant";

const Enseignants = () => {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Enseignant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialite, setFilterSpecialite] = useState("");

  const fetchEnseignants = async () => {
    try {
      const res = await getEnseignants();
      setEnseignants(res.data);
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnseignants();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet enseignant ? Cette action est irréversible.")) return;

    try {
      await supprimerEnseignant(id);
      toast.success("Enseignant supprimé avec succès");
      fetchEnseignants();
    } catch {
      toast.error("Impossible de supprimer l'enseignant");
    }
  };

  // Filtrage des enseignants
  const filteredEnseignants = enseignants.filter(enseignant => {
    const matchesSearch = 
      enseignant.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enseignant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enseignant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enseignant?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterSpecialite || enseignant.specialite === filterSpecialite;
    
    return matchesSearch && matchesFilter;
  });

  // Récupération des spécialités uniques pour le filtre
  const specialites = [...new Set(enseignants.map(e => e.specialite))].filter(Boolean);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--color-bg-main)' }}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
          <p className="text-lg font-medium" style={{ color: 'var(--color-text-main)' }}>
            Chargement des enseignants...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--color-bg-main)' }}>
      {/* En-tête */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg" style={{ background: 'var(--color-bg-alt)' }}>
              <Users className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-main)' }}>
              Gestion des Enseignants
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Gérez les informations et les profils des enseignants de l'institution
          </p>
        </div>

        {/* Barre d'actions */}
        <div className="bg-[var(--color-bg-card)] rounded-xl p-6 mb-6" style={{ boxShadow: 'var(--shadow-md)' }}>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Recherche et filtres */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-light)' }} />
                <input
                  type="text"
                  placeholder="Rechercher un enseignant..."
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
              
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors"
                  style={{
                    borderColor: 'var(--color-neutral-300)',
                    backgroundColor: 'var(--color-neutral-50)',
                    color: 'var(--color-text-main)',
                  }}
                  onClick={() => setFilterSpecialite(filterSpecialite ? "" : specialites[0] || "")}
                >
                  <Filter className="h-4 w-4" />
                  <span>{filterSpecialite || "Toutes spécialités"}</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </div>
                {filterSpecialite && (
                  <button
                    onClick={() => setFilterSpecialite("")}
                    className="absolute -top-2 -right-2 bg-[var(--color-danger)] text-white rounded-full p-1"
                    style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Bouton d'ajout */}
            <button
              onClick={() => {
                setSelected(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover-lift whitespace-nowrap"
              style={{
                background: 'var(--gradient-primary)',
                color: 'var(--color-text-on-primary)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <Plus className="h-5 w-5" />
              Nouvel enseignant
            </button>
          </div>
        </div>

          {/* Statistiques */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--color-bg-card)] rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Total enseignants</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>{enseignants.length}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--color-bg-alt)' }}>
                <Users className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-card)] rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Spécialités</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>{specialites.length}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--color-success-light)' }}>
                <Filter className="h-6 w-6" style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-card)] rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Affichés</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>{filteredEnseignants.length}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--color-info-light)' }}>
                <Eye className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des enseignants */}
        <div className="bg-[var(--color-bg-card)] rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-md)' }}>
          {/* En-tête du tableau */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--color-neutral-200)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-main)' }}>
                  Liste des enseignants
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {filteredEnseignants.length} enseignant{filteredEnseignants.length !== 1 ? 's' : ''} trouvé{filteredEnseignants.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Corps du tableau */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--color-bg-alt)' }}>
                  <th className="py-3 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-main)' }}>
                    <div className="flex items-center gap-2">
                      <span>Matricule</span>
                    </div>
                  </th>
                  <th className="py-3 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-main)' }}>
                    Enseignant
                  </th>
                  <th className="py-3 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-main)' }}>
                    Contact
                  </th>
                  <th className="py-3 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-main)' }}>
                    Spécialité
                  </th>
                  <th className="py-3 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: 'var(--color-text-main)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEnseignants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <Users className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--color-neutral-300)' }} />
                      <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-main)' }}>
                        Aucun enseignant trouvé
                      </p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        {searchTerm || filterSpecialite ? "Essayez de modifier vos critères de recherche" : "Commencez par ajouter un nouvel enseignant"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredEnseignants.map((enseignant) => (
                    <tr 
                      key={enseignant.id} 
                      className="border-b transition-colors hover:bg-[var(--color-bg-alt)]"
                      style={{ borderColor: 'var(--color-neutral-200)' }}
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium" style={{ color: 'var(--color-text-main)' }}>
                          {enseignant.matricule}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center"
                              style={{ background: 'var(--gradient-primary)' }}>
                              <span className="text-sm font-medium" style={{ color: 'var(--color-text-on-primary)' }}>
                                {enseignant.prenom[0]}{enseignant.nom[0]}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="font-medium" style={{ color: 'var(--color-text-main)' }}>
                              {enseignant.prenom} {enseignant.nom}
                            </div>
                            <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                              {enseignant.telephone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div style={{ color: 'var(--color-text-main)' }}>{enseignant.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            background: 'var(--color-bg-alt)',
                            color: 'var(--color-primary)',
                          }}>
                          {enseignant.specialite}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelected(enseignant);
                              setModalOpen(true);
                            }}
                            className="p-2 rounded-lg transition-colors hover-lift"
                            style={{
                              background: 'var(--color-neutral-100)',
                              color: 'var(--color-secondary)',
                            }}
                            aria-label="Modifier"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(enseignant.id)}
                            className="p-2 rounded-lg transition-colors hover-lift"
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
        </div>
      </div>

      {/* Modal */}
      <EnseignantModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        enseignant={selected}
        onSuccess={fetchEnseignants}
      />
    </div>
  );
};

export default Enseignants;