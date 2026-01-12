import { useEffect, useMemo, useState } from "react";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  BookOpen, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Filter,
  BarChart3,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getMatieres, createMatiere, updateMatiere, deleteMatiere } from "../../services/matiere.service";
import type { Matiere, MatiereCreate, MatiereUpdate } from "../../types/matiere";
import MatiereModal from "../../components/admin/MatiereModal";

const Matieres = () => {
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Matiere | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [stats, setStats] = useState({
    totalCoeff: 0,
    avgCoeff: 0,
    uniqueCodes: 0
  });

  const fetchMatieres = async () => {
    try {
      setIsRefreshing(true);
      const res = await getMatieres();
      setMatieres(res.data);
      
      const totalCoeff = res.data.reduce((sum, m) => sum + m.coefficient, 0);
      const avgCoeff = res.data.length > 0 ? totalCoeff / res.data.length : 0;
      const uniqueCodes = new Set(res.data.map(m => m.code)).size;
      
      setStats({ totalCoeff, avgCoeff, uniqueCodes });
      setCurrentPage(1);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatieres();
  }, []);

  const filteredMatieres = useMemo(() => {
    return matieres.filter((m) =>
      `${m.code} ${m.libelle} ${m.coefficient}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, matieres]);

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
        toast.success("Matière mise à jour");
      } else {
        await createMatiere(data as MatiereCreate);
        toast.success("Matière créée");
      }
      setModalOpen(false);
      setSelected(null);
      fetchMatieres();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette matière ?")) return;
    
    try {
      await deleteMatiere(id);
      toast.success("Matière supprimée");
      fetchMatieres();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur");
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

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
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-main)] via-white to-[var(--color-neutral-200)] p-4 sm:p-5 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="animate-[slideDown_0.6s_ease-out]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-[var(--color-primary)]/15 to-[var(--color-accent)]/15 rounded-2xl blur-xl"></div>
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/30">
                  <BookOpen className="text-white" size={24} />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[var(--color-text-main)]">
                  Gestion des Matières
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-light)]"></span>
                  {matieres.length} matière{matieres.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchMatieres}
                disabled={isRefreshing}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--color-neutral-200)] bg-white hover:bg-[var(--color-neutral-50)] transition-all duration-200 text-sm ${
                  isRefreshing ? 'cursor-wait' : 'hover:border-[var(--color-primary)]'
                }`}
              >
                <RefreshCw 
                  size={14} 
                  className={`text-[var(--color-text-light)] ${isRefreshing ? 'animate-spin' : ''}`}
                />
                <span className="text-[var(--color-text-muted)]">
                  {isRefreshing ? 'Actualisation...' : 'Actualiser'}
                </span>
              </button>
              
              <button
                onClick={() => { setSelected(null); setModalOpen(true); }}
                className="group relative overflow-hidden flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-medium text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Plus size={16} className="relative z-10" />
                <span className="relative z-10">Nouvelle matière</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-[slideUp_0.6s_ease-out_0.1s_both]">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-[var(--color-neutral-200)] hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-[var(--color-primary-light)]/10">
                <BarChart3 className="text-[var(--color-primary)]" size={18} />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded bg-[var(--color-success-light)] text-[var(--color-success)]">
                TOTAL
              </span>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-1">Coefficient total</h3>
            <p className="text-lg font-semibold text-[var(--color-primary)]">{stats.totalCoeff.toFixed(1)}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-[var(--color-neutral-200)] hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-[var(--color-secondary-light)]/10">
                <TrendingUp className="text-[var(--color-secondary)]" size={18} />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded bg-[var(--color-warning-light)] text-[var(--color-warning)]">
                MOYENNE
              </span>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-1">Coefficient moyen</h3>
            <p className="text-lg font-semibold text-[var(--color-secondary)]">{stats.avgCoeff.toFixed(1)}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-[var(--color-neutral-200)] hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-[var(--color-accent-light)]/10">
                <Filter className="text-[var(--color-accent)]" size={18} />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded bg-[var(--color-info)]/10 text-[var(--color-info)]">
                UNIQUE
              </span>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-1">Codes uniques</h3>
            <p className="text-lg font-semibold text-[var(--color-accent)]">{stats.uniqueCodes}</p>
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
                placeholder="Rechercher matière..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-[var(--color-neutral-200)] bg-white focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all duration-300 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-light)]"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--color-neutral-100)] rounded transition-colors"
                  aria-label="Effacer la recherche"
                >
                  <X size={14} className="text-[var(--color-text-muted)]" />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-text-muted)]">Afficher</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded border border-[var(--color-neutral-200)] bg-white text-[var(--color-text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-neutral-200)]">
            <div className="text-xs text-[var(--color-text-light)]">
              {filteredMatieres.length > 0 ? (
                <>
                  <span className="font-medium text-[var(--color-primary)]">
                    {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredMatieres.length)}
                  </span> sur <span className="font-medium text-[var(--color-primary)]">{filteredMatieres.length}</span>
                </>
              ) : (
                "Aucun résultat"
              )}
            </div>
            
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
              >
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm border border-[var(--color-neutral-200)] overflow-hidden animate-[slideUp_0.6s_ease-out_0.3s_both]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[var(--color-neutral-50)]">
                  {["Code", "Libellé", "Coefficient", "Actions"].map(
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
                    <td colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[var(--color-primary-light)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                        <p className="text-sm text-[var(--color-text-light)]">Chargement...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredMatieres.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                        <BookOpen size={32} className="text-[var(--color-text-muted)]" />
                        <div>
                          <h3 className="text-sm font-medium text-[var(--color-text-main)] mb-1">
                            {search ? "Aucun résultat" : "Aucune matière"}
                          </h3>
                          <p className="text-xs text-[var(--color-text-muted)] mb-4">
                            {search 
                              ? "Essayez d'autres termes de recherche."
                              : "Commencez par ajouter une matière."}
                          </p>
                          {!search && (
                            <button
                              onClick={() => { setSelected(null); setModalOpen(true); }}
                              className="px-4 py-2 rounded bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                              <Plus className="inline mr-1.5" size={14} />
                              Ajouter une matière
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedMatieres.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-[var(--color-bg-alt)] transition-colors duration-200"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[var(--color-primary-light)]/10 text-[var(--color-primary)] text-xs font-medium">
                          {m.code}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></div>
                          <span className="text-sm text-[var(--color-text-main)]">{m.libelle}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-[var(--color-neutral-100)] text-sm font-semibold text-[var(--color-primary-dark)]">
                            {m.coefficient}
                          </span>
                          <span className="text-xs text-[var(--color-text-light)] ml-2">
                            {m.coefficient === 1 ? "point" : "points"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => { setSelected(m); setModalOpen(true); }}
                            className="p-1.5 rounded hover:bg-[var(--color-warning-light)] text-[var(--color-warning)] transition-colors"
                            aria-label="Modifier"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
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

          {/* Pagination */}
          {!loading && filteredMatieres.length > 0 && totalPages > 1 && (
            <div className="px-4 py-3 border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-[var(--color-text-light)]">
                  Page <span className="font-medium text-[var(--color-primary)]">{currentPage}</span> sur{" "}
                  <span className="font-medium text-[var(--color-primary)]">{totalPages}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className={`p-1.5 rounded transition-colors ${
                      currentPage === 1
                        ? "text-[var(--color-neutral-400)] cursor-not-allowed"
                        : "text-[var(--color-text-main)] hover:bg-[var(--color-neutral-200)]"
                    }`}
                    aria-label="Première page"
                  >
                    <ChevronsLeft size={16} />
                  </button>
                  
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`p-1.5 rounded transition-colors ${
                      currentPage === 1
                        ? "text-[var(--color-neutral-400)] cursor-not-allowed"
                        : "text-[var(--color-text-main)] hover:bg-[var(--color-neutral-200)]"
                    }`}
                    aria-label="Page précédente"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex items-center gap-0.5 mx-2">
                    {getPageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`min-w-[32px] h-8 rounded text-sm transition-colors ${
                          currentPage === pageNum
                            ? "bg-[var(--color-primary)] text-white"
                            : "text-[var(--color-text-main)] hover:bg-[var(--color-neutral-200)]"
                        }`}
                        aria-label={`Page ${pageNum}`}
                        aria-current={currentPage === pageNum ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-2 text-[var(--color-text-muted)]">...</span>
                    )}
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-1.5 rounded transition-colors ${
                      currentPage === totalPages
                        ? "text-[var(--color-neutral-400)] cursor-not-allowed"
                        : "text-[var(--color-text-main)] hover:bg-[var(--color-neutral-200)]"
                    }`}
                    aria-label="Page suivante"
                  >
                    <ChevronRight size={16} />
                  </button>
                  
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className={`p-1.5 rounded transition-colors ${
                      currentPage === totalPages
                        ? "text-[var(--color-neutral-400)] cursor-not-allowed"
                        : "text-[var(--color-text-main)] hover:bg-[var(--color-neutral-200)]"
                    }`}
                    aria-label="Dernière page"
                  >
                    <ChevronsRight size={16} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-text-light)]">Aller à</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = Math.min(Math.max(1, Number(e.target.value)), totalPages);
                      setCurrentPage(page);
                    }}
                    className="w-14 px-2 py-1 rounded border border-[var(--color-neutral-200)] bg-white text-[var(--color-text-main)] text-sm text-center focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
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
    </div>
  );
};

export default Matieres;