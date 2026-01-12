import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  Loader2,
  Users,
  ChevronDown,
  Eye,
  GraduationCap,
  Hash,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  getEnseignants,
  supprimerEnseignant,
} from "../../services/enseignant.service";

import EnseignantModal from "../../components/EnseignantModal";
import type { Enseignant } from "../../types/enseignant";
import { useNavigate } from "react-router-dom";

const Enseignants = () => {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Enseignant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialite, setFilterSpecialite] = useState("");
  const navigate = useNavigate();

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
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet enseignant ? Cette action est irréversible."
      )
    )
      return;

    try {
      await supprimerEnseignant(id);
      toast.success("Enseignant supprimé avec succès");
      fetchEnseignants();
    } catch {
      toast.error("Impossible de supprimer l'enseignant");
    }
  };

  // Filtrage des enseignants
  const filteredEnseignants = enseignants.filter((enseignant) => {
    const matchesSearch =
      enseignant.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enseignant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enseignant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enseignant?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      !filterSpecialite || enseignant.specialite === filterSpecialite;

    return matchesSearch && matchesFilter;
  });

  // Récupération des spécialités uniques pour le filtre
  const specialites = [...new Set(enseignants.map((e) => e.specialite))].filter(
    Boolean
  );

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "var(--color-bg-main)" }}
      >
        <div className="text-center">
          <Loader2
            className="h-10 w-10 animate-spin mx-auto mb-3"
            style={{ color: "var(--color-primary)" }}
          />
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-text-main)", fontSize: '14px' }}
          >
            Chargement des enseignants...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 md:p-5"
      style={{ background: "var(--color-bg-main)", fontFamily: 'var(--font-primary)' }}
    >
      {/* En-tête */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1.5">
            <div
              className="p-2 rounded-lg"
              style={{ background: "var(--gradient-primary)" }}
            >
              <GraduationCap
                className="h-5 w-5"
                style={{ color: "var(--color-text-on-primary)" }}
              />
            </div>
            <div>
              <h1
                className="text-xl font-bold tracking-tight"
                style={{ color: "var(--color-text-main)", fontSize: '20px' }}
              >
                Gestion des Enseignants
              </h1>
              <p className="text-xs" style={{ color: "var(--color-text-muted)", fontSize: '12px' }}>
                Gérez les profils des enseignants de l'institution
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div
            className="bg-[var(--color-bg-card)] rounded-lg p-4"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: "var(--color-text-muted)", fontSize: '11px' }}
                >
                  Total enseignants
                </p>
                <p
                  className="text-xl font-bold tracking-tight"
                  style={{ color: "var(--color-text-main)" }}
                >
                  {enseignants.length}
                </p>
              </div>
              <div
                className="p-2.5 rounded"
                style={{ background: "var(--color-bg-alt)" }}
              >
                <Users
                  className="h-4.5 w-4.5"
                  style={{ color: "var(--color-primary)" }}
                />
              </div>
            </div>
          </div>

          <div
            className="bg-[var(--color-bg-card)] rounded-lg p-4"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: "var(--color-text-muted)", fontSize: '11px' }}
                >
                  Spécialités
                </p>
                <p
                  className="text-xl font-bold tracking-tight"
                  style={{ color: "var(--color-text-main)" }}
                >
                  {specialites.length}
                </p>
              </div>
              <div
                className="p-2.5 rounded"
                style={{ background: "var(--color-success-light)" }}
              >
                <Filter
                  className="h-4.5 w-4.5"
                  style={{ color: "var(--color-success)" }}
                />
              </div>
            </div>
          </div>

          <div
            className="bg-[var(--color-bg-card)] rounded-lg p-4"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: "var(--color-text-muted)", fontSize: '11px' }}
                >
                  Affichés
                </p>
                <p
                  className="text-xl font-bold tracking-tight"
                  style={{ color: "var(--color-text-main)" }}
                >
                  {filteredEnseignants.length}
                </p>
              </div>
              <div
                className="p-2.5 rounded"
                style={{ background: "var(--color-info-light)" }}
              >
                <Eye className="h-4.5 w-4.5" style={{ color: "var(--color-info)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Barre d'actions */}
        <div
          className="bg-[var(--color-bg-card)] rounded-lg p-4 mb-5"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            {/* Recherche et filtres */}
            <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-56">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5"
                  style={{ color: "var(--color-text-light)" }}
                />
                <input
                  type="text"
                  placeholder="Rechercher un enseignant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border transition-colors text-sm"
                  style={{
                    borderColor: "var(--color-neutral-300)",
                    backgroundColor: "var(--color-neutral-50)",
                    color: "var(--color-text-main)",
                    fontSize: '14px'
                  }}
                />
              </div>

              <div className="relative">
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm"
                  style={{
                    borderColor: filterSpecialite ? "var(--color-primary)" : "var(--color-neutral-300)",
                    backgroundColor: "var(--color-neutral-50)",
                    color: "var(--color-text-main)",
                    fontSize: '14px'
                  }}
                  onClick={() =>
                    setFilterSpecialite(
                      filterSpecialite ? "" : specialites[0] || ""
                    )
                  }
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[120px]">{filterSpecialite || "Toutes spécialités"}</span>
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </div>
                {filterSpecialite && (
                  <button
                    onClick={() => setFilterSpecialite("")}
                    className="absolute -top-1.5 -right-1.5 bg-[var(--color-danger)] text-white rounded-full p-0.5"
                    style={{
                      width: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
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
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover-lift whitespace-nowrap text-sm"
              style={{
                background: "var(--gradient-primary)",
                color: "var(--color-text-on-primary)",
                boxShadow: "var(--shadow-sm)",
                fontSize: '14px'
              }}
            >
              <Plus className="h-4 w-4" />
              Nouvel enseignant
            </button>
          </div>
        </div>

        {/* Tableau des enseignants */}
        <div
          className="bg-[var(--color-bg-card)] rounded-lg overflow-hidden"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          {/* En-tête du tableau */}
          <div
            className="p-3 border-b"
            style={{ borderColor: "var(--color-neutral-200)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-base font-semibold"
                  style={{ color: "var(--color-text-main)", fontSize: '15px' }}
                >
                  Liste des enseignants
                </h2>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)", fontSize: '12px' }}
                >
                  {filteredEnseignants.length} enseignant
                  {filteredEnseignants.length !== 1 ? "s" : ""} trouvé
                  {filteredEnseignants.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Corps du tableau */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "var(--color-bg-alt)" }}>
                  <th
                    className="py-2.5 px-4 text-left font-medium text-xs uppercase tracking-wider"
                    style={{ color: "var(--color-text-main)", fontSize: '11px', letterSpacing: '0.05em' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5" />
                      <span>Matricule</span>
                    </div>
                  </th>
                  <th
                    className="py-2.5 px-4 text-left font-medium text-xs uppercase tracking-wider"
                    style={{ color: "var(--color-text-main)", fontSize: '11px', letterSpacing: '0.05em' }}
                  >
                    Enseignant
                  </th>
                  <th
                    className="py-2.5 px-4 text-left font-medium text-xs uppercase tracking-wider"
                    style={{ color: "var(--color-text-main)", fontSize: '11px', letterSpacing: '0.05em' }}
                  >
                    Contact
                  </th>
                  <th
                    className="py-2.5 px-4 text-left font-medium text-xs uppercase tracking-wider"
                    style={{ color: "var(--color-text-main)", fontSize: '11px', letterSpacing: '0.05em' }}
                  >
                    Spécialité
                  </th>
                  <th
                    className="py-2.5 px-4 text-left font-medium text-xs uppercase tracking-wider"
                    style={{ color: "var(--color-text-main)", fontSize: '11px', letterSpacing: '0.05em' }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEnseignants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center">
                      <Users
                        className="h-10 w-10 mx-auto mb-3"
                        style={{ color: "var(--color-neutral-300)" }}
                      />
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: "var(--color-text-main)", fontSize: '14px' }}
                      >
                        Aucun enseignant trouvé
                      </p>
                      <p
                        className="text-xs max-w-md mx-auto"
                        style={{ color: "var(--color-text-muted)", fontSize: '12px' }}
                      >
                        {searchTerm || filterSpecialite
                          ? "Modifiez vos critères de recherche"
                          : "Ajoutez un nouvel enseignant pour commencer"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredEnseignants.map((enseignant) => (
                    <tr
                      key={enseignant.id}
                      className="border-b transition-colors hover:bg-[var(--color-bg-alt)]"
                      style={{ borderColor: "var(--color-neutral-200)" }}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="p-1.5 rounded"
                            style={{ background: "var(--color-neutral-100)" }}
                          >
                            <Hash className="h-3.5 w-3.5" style={{ color: "var(--color-primary)" }} />
                          </div>
                          <div
                            className="font-medium text-sm"
                            style={{ color: "var(--color-text-main)", fontSize: '14px' }}
                          >
                            {enseignant.matricule}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex-shrink-0">
                            <div
                              className="h-9 w-9 rounded-full flex items-center justify-center"
                              style={{ background: "var(--gradient-primary)" }}
                            >
                              <span
                                className="text-xs font-medium"
                                style={{
                                  color: "var(--color-text-on-primary)",
                                  fontSize: '12px'
                                }}
                              >
                                {enseignant.prenom[0]}
                                {enseignant.nom[0]}
                              </span>
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div
                              className="font-medium text-sm truncate"
                              style={{ color: "var(--color-text-main)", fontSize: '14px' }}
                            >
                              {enseignant.prenom} {enseignant.nom}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Phone className="h-3 w-3" style={{ color: "var(--color-text-light)" }} />
                              <div
                                className="text-xs truncate"
                                style={{ color: "var(--color-text-muted)", fontSize: '12px' }}
                              >
                                {enseignant.telephone || "Non renseigné"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" style={{ color: "var(--color-text-light)" }} />
                          <div className="text-sm truncate" style={{ color: "var(--color-text-main)", fontSize: '14px' }}>
                            {enseignant.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: "var(--color-bg-alt)",
                            color: "var(--color-primary)",
                            fontSize: '12px'
                          }}
                        >
                          {enseignant.specialite}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {/* Bouton Voir détails */}
                          <button
                            onClick={() =>
                              navigate(`/admin/enseignants/${enseignant.id}`)
                            }
                            className="p-1.5 rounded transition-all duration-200 hover-lift hover:shadow-xs"
                            style={{
                              background: "var(--color-neutral-100)",
                              color: "var(--color-primary)",
                            }}
                            aria-label="Voir détails"
                            title="Voir le profil détaillé"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Bouton Modifier */}
                          <button
                            onClick={() => {
                              setSelected(enseignant);
                              setModalOpen(true);
                            }}
                            className="p-1.5 rounded transition-all duration-200 hover-lift hover:shadow-xs"
                            style={{
                              background: "var(--color-neutral-100)",
                              color: "var(--color-secondary)",
                            }}
                            aria-label="Modifier"
                            title="Modifier l'enseignant"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>

                          {/* Bouton Supprimer */}
                          <button
                            onClick={() => handleDelete(enseignant.id)}
                            className="p-1.5 rounded transition-all duration-200 hover-lift hover:shadow-xs"
                            style={{
                              background: "var(--color-danger-light)",
                              color: "var(--color-danger)",
                            }}
                            aria-label="Supprimer"
                            title="Supprimer l'enseignant"
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