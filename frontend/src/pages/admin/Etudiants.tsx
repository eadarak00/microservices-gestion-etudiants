import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, Users, X } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getEtudiants,
  createEtudiant,
  updateEtudiant,
  deleteEtudiant,
} from "../../services/etudiant.service";
import type { Etudiant, EtudiantCreate, EtudiantUpdate } from "../../types/etudiant";
import EtudiantModal from "../../components/EtudiantModal";

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
        toast.success("Étudiant mis à jour !");
      } else {
        await createEtudiant(data as EtudiantCreate);
        toast.success("Étudiant ajouté !");
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
      toast.success("Étudiant supprimé !");
      fetchEtudiants();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section avec animation */}
        <div className="mb-8 animate-[fadeInDown_0.5s_ease-out]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/30">
              <Users className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-main)]">
                Gestion des Étudiants
              </h1>
              <p className="text-[var(--color-text-light)] mt-1">
                {etudiants.length} étudiant{etudiants.length > 1 ? "s" : ""} enregistré{etudiants.length > 1 ? "s" : ""}
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
              placeholder="Rechercher par nom, prénom ou matricule..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border-2 border-[var(--color-neutral-200)] bg-white/80 backdrop-blur-sm focus:border-[var(--color-primary)] focus:bg-white focus:shadow-lg focus:shadow-[var(--color-primary)]/10 outline-none transition-all duration-300 text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--color-neutral-100)] transition-all duration-200 opacity-0 group-hover:opacity-100"
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

        {/* Card Container pour la table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-[var(--color-neutral-200)]/50 border border-[var(--color-neutral-200)]/50 overflow-hidden animate-[fadeIn_0.5s_ease-out_0.2s_both]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[var(--color-neutral-50)] to-[var(--color-neutral-100)]/50">
                  {["Matricule", "Nom", "Prénom", "Email", "Téléphone", "Sexe", "Actions"].map(
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
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-[var(--color-primary-light)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                        <p className="text-[var(--color-text-light)] font-medium">Chargement...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredEtudiants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-full bg-[var(--color-neutral-100)]">
                          <Users size={32} className="text-[var(--color-text-muted)]" />
                        </div>
                        <p className="text-[var(--color-text-light)] font-medium">Aucun étudiant trouvé</p>
                        {search && (
                          <button
                            onClick={() => setSearch("")}
                            className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium"
                          >
                            Effacer la recherche
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEtudiants.map((e, idx) => (
                    <tr
                      key={e.id}
                      className="group hover:bg-[var(--color-bg-alt)] transition-all duration-200 animate-[fadeIn_0.3s_ease-out]"
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-secondary-light)] text-[var(--color-primary-dark)] font-semibold text-sm">
                          {e.matricule}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-[var(--color-text-main)]">{e.nom}</td>
                      <td className="px-6 py-4 text-[var(--color-text-main)]">{e.prenom}</td>
                      <td className="px-6 py-4 text-[var(--color-text-main)]">{e.email || <span className="text-[var(--color-text-muted)]">-</span>}</td>
                      <td className="px-6 py-4 text-[var(--color-text-main)]">{e.telephone || <span className="text-[var(--color-text-muted)]">-</span>}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          e.sexe === "M" 
                            ? "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]" 
                            : "bg-[var(--color-accent-light)] text-[var(--color-accent-dark)]"
                        }`}>
                          {e.sexe}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => { setSelected(e); setModalOpen(true); }}
                            className="relative p-2.5 rounded-xl bg-gradient-to-r from-[var(--color-warning-light)] to-[var(--color-warning)]/20 text-[var(--color-warning-dark)] hover:from-[var(--color-warning)]/20 hover:to-[var(--color-warning)]/30 hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md group/btn focus:outline-none focus:ring-2 focus:ring-[var(--color-warning)] focus:ring-offset-1"
                            aria-label="Modifier"
                          >
                            <Pencil size={16} strokeWidth={2.5} />
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--color-neutral-800)] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                              Modifier
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(e.id)}
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
        </div>

        {/* Stats Footer */}
        {!loading && filteredEtudiants.length > 0 && (
          <div className="mt-6 text-center text-sm text-[var(--color-text-light)] animate-[fadeIn_0.5s_ease-out_0.3s_both]">
            Affichage de {filteredEtudiants.length} sur {etudiants.length} étudiant{etudiants.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Modal */}
      <EtudiantModal
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

export default Etudiants;