import { useEffect, useState, useRef } from "react";
import {
  Search,
  RefreshCw,
  Server,
  User,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  GraduationCap,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Check,
  Pause,
  // Download,
  Filter,
  ChevronDown,
  // Eye,
  FileText,
  Loader2,
  Shield,
  Users
} from "lucide-react";
import {
  getAllInscriptions,
  suspendreInscriptionAdmin,
  terminerInscriptionAdmin,
} from "../../services/inscription.service";
import { getClasseById } from "../../services/classe.service";
import type { Inscription } from "../../types/inscription";
import type { Classe } from "../../types/classe";
import type { Etudiant } from "../../types/etudiant";
import { getEtudiantById } from "../../services/etudiant.service";
import toast from "react-hot-toast";

interface ClasseInfo {
  data?: Classe;
  loading: boolean;
  error: boolean;
}

interface EtudiantInfo {
  data?: Etudiant;
  loading: boolean;
  error: boolean;
}

interface ServiceStatus {
  scolariteDown: boolean;
  etudiantDown: boolean;
}

const AdminInscriptionsPage = () => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [classesInfo, setClassesInfo] = useState<Map<number, ClasseInfo>>(
    new Map()
  );
  const [etudiantsInfo, setEtudiantsInfo] = useState<Map<number, EtudiantInfo>>(
    new Map()
  );
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    scolariteDown: false,
    etudiantDown: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getAllInscriptions();
      const inscriptionsData = response.data;
      setInscriptions(inscriptionsData);

      await loadAdditionalInfo(inscriptionsData);
    } catch (error) {
      console.error("Erreur lors du chargement des inscriptions:", error);
      toast.error("Erreur lors du chargement des inscriptions");
    } finally {
      setLoading(false);
    }
  };

  const loadAdditionalInfo = async (inscriptionsData: Inscription[]) => {
    const newClassesInfo = new Map<number, ClasseInfo>();
    const newEtudiantsInfo = new Map<number, EtudiantInfo>();

    const classeIds = [...new Set(inscriptionsData.map((i) => i.classeId))];
    const etudiantIds = [...new Set(inscriptionsData.map((i) => i.etudiantId))];

    for (const classeId of classeIds) {
      newClassesInfo.set(classeId, { loading: true, error: false });
    }
    for (const etudiantId of etudiantIds) {
      newEtudiantsInfo.set(etudiantId, { loading: true, error: false });
    }

    setClassesInfo(newClassesInfo);
    setEtudiantsInfo(newEtudiantsInfo);

    let scolariteError = false;
    let etudiantError = false;

    await Promise.all([
      (async () => {
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
            scolariteError = true;
          }
        }
      })(),
      
      (async () => {
        for (const etudiantId of etudiantIds) {
          try {
            const response = await getEtudiantById(etudiantId);
            newEtudiantsInfo.set(etudiantId, {
              data: response.data,
              loading: false,
              error: false,
            });
          } catch (error) {
            console.warn(
              `Service étudiant indisponible pour l'étudiant ${etudiantId}:`,
              error
            );
            newEtudiantsInfo.set(etudiantId, {
              loading: false,
              error: true,
            });
            etudiantError = true;
          }
        }
      })()
    ]);

    setServiceStatus({
      scolariteDown: scolariteError,
      etudiantDown: etudiantError,
    });

    setClassesInfo(new Map([...newClassesInfo]));
    setEtudiantsInfo(new Map([...newEtudiantsInfo]));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTerminer = async (id: number) => {
    if (!confirm("Valider définitivement cette inscription ?")) return;

    try {
      setActionLoading(id);
      await terminerInscriptionAdmin(id);
      toast.success("Inscription acceptée avec succès");
      
      setInscriptions(prev => prev.map(inscription => 
        inscription.id === id 
          ? { ...inscription, etat: "TERMINE" }
          : inscription
      ));
      
      setShowActionMenu(null);
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la validation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspendre = async (id: number) => {
    if (!confirm("Suspendre cette inscription ? L'étudiant ne pourra plus accéder aux ressources de la classe.")) return;

    try {
      setActionLoading(id);
      await suspendreInscriptionAdmin(id);
      toast.success("Inscription suspendue avec succès");
      
      setInscriptions(prev => prev.map(inscription => 
        inscription.id === id 
          ? { ...inscription, etat: "SUSPENDU" }
          : inscription
      ));
      
      setShowActionMenu(null);
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la suspension");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactiver = async (id: number) => {
    if (!confirm("Réactiver cette inscription ?")) return;

    try {
      setActionLoading(id);
      await terminerInscriptionAdmin(id);
      toast.success("Inscription réactivée avec succès");
      
      setInscriptions(prev => prev.map(inscription => 
        inscription.id === id 
          ? { ...inscription, etat: "ACTIF" }
          : inscription
      ));
      
      setShowActionMenu(null);
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la réactivation");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusConfig = (etat: string) => {
    const configs = {
      ACTIF: {
        icon: <CheckCircle className="h-4 w-4" />,
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700",
        borderColor: "border-emerald-200",
        dotColor: "bg-emerald-500",
        label: "Actif"
      },
      SUSPENDU: {
        icon: <AlertTriangle className="h-4 w-4" />,
        bgColor: "bg-orange-50",
        textColor: "text-orange-700",
        borderColor: "border-orange-200",
        dotColor: "bg-orange-500",
        label: "Suspendu"
      },
      ANNULE: {
        icon: <XCircle className="h-4 w-4" />,
        bgColor: "bg-rose-50",
        textColor: "text-rose-700",
        borderColor: "border-rose-200",
        dotColor: "bg-rose-500",
        label: "Annulé"
      },
      TERMINE: {
        icon: <CheckCircle className="h-4 w-4" />,
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
        dotColor: "bg-blue-500",
        label: "Terminé"
      },
    };
    return configs[etat as keyof typeof configs] || {
      icon: <Clock className="h-4 w-4" />,
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-200",
      dotColor: "bg-gray-400",
      label: etat
    };
  };

  const getClasseDisplay = (classeId: number) => {
    const info = classesInfo.get(classeId);

    if (info?.loading) {
      return (
        <div className="flex items-center gap-2">
          <div className="animate-pulse h-4 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"></div>
        </div>
      );
    }

    if (info?.error || serviceStatus.scolariteDown) {
      return (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Server className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Classe #{classeId}</p>
            <p className="text-xs text-amber-600">Service temporairement indisponible</p>
          </div>
        </div>
      );
    }

    return info?.data
      ? `${info.data.libelle} • Niveau ${info.data.niveau}`
      : `Classe #${classeId}`;
  };

  const getEtudiantDisplay = (etudiantId: number) => {
    const info = etudiantsInfo.get(etudiantId);

    if (info?.loading) {
      return (
        <div className="flex items-center gap-2">
          <div className="animate-pulse h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"></div>
        </div>
      );
    }

    if (info?.error || serviceStatus.etudiantDown) {
      return (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Server className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Étudiant #{etudiantId}</p>
            <p className="text-xs text-amber-600">Service temporairement indisponible</p>
          </div>
        </div>
      );
    }

    const etudiant = info?.data;
    return etudiant
      ? `${etudiant.prenom} ${etudiant.nom}`
      : `Étudiant #${etudiantId}`;
  };

  const getEtudiantDetails = (etudiantId: number) => {
    const info = etudiantsInfo.get(etudiantId);
    const etudiant = info?.data;

    if (!etudiant || info?.error) return null;

    return (
      <div className="flex items-center gap-3 mt-2">
        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
          INE: {etudiant.matricule}
        </span>
        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
          {etudiant.email}
        </span>
      </div>
    );
  };

  const getClasseDetails = (classeId: number) => {
    const info = classesInfo.get(classeId);
    const classe = info?.data;

    if (!classe || info?.error) return null;

    return (
      <div className="flex items-center gap-3 mt-2">
        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
          Année: {classe.anneeAcademique}
        </span>
      </div>
    );
  };

  const getAvailableActions = (inscription: Inscription) => {
    const actions = [];
    
    if (inscription.etat === "ACTIF") {
      actions.push(
        {
          label: "Accepter définitivement",
          icon: <Check className="h-4 w-4" />,
          onClick: () => handleTerminer(inscription.id),
          color: "text-emerald-600",
          bgColor: "hover:bg-emerald-50"
        },
        {
          label: "Suspendre l'accès",
          icon: <Pause className="h-4 w-4" />,
          onClick: () => handleSuspendre(inscription.id),
          color: "text-orange-600",
          bgColor: "hover:bg-orange-50"
        }
      );
    } else if (inscription.etat === "SUSPENDU") {
      actions.push(
        {
          label: "Réactiver l'inscription",
          icon: <Check className="h-4 w-4" />,
          onClick: () => handleReactiver(inscription.id),
          color: "text-emerald-600",
          bgColor: "hover:bg-emerald-50"
        }
      );
    }
    
    return actions;
  };

  const filteredInscriptions = inscriptions.filter((inscription) => {
    const classeInfo = classesInfo.get(inscription.classeId);
    const etudiantInfo = etudiantsInfo.get(inscription.etudiantId);

    const libelleClasse = classeInfo?.data?.libelle?.toLowerCase() || "";
    const nomEtudiant = etudiantInfo?.data?.nom?.toLowerCase() || "";
    const prenomEtudiant = etudiantInfo?.data?.prenom?.toLowerCase() || "";

    const matchesSearch =
      inscription.id?.toString().includes(searchTerm) ||
      libelleClasse.includes(searchTerm.toLowerCase()) ||
      nomEtudiant.includes(searchTerm.toLowerCase()) ||
      prenomEtudiant.includes(searchTerm.toLowerCase()) ||
      etudiantInfo?.data?.matricule?.includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || inscription.etat === filter;

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInscriptions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredInscriptions.length / itemsPerPage);

  const stats = {
    total: inscriptions.length,
    actifs: inscriptions.filter((i) => i.etat === "ACTIF").length,
    suspendus: inscriptions.filter((i) => i.etat === "SUSPENDU").length,
    annules: inscriptions.filter((i) => i.etat === "ANNULE").length,
    termines: inscriptions.filter((i) => i.etat === "TERMINE").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Gestion des Inscriptions
                </h1>
              </div>
              <p className="text-gray-600">
                Administration et supervision de toutes les inscriptions académiques
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                Actualiser
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                <FileText size={18} />
                Exporter
              </button>
            </div>
          </div>

          {/* Service Status Alerts */}
          {(serviceStatus.scolariteDown || serviceStatus.etudiantDown) && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Server className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-amber-800 font-semibold mb-1">
                      Services temporairement indisponibles
                    </h4>
                    <div className="flex flex-wrap gap-3 text-sm text-amber-700">
                      {serviceStatus.scolariteDown && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          Service Scolarité
                        </span>
                      )}
                      {serviceStatus.etudiantDown && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          Service Étudiants
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" 
                         style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">
                    {stats.actifs}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" 
                         style={{ width: `${(stats.actifs / stats.total) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-emerald-600">
                    {stats.total > 0 ? Math.round((stats.actifs / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terminés</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {stats.termines}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" 
                         style={{ width: `${(stats.termines / stats.total) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-blue-600">
                    {stats.total > 0 ? Math.round((stats.termines / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Suspendus</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {stats.suspendus}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" 
                         style={{ width: `${(stats.suspendus / stats.total) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-orange-600">
                    {stats.total > 0 ? Math.round((stats.suspendus / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Annulés</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">
                    {stats.annules}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl">
                  <XCircle className="h-5 w-5 text-rose-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full" 
                         style={{ width: `${(stats.annules / stats.total) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-rose-600">
                    {stats.total > 0 ? Math.round((stats.annules / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher par ID, nom étudiant, classe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-12 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white appearance-none"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="ACTIF">Actifs</option>
                    <option value="SUSPENDU">Suspendus</option>
                    <option value="ANNULE">Annulés</option>
                    <option value="TERMINE">Terminés</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white"
                >
                  <option value="5">5 / page</option>
                  <option value="10">10 / page</option>
                  <option value="20">20 / page</option>
                  <option value="50">50 / page</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
              <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 mt-4">Chargement des inscriptions...</p>
          </div>
        ) : filteredInscriptions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
              <BookOpen className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {inscriptions.length === 0
                ? "Aucune inscription trouvée"
                : "Aucune inscription ne correspond à votre recherche"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {inscriptions.length === 0
                ? "Commencez par créer des inscriptions dans le système"
                : "Essayez de modifier vos critères de recherche"}
            </p>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <RefreshCw size={18} />
              Recharger les données
            </button>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-4 px-2">
              <p className="text-sm text-gray-600">
                {filteredInscriptions.length} inscription{filteredInscriptions.length > 1 ? 's' : ''} trouvée{filteredInscriptions.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-6">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Inscription</span>
                      </th>
                      <th className="text-left py-4 px-6">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Classe</span>
                      </th>
                      <th className="text-left py-4 px-6">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Étudiant</span>
                      </th>
                      <th className="text-left py-4 px-6">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</span>
                      </th>
                      <th className="text-left py-4 px-6">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</span>
                      </th>
                      <th className="text-left py-4 px-6">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentItems.map((inscription) => {
                      const statusConfig = getStatusConfig(inscription.etat);
                      const availableActions = getAvailableActions(inscription);
                      const isExpanded = expandedRow === inscription.id;
                      
                      return (
                        <>
                          <tr key={inscription.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  <BookOpen className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                  <span className="font-mono font-semibold text-gray-900">
                                    #{inscription.id}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                  <GraduationCap className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {getClasseDisplay(inscription.classeId)}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                                  <User className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {getEtudiantDisplay(inscription.etudiantId)}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="font-medium">
                                    {new Date(inscription.dateInscription).toLocaleDateString("fr-FR", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(inscription.dateInscription).toLocaleTimeString("fr-FR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-2 ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                                  <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`}></span>
                                  {statusConfig.label}
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex items-center justify-end gap-2">
                                {availableActions.length > 0 && (
                                  <div className="flex items-center gap-2">
                                    {availableActions.map((action, index) => (
                                      <button
                                        key={index}
                                        onClick={() => {
                                          if (actionLoading === inscription.id) return;
                                          action.onClick();
                                        }}
                                        disabled={actionLoading === inscription.id}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${action.bgColor} ${action.color} border ${action.color.replace('text-', 'border-')}/20`}
                                      >
                                        {actionLoading === inscription.id ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                          action.icon
                                        )}
                                        <span className="hidden md:inline">
                                          {actionLoading === inscription.id ? '...' : action.label}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="relative" ref={actionMenuRef}>
                                  <button 
                                    onClick={() => {
                                      setShowActionMenu(showActionMenu === inscription.id ? null : inscription.id);
                                      setExpandedRow(isExpanded ? null : inscription.id);
                                    }}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4 rotate-180" />
                                    ) : (
                                      <MoreVertical className="h-4 w-4" />
                                    )}
                                  </button>
                                  
                                  {showActionMenu === inscription.id && (
                                    <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-20">
                                      <div className="p-2">
                                        {availableActions.length > 0 ? (
                                          availableActions.map((action, index) => (
                                            <button
                                              key={index}
                                              onClick={() => {
                                                action.onClick();
                                              }}
                                              disabled={actionLoading === inscription.id}
                                              className={`w-full px-4 py-2.5 text-left flex items-center gap-3 rounded-lg ${action.color} ${action.bgColor} ${index < availableActions.length - 1 ? 'mb-1' : ''}`}
                                            >
                                              {action.icon}
                                              <span>{action.label}</span>
                                            </button>
                                          ))
                                        ) : (
                                          <div className="px-4 py-2.5 text-gray-500 text-sm">
                                            Aucune action disponible
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                          
                          {/* Expanded Row Details */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={6} className="bg-gray-50">
                                <div className="p-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <User className="h-4 w-4 text-emerald-600" />
                                        Informations de l'étudiant
                                      </h4>
                                      {getEtudiantDetails(inscription.etudiantId)}
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-blue-600" />
                                        Informations de la classe
                                      </h4>
                                      {getClasseDetails(inscription.classeId)}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
                <div className="text-sm text-gray-600">
                  Page {currentPage} sur {totalPages} •{" "}
                  {filteredInscriptions.length} inscription{filteredInscriptions.length > 1 ? 's' : ''}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminInscriptionsPage;