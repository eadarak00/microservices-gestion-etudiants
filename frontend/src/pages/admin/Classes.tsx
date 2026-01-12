import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, GraduationCap, X, Eye, Calendar, Hash } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getClasses,
  createClasse,
  updateClasse,
  deleteClasse,
} from "../../services/classe.service";
import type { Classe, ClasseCreate, ClasseUpdate } from "../../types/classe";
import ClasseModal from "../../components/admin/ClasseModal";
import { useNavigate } from "react-router-dom";

const Classes = () => {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Classe | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await getClasses();
      setClasses(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = useMemo(() => {
    return classes.filter((c) =>
      `${c.libelle} ${c.anneeAcademique} ${c.niveau}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, classes]);

  const handleSubmit = async (data: ClasseCreate | ClasseUpdate) => {
    try {
      if (selected) {
        await updateClasse(selected.id, data);
        toast.success("Classe mise à jour");
      } else {
        await createClasse(data as ClasseCreate);
        toast.success("Classe ajoutée");
      }
      setModalOpen(false);
      setSelected(null);
      fetchClasses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur serveur");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Supprimer cette classe ?")) {
      await deleteClasse(id);
      toast.success("Classe supprimée");
      fetchClasses();
    }
  };

  // Calculer les statistiques
  const stats = useMemo(() => {
    const niveauxUniques = new Set(classes.map(c => c.niveau)).size;
    const anneesUniques = new Set(classes.map(c => c.anneeAcademique)).size;
    const moyenneNiveaux = classes.reduce((sum, c) => sum + c.niveau, 0) / classes.length || 0;
    
    return { niveauxUniques, anneesUniques, moyenneNiveaux };
  }, [classes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-main)] via-white to-[var(--color-neutral-200)] p-4 sm:p-5 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header Section */}
        <div className="animate-[slideDown_0.6s_ease-out]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-[var(--color-primary)]/15 to-[var(--color-accent)]/15 rounded-2xl blur-xl"></div>
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/30">
                  <GraduationCap className="text-white" size={22} />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[var(--color-text-main)]">
                  Classes
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-light)]"></span>
                  {classes.length} classe{classes.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => { setSelected(null); setModalOpen(true); }}
              className="group relative overflow-hidden flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-medium text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Plus size={16} className="relative z-10" />
              <span className="relative z-10">Nouvelle classe</span>
            </button>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-[slideUp_0.6s_ease-out_0.1s_both]">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-[var(--color-neutral-200)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-md bg-[var(--color-primary-light)]/10">
                <Hash className="text-[var(--color-primary)]" size={14} />
              </div>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--color-success-light)] text-[var(--color-success)]">
                NIVEAUX
              </span>
            </div>
            <p className="text-lg font-semibold text-[var(--color-primary)]">{stats.niveauxUniques}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Niveaux distincts</p>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-[var(--color-neutral-200)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-md bg-[var(--color-accent-light)]/10">
                <Calendar className="text-[var(--color-accent)]" size={14} />
              </div>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--color-warning-light)] text-[var(--color-warning)]">
                ANNÉES
              </span>
            </div>
            <p className="text-lg font-semibold text-[var(--color-accent)]">{stats.anneesUniques}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Années académiques</p>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-[var(--color-neutral-200)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-md bg-[var(--color-secondary-light)]/10">
                <GraduationCap className="text-[var(--color-secondary)]" size={14} />
              </div>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--color-info)]/10 text-[var(--color-info)]">
                MOYENNE
              </span>
            </div>
            <p className="text-lg font-semibold text-[var(--color-secondary)]">{stats.moyenneNiveaux.toFixed(1)}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Niveau moyen</p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-[var(--color-neutral-200)] animate-[slideUp_0.6s_ease-out_0.2s_both]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search 
                className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${
                  isSearchFocused ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                }`}
                size={16}
              />
              <input
                placeholder="Rechercher une classe..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-[var(--color-neutral-200)] bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all duration-300 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-light)]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--color-neutral-100)] rounded transition-colors"
                  aria-label="Effacer la recherche"
                >
                  <X size={14} className="text-[var(--color-text-muted)]" />
                </button>
              )}
            </div>
            
            <div className="text-xs text-[var(--color-text-light)]">
              {filteredClasses.length > 0 ? (
                <>
                  <span className="font-medium text-[var(--color-primary)]">{filteredClasses.length}</span> classe{filteredClasses.length > 1 ? "s" : ""} trouvée{filteredClasses.length > 1 ? "s" : ""}
                </>
              ) : (
                "Aucun résultat"
              )}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm border border-[var(--color-neutral-200)] overflow-hidden animate-[slideUp_0.6s_ease-out_0.3s_both]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[var(--color-neutral-50)]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[var(--color-neutral-200)]">
                    Libellé
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[var(--color-neutral-200)]">
                    Niveau
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[var(--color-neutral-200)]">
                    Année
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[var(--color-neutral-200)]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--color-neutral-100)]">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[var(--color-primary-light)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                        <p className="text-sm text-[var(--color-text-light)]">Chargement...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                        <GraduationCap size={32} className="text-[var(--color-text-muted)]" />
                        <div>
                          <h3 className="text-sm font-medium text-[var(--color-text-main)] mb-1">
                            {search ? "Aucun résultat" : "Aucune classe"}
                          </h3>
                          <p className="text-xs text-[var(--color-text-muted)] mb-4">
                            {search 
                              ? "Essayez d'autres termes de recherche."
                              : "Commencez par ajouter une classe."}
                          </p>
                          {!search && (
                            <button
                              onClick={() => { setSelected(null); setModalOpen(true); }}
                              className="px-4 py-2 rounded bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                              <Plus className="inline mr-1.5" size={14} />
                              Ajouter une classe
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-[var(--color-bg-alt)] transition-colors duration-200 group"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
                          <span className="text-sm font-medium text-[var(--color-text-main)]">{c.libelle}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[var(--color-primary-light)]/10 text-[var(--color-primary)] text-xs font-medium">
                          Niveau {c.niveau}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-[var(--color-text-light)]" />
                          <span className="text-sm text-[var(--color-text-main)]">{c.anneeAcademique}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 opacity-100 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/admin/classes/${c.id}`)}
                            className="p-1.5 rounded hover:bg-[var(--color-primary-light)] text-[var(--color-primary)] transition-colors"
                            aria-label="Détails"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => { setSelected(c); setModalOpen(true); }}
                            className="p-1.5 rounded hover:bg-[var(--color-warning-light)] text-[var(--color-warning)] transition-colors"
                            aria-label="Modifier"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 rounded hover:bg-[var(--color-danger-light)] text-[var(--color-danger)] transition-colors"
                            aria-label="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer avec stats */}
          {!loading && filteredClasses.length > 0 && (
            <div className="px-4 py-3 border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-xs text-[var(--color-text-light)]">
                  <span className="font-medium text-[var(--color-primary)]">{filteredClasses.length}</span> classe{filteredClasses.length > 1 ? "s" : ""} affichée{filteredClasses.length > 1 ? "s" : ""}
                  {search && (
                    <> sur <span className="font-medium text-[var(--color-primary)]">{classes.length}</span> total</>
                  )}
                </div>
                
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors flex items-center gap-1"
                  >
                    <X size={12} />
                    Effacer la recherche
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ClasseModal
        open={modalOpen}
        initialData={selected}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
        onSubmit={handleSubmit}
      />

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Smooth transitions */
        * {
          transition: background-color var(--transition-normal),
                      border-color var(--transition-normal),
                      transform var(--transition-normal),
                      opacity var(--transition-normal);
        }
      `}</style>
    </div>
  );
};

export default Classes;