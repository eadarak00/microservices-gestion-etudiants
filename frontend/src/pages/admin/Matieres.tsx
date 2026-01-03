import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, BookOpen, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { getMatieres, createMatiere, updateMatiere, deleteMatiere } from "../../services/matiere.service";
import type { Matiere, MatiereCreate, MatiereUpdate } from "../../types/matiere";
import MatiereModal from "../../components/MatiereModal";

const Matieres = () => {
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Matiere | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchMatieres = async () => {
    try {
      setLoading(true);
      const res = await getMatieres();
      setMatieres(res.data);
      setCurrentPage(1); // Retour à la première page après mise à jour
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatieres();
  }, []);

  // Filtrage des matières
  const filteredMatieres = useMemo(() => {
    return matieres.filter((m) =>
      `${m.code} ${m.libelle} ${m.coefficient}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, matieres]);

  // Calcul des données pour la pagination
  const paginatedMatieres = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMatieres.slice(startIndex, endIndex);
  }, [filteredMatieres, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMatieres.length / itemsPerPage);

  const handleSubmit = async (data: MatiereCreate | MatiereUpdate) => {
    try {
      if (selected) {
        await updateMatiere(selected.id, data);
        toast.success("Matière mise à jour !");
      } else {
        await createMatiere(data as MatiereCreate);
        toast.success("Matière ajoutée !");
      }
      setModalOpen(false);
      setSelected(null);
      fetchMatieres();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur serveur");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Supprimer cette matière ?")) {
      await deleteMatiere(id);
      toast.success("Matière supprimée !");
      fetchMatieres();
    }
  };

  // Gestionnaires de pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(currentPage - 2, 1);
      let end = Math.min(start + maxVisiblePages - 1, totalPages);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(end - maxVisiblePages + 1, 1);
      }
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-[fadeInDown_0.5s_ease-out]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/30">
              <BookOpen className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-main)]">
                Gestion des Matières
              </h1>
              <p className="text-[var(--color-text-light)] mt-1">
                {matieres.length} matière{matieres.length > 1 ? "s" : ""} enregistrée{matieres.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar et Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 animate-[fadeIn_0.5s_ease-out_0.1s_both]">
          <div className="flex-1 relative group">
            <Search 
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                isSearchFocused ? "text-[var(--color-primary)] scale-110" : "text-[var(--color-text-muted)]"
              }`}
              size={20}
            />
            <input
              placeholder="Rechercher par code, libellé ou coefficient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border-2 border-[var(--color-neutral-200)] bg-white/80 backdrop-blur-sm focus:border-[var(--color-primary)] focus:bg-white focus:shadow-lg focus:shadow-[var(--color-primary)]/10 outline-none transition-all duration-300 text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)]"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--color-neutral-100)] transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Effacer la recherche"
              >
                <X size={16} className="text-[var(--color-text-muted)]" />
              </button>
            )}
          </div>
          
          <button
            onClick={() => { setSelected(null); setModalOpen(true); }}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-semibold shadow-lg shadow-[var(--color-primary)]/30 hover:shadow-xl hover:shadow-[var(--color-primary)]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Ajouter</span>
          </button>
        </div>

        {/* Sélecteur d'éléments par page */}
        <div className="flex justify-between items-center mb-4 animate-[fadeIn_0.5s_ease-out_0.15s_both]">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-text-light)]">Afficher</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-lg border border-[var(--color-neutral-200)] bg-white text-[var(--color-text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-[var(--color-text-light)]">éléments par page</span>
          </div>
          
          <div className="text-sm text-[var(--color-text-light)]">
            {filteredMatieres.length > 0 ? (
              <>
                Affichage de <span className="font-semibold text-[var(--color-text-main)]">
                  {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredMatieres.length)}
                </span> sur <span className="font-semibold text-[var(--color-text-main)]">{filteredMatieres.length}</span> matière{filteredMatieres.length > 1 ? 's' : ''}
              </>
            ) : (
              "Aucun résultat"
            )}
          </div>
        </div>

        {/* Card Container pour la table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-[var(--color-neutral-200)]/50 border border-[var(--color-neutral-200)]/50 overflow-hidden animate-[fadeIn_0.5s_ease-out_0.2s_both]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[var(--color-neutral-50)] to-[var(--color-neutral-100)]/50">
                  {["Code", "Libellé", "Coefficient", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider"
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
                    <td colSpan={4} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-[var(--color-primary-light)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                        <p className="text-[var(--color-text-light)] font-medium">Chargement...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredMatieres.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-full bg-[var(--color-neutral-100)]">
                          <BookOpen size={32} className="text-[var(--color-text-muted)]" />
                        </div>
                        <p className="text-[var(--color-text-light)] font-medium">Aucune matière trouvée</p>
                        {search && (
                          <button
                            onClick={() => {
                              setSearch("");
                              setCurrentPage(1);
                            }}
                            className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium"
                          >
                            Effacer la recherche
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedMatieres.map((m, idx) => (
                    <tr
                      key={m.id}
                      className="group hover:bg-[var(--color-bg-alt)] transition-all duration-200 animate-[fadeIn_0.3s_ease-out]"
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-secondary-light)] text-[var(--color-primary-dark)] font-semibold text-sm">
                          {m.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
                          <span className="font-semibold text-[var(--color-text-main)]">{m.libelle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r from-[var(--color-primary-light)]/5 to-[var(--color-secondary-light)]/5 text-[var(--color-text-main)] font-semibold text-sm border border-[var(--color-primary)]/20">
                            {m.coefficient}
                          </span>
                          <span className="text-xs text-[var(--color-text-light)] ml-2">
                            {m.coefficient === 1 ? "point" : "points"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => { setSelected(m); setModalOpen(true); }}
                            className="relative p-2.5 rounded-xl bg-gradient-to-r from-[var(--color-warning-light)] to-[var(--color-warning)]/20 text-[var(--color-warning-dark)] hover:from-[var(--color-warning)]/20 hover:to-[var(--color-warning)]/30 hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md group/btn focus:outline-none focus:ring-2 focus:ring-[var(--color-warning)] focus:ring-offset-1"
                            aria-label="Modifier"
                          >
                            <Pencil size={16} strokeWidth={2.5} />
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--color-neutral-800)] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                              Modifier
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="relative p-2.5 rounded-xl bg-gradient-to-r from-[var(--color-danger-light)] to-[var(--color-danger)]/20 text-[var(--color-danger-dark)] hover:from-[var(--color-danger)]/20 hover:to-[var(--color-danger)]/30 hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md group/btn focus:outline-none focus:ring-2 focus:ring-[var(--color-danger)] focus:ring-offset-1"
                            aria-label="Supprimer"
                          >
                            <Trash2 size={16} strokeWidth={2.5} />
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--color-neutral-800)] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                              Supprimer
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filteredMatieres.length > 0 && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-[var(--color-text-light)]">
                  Page <span className="font-semibold text-[var(--color-text-main)]">{currentPage}</span> sur{" "}
                  <span className="font-semibold text-[var(--color-text-main)]">{totalPages}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Bouton Première page */}
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      currentPage === 1
                        ? "text-[var(--color-text-muted)] cursor-not-allowed"
                        : "text-[var(--color-text-main)] hover:bg-[var(--color-neutral-200)] hover:text-[var(--color-primary)]"
                    }`}
                    aria-label="Première page"
                  >
                    <ChevronsLeft size={18} />
                  </button>
                  
                  {/* Bouton Page précédente */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      currentPage === 1
                        ? "text-[var(--color-text-muted)] cursor-not-allowed"
                        : "text-[var(--color-text-main)] hover:bg-[var(--color-neutral-200)] hover:text-[var(--color-primary)]"
                    }`}
                    aria-label="Page précédente"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {/* Numéros de page */}
                  <div className="flex items-center gap-1 mx-2">
                    {getPageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`min-w-[40px] h-10 rounded-lg transition-all duration-200 font-medium ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-md"
                            : "text-[var(--color-text-main)] hover:bg-[var(--color-neutral-200)]"
                        }`}
                        aria-label={`Page ${pageNum}`}
                        aria-current={currentPage === pageNum ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    {/* Indicateur de pages supplémentaires */}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-2 text-[var(--color-text-muted)]">...</span>
                    )}
                  </div>
                  
                  {/* Bouton Page suivante */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      currentPage === totalPages
                        ? "text-[var(--color-text-muted)] cursor-not-allowed"
                        : "text-[var(--color-text-main)] hover:bg-[var(--color-neutral-200)] hover:text-[var(--color-primary)]"
                    }`}
                    aria-label="Page suivante"
                  >
                    <ChevronRight size={18} />
                  </button>
                  
                  {/* Bouton Dernière page */}
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      currentPage === totalPages
                        ? "text-[var(--color-text-muted)] cursor-not-allowed"
                        : "text-[var(--color-text-main)] hover:bg-[var(--color-neutral-200)] hover:text-[var(--color-primary)]"
                    }`}
                    aria-label="Dernière page"
                  >
                    <ChevronsRight size={18} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--color-text-light)]">Aller à la page</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = Math.min(Math.max(1, Number(e.target.value)), totalPages);
                      setCurrentPage(page);
                    }}
                    className="w-16 px-3 py-1.5 rounded-lg border border-[var(--color-neutral-200)] bg-white text-[var(--color-text-main)] text-sm text-center focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <MatiereModal
        open={modalOpen}
        initialData={selected}
        onClose={() => { setModalOpen(false); setSelected(null); }}
        onSubmit={handleSubmit}
      />

      <style>{`
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

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Matieres;