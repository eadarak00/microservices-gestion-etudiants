import { useEffect, useState } from "react";
import {
  Plus,
  Calendar,
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  GraduationCap,
  RefreshCw,
  Server,
} from "lucide-react";
import { getStudentId } from "../../services/etudiant.service";
import {
  annulerInscription,
  getAllInscriptionEtudiants,
} from "../../services/inscription.service";
import { getClasseById } from "../../services/classe.service";
import InscriptionModal from "../../components/etudiants/InscriptionModal";
import type { Inscription } from "../../types/inscription";
import type { Classe } from "../../types/classe";
import toast from "react-hot-toast";

interface ClasseInfo {
  data?: Classe;
  loading: boolean;
  error: boolean;
}

const InscriptionsPage = () => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [etudiantId, setEtudiantId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [classesInfo, setClassesInfo] = useState<Map<number, ClasseInfo>>(
    new Map()
  );
  const [scolariteDown, setScolariteDown] = useState(false);

  const loadData = async (id: number) => {
    try {
      setLoading(true);
      const response = await getAllInscriptionEtudiants(id);
      const inscriptionsData = response.data;
      setInscriptions(inscriptionsData);

      // Charger les informations de classe pour chaque inscription
      await loadClassesInfo(inscriptionsData);
    } catch (error) {
      console.error("Erreur lors du chargement des inscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadClassesInfo = async (inscriptionsData: Inscription[]) => {
    const newClassesInfo = new Map<number, ClasseInfo>();
    const classeIds = [...new Set(inscriptionsData.map((i) => i.classeId))];

    for (const classeId of classeIds) {
      newClassesInfo.set(classeId, { loading: true, error: false });
    }
    setClassesInfo(newClassesInfo);

    // Vérifier si le service scolarité est disponible
    try {
      setScolariteDown(false);
      for (const classeId of classeIds) {
        try {
          const response = await getClasseById(classeId);
          newClassesInfo.set(classeId, {
            data: response.data,
            loading: false,
            error: false,
          });
        } catch (error) {
          console.warn(
            `Service scolarité indisponible pour la classe ${classeId}:`,
            error
          );
          newClassesInfo.set(classeId, {
            loading: false,
            error: true,
          });
          setScolariteDown(true);
        }
      }
    } catch (error) {
      console.error("Erreur générale du service scolarité:", error);
      setScolariteDown(true);
    }

    setClassesInfo(new Map([...newClassesInfo]));
  };

  useEffect(() => {
    const init = async () => {
      try {
        const id = await getStudentId();
        setEtudiantId(id);
        if (id) {
          await loadData(id);
        }
      } catch (error) {
        console.error("Erreur d'initialisation:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const filteredInscriptions = inscriptions.filter((inscription) => {
    const classeInfo = classesInfo.get(inscription.classeId);
    const libelleClasse = classeInfo?.data?.libelle?.toLowerCase() || "";
    const matchesSearch =
      inscription.classeId?.toString().includes(searchTerm) ||
      libelleClasse.includes(searchTerm.toLowerCase()) ||
      inscription.dateInscription
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || inscription.etat === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (etat: string) => {
    switch (etat) {
      case "ACTIF":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "SUSPENDU":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "ANNULE":
        return <XCircle className="h-5 w-5 text-rose-500" />;
      case "TERMINE":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (etat: string) => {
    switch (etat) {
      case "ACTIF":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "SUSPENDU":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "ANNULE":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "TERMINE":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (etat: string) => {
    switch (etat) {
      case "ACTIF":
        return "Actif";
      case "SUSPENDU":
        return "Suspendu";
      case "ANNULE":
        return "Annulé";
      case "TERMINE":
        return "Terminé";
      default:
        return etat;
    }
  };

  const getClasseDisplay = (classeId: number) => {
    const info = classesInfo.get(classeId);

    if (info?.loading) {
      return (
        <div className="flex items-center gap-2">
          <div className="animate-pulse h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      );
    }

    if (info?.error || scolariteDown) {
      return (
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-amber-500" />
          <span className="text-gray-700">Classe #{classeId}</span>
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            Service indisponible
          </span>
        </div>
      );
    }

    return info?.data?.libelle || `Classe #${classeId}`;
  };

  const stats = {
    total: inscriptions.length,
    actifs: inscriptions.filter((i) => i.etat === "ACTIF").length,
    suspendus: inscriptions.filter((i) => i.etat === "SUSPENDU").length,
    annules: inscriptions.filter((i) => i.etat === "ANNULE").length,
    termines: inscriptions.filter((i) => i.etat === "TERMINE").length,
  };

  const handleAnnuler = async (id: number) => {
    if (!confirm("Voulez-vous vraiment annuler cette inscription ?")) return;

    try {
      await annulerInscription(id);
      toast.success("Inscription annulée avec succès");
      if (etudiantId) await loadData(etudiantId);
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      toast.error("Impossible d'annuler l'inscription");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mes inscriptions
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez vos inscriptions aux différentes classes
              </p>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary-light)]  to-[var(--color-primary)]  text-white font-semibold rounded-xl hover:from-[var(--color-primary)]  hover:to-[var(--color-primary-dark)]  transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Nouvelle inscription
            </button>
          </div>

          {scolariteDown && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Server className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-amber-800 font-medium">
                    Service scolarité temporairement indisponible
                  </p>
                  <p className="text-amber-700 text-sm mt-1">
                    Certaines informations de classe peuvent ne pas être
                    affichées. L'ID de la classe sera utilisé à la place.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-[var(--color-primary-light)] " />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">
                    {stats.actifs}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Suspendus</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">
                    {stats.suspendus}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terminés</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {stats.termines}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Autres</p>
                  <p className="text-2xl font-bold text-gray-600 mt-1">
                    {stats.annules}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par classe, ID ou date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]  focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="ACTIF">Actifs</option>
                <option value="SUSPENDU">Suspendus</option>
                <option value="ANNULE">Annulés</option>
                <option value="TERMINE">Terminés</option>
              </select>
              <button className="px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Filter className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => etudiantId && loadData(etudiantId)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mb-4"></div>
            <p className="text-gray-600">Chargement des inscriptions...</p>
          </div>
        ) : filteredInscriptions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <GraduationCap className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {inscriptions.length === 0
                ? "Aucune inscription"
                : "Aucun résultat"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {inscriptions.length === 0
                ? "Commencez par créer votre première inscription"
                : "Aucune inscription ne correspond à votre recherche"}
            </p>
            {inscriptions.length === 0 && (
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary-light)] text-white font-medium rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                <Plus size={20} />
                Créer une inscription
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <p className="text-sm font-semibold text-gray-600">CLASSE</p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm font-semibold text-gray-600">
                    DATE D'INSCRIPTION
                  </p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm font-semibold text-gray-600">STATUT</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-600 text-right">
                    ACTION
                  </p>
                </div>
              </div>
            </div>

            {/* Inscriptions List */}
            <div className="divide-y divide-gray-100">
              {filteredInscriptions.map((inscription) => (
                <div
                  key={inscription.id}
                  className="px-6 py-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <BookOpen className="h-5 w-5 text-[var(--color-primary)]" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {getClasseDisplay(inscription.classeId)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            ID: {inscription.id} • Classe:{" "}
                            {inscription.classeId}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p>
                          {new Date(
                            inscription.dateInscription
                          ).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(inscription.etat)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            inscription.etat
                          )}`}
                        >
                          {getStatusText(inscription.etat)}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <div className="flex items-center gap-2">
                        {/* Annuler uniquement si pas déjà annulée ou terminée */}
                        {inscription.etat !== "ANNULE" &&
                          inscription.etat !== "TERMINE" && (
                            <button
                              title="Annuler l'inscription"
                              onClick={() => handleAnnuler(inscription.id)}
                              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {filteredInscriptions.length} inscription
                  {filteredInscriptions.length > 1 ? "s" : ""} sur{" "}
                  {inscriptions.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty state illustration */}
        {!loading && inscriptions.length === 0 && (
          <div className="mt-8 text-center">
            <div className="inline-block p-8 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl">
              <div className="text-4xl mb-4">📚</div>
              <p className="text-gray-600 italic">
                Votre parcours académique commence ici
              </p>
            </div>
          </div>
        )}
      </div>

      <InscriptionModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => etudiantId && loadData(etudiantId)}
      />
    </div>
  );
};

export default InscriptionsPage;
