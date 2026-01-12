import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, Users, X, Mail, Phone, UserCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getEtudiants,
  createEtudiant,
  updateEtudiant,
  deleteEtudiant,
} from "../../services/etudiant.service";
import type { Etudiant, EtudiantCreate, EtudiantUpdate } from "../../types/etudiant";
import EtudiantModal from "../../components/admin/EtudiantModal";

const Etudiants = () => {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Etudiant | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const fetchEtudiants = async () => {
    try {
      setLoading(true);
      const res = await getEtudiants();
      setEtudiants(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEtudiants();
  }, []);

  const filteredEtudiants = useMemo(() => {
    return etudiants.filter((e) =>
      `${e.nom} ${e.prenom} ${e.matricule}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, etudiants]);

  const handleSubmit = async (data: EtudiantCreate | EtudiantUpdate) => {
    try {
      if (selected) {
        await updateEtudiant(selected.id, data);
        toast.success("Étudiant mis à jour");
      } else {
        await createEtudiant(data as EtudiantCreate);
        toast.success("Étudiant ajouté");
      }
      setModalOpen(false);
      setSelected(null);
      fetchEtudiants();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur serveur");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Supprimer cet étudiant ?")) {
      await deleteEtudiant(id);
      toast.success("Étudiant supprimé");
      fetchEtudiants();
    }
  };

  // Statistiques
  const stats = useMemo(() => {
    const hommes = etudiants.filter(e => e.sexe === 'M').length;
    const femmes = etudiants.filter(e => e.sexe === 'F').length;
    const avecEmail = etudiants.filter(e => e.email).length;
    const avecTelephone = etudiants.filter(e => e.telephone).length;
    
    return { hommes, femmes, avecEmail, avecTelephone };
  }, [etudiants]);

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
                  <Users className="text-white" size={22} />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[var(--color-text-main)]">
                  Étudiants
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-light)]"></span>
                  {etudiants.length} étudiant{etudiants.length > 1 ? "s" : ""} enregistré{etudiants.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setSelected(null); setModalOpen(true); }}
                className="group relative overflow-hidden flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-medium text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Plus size={16} className="relative z-10" />
                <span className="relative z-10">Nouvel étudiant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-[slideUp_0.6s_ease-out_0.1s_both]">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-[var(--color-neutral-200)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-md bg-[var(--color-primary-light)]/10">
                <UserCheck className="text-[var(--color-primary)]" size={14} />
              </div>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--color-success-light)] text-[var(--color-success)]">
                HOMMES
              </span>
            </div>
            <p className="text-lg font-semibold text-[var(--color-primary)]">{stats.hommes}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Étudiants masculins</p>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-[var(--color-neutral-200)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-md bg-[var(--color-accent-light)]/10">
                <Users className="text-[var(--color-accent)]" size={14} />
              </div>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--color-warning-light)] text-[var(--color-warning)]">
                FEMMES
              </span>
            </div>
            <p className="text-lg font-semibold text-[var(--color-accent)]">{stats.femmes}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Étudiantes féminines</p>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-[var(--color-neutral-200)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-md bg-[var(--color-secondary-light)]/10">
                <Mail className="text-[var(--color-secondary)]" size={14} />
              </div>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--color-info)]/10 text-[var(--color-info)]">
                EMAIL
              </span>
            </div>
            <p className="text-lg font-semibold text-[var(--color-secondary)]">{stats.avecEmail}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Avec email</p>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-[var(--color-neutral-200)]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-md bg-[var(--color-primary-light)]/10">
                <Phone className="text-[var(--color-primary)]" size={14} />
              </div>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--color-success-light)] text-[var(--color-success)]">
                TÉLÉPHONE
              </span>
            </div>
            <p className="text-lg font-semibold text-[var(--color-primary)]">{stats.avecTelephone}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Avec téléphone</p>
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
                placeholder="Rechercher étudiant..."
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
              {filteredEtudiants.length > 0 ? (
                <>
                  <span className="font-medium text-[var(--color-primary)]">{filteredEtudiants.length}</span> étudiant{filteredEtudiants.length > 1 ? "s" : ""} trouvé{filteredEtudiants.length > 1 ? "s" : ""}
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
                  {["Matricule", "Nom", "Prénom", "Email", "Téléphone", "Sexe", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[var(--color-neutral-200)]"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--color-neutral-100)]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[var(--color-primary-light)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                        <p className="text-sm text-[var(--color-text-light)]">Chargement...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredEtudiants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                        <Users size={32} className="text-[var(--color-text-muted)]" />
                        <div>
                          <h3 className="text-sm font-medium text-[var(--color-text-main)] mb-1">
                            {search ? "Aucun résultat" : "Aucun étudiant"}
                          </h3>
                          <p className="text-xs text-[var(--color-text-muted)] mb-4">
                            {search 
                              ? "Essayez d'autres termes de recherche."
                              : "Commencez par ajouter un étudiant."}
                          </p>
                          {!search && (
                            <button
                              onClick={() => { setSelected(null); setModalOpen(true); }}
                              className="px-4 py-2 rounded bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                              <Plus className="inline mr-1.5" size={14} />
                              Ajouter un étudiant
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEtudiants.map((e) => (
                    <tr
                      key={e.id}
                      className="hover:bg-[var(--color-bg-alt)] transition-colors duration-200 group"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[var(--color-primary-light)]/10 text-[var(--color-primary)] text-xs font-medium">
                          {e.matricule}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-[var(--color-text-main)]">{e.nom}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-[var(--color-text-main)]">{e.prenom}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} className="text-[var(--color-text-light)]" />
                          <span className="text-sm text-[var(--color-text-main)] truncate max-w-[150px]">
                            {e.email || <span className="text-[var(--color-text-muted)] italic">-</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-[var(--color-text-light)]" />
                          <span className="text-sm text-[var(--color-text-main)]">
                            {e.telephone || <span className="text-[var(--color-text-muted)] italic">-</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                          e.sexe === "M" 
                            ? "bg-[var(--color-primary-light)]/20 text-[var(--color-primary)]" 
                            : "bg-[var(--color-accent-light)]/20 text-[var(--color-accent)]"
                        }`}>
                          {e.sexe}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 opacity-100 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setSelected(e); setModalOpen(true); }}
                            className="p-1.5 rounded hover:bg-[var(--color-warning-light)] text-[var(--color-warning)] transition-colors"
                            aria-label="Modifier"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(e.id)}
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
          {!loading && filteredEtudiants.length > 0 && (
            <div className="px-4 py-3 border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-xs text-[var(--color-text-light)]">
                  Affichage de <span className="font-medium text-[var(--color-primary)]">{filteredEtudiants.length}</span> étudiant{filteredEtudiants.length > 1 ? "s" : ""}
                  {search && (
                    <> sur <span className="font-medium text-[var(--color-primary)]">{etudiants.length}</span> total</>
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
      <EtudiantModal
        open={modalOpen}
        initialData={selected}
        onClose={() => { setModalOpen(false); setSelected(null); }}
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

export default Etudiants;