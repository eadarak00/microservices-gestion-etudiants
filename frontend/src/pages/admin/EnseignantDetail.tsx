import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  BookOpen,
  Users,
  Loader2,
  ClipboardList,
  School,
  Tag,
  Hash,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { getEnseignantById } from "../../services/enseignant.service";
import {
  getAffectationsParEnseignant,
  supprimerAffectation,
} from "../../services/affectation.service";

import type { Enseignant } from "../../types/enseignant";
import type { AffectationResponseDto } from "../../types/affectation";
import AffectationModal from "../../components/admin/Affectation";
import { getClasseById } from "../../services/classe.service";
import { getMatiereById } from "../../services/matiere.service";

const EnseignantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const enseignantId = Number(id);

  const [enseignant, setEnseignant] = useState<Enseignant | null>(null);
  const [affectations, setAffectations] = useState<AffectationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAffectations, setLoadingAffectations] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [classesMap, setClassesMap] = useState<Record<number, { libelle: string; niveau?: string }>>({});
  const [matieresMap, setMatieresMap] = useState<Record<number, { libelle: string; code?: string }>>({});

  /* =========================
      FETCH LIBELLES
  ========================== */
  const fetchLibelles = async (affects: AffectationResponseDto[]) => {
    try {
      const classeIds = Array.from(new Set(affects.map((a) => a.classeId)));
      const matiereIds = Array.from(new Set(affects.map((a) => a.matiereId)));

      const classesPromises = classeIds.map((id) => 
        getClasseById(id).catch(() => ({ data: { id, libelle: `Classe #${id}`, niveau: 'N/A' } }))
      );
      const matieresPromises = matiereIds.map((id) => 
        getMatiereById(id).catch(() => ({ data: { id, libelle: `Matière #${id}`, code: 'N/A' } }))
      );

      const [classesRes, matieresRes] = await Promise.all([
        Promise.all(classesPromises),
        Promise.all(matieresPromises),
      ]);

      setClassesMap(
        classesRes.reduce((acc, res) => ({ 
          ...acc, 
          [res.data.id]: { 
            libelle: res.data.libelle, 
            niveau: res.data.niveau 
          } 
        }), {})
      );
      
      setMatieresMap(
        matieresRes.reduce((acc, res) => ({ 
          ...acc, 
          [res.data.id]: { 
            libelle: res.data.libelle, 
            code: res.data.code 
          } 
        }), {})
      );
    } catch (error) {
      console.error("Erreur lors du chargement des libellés:", error);
    }
  };

  /* =========================
      FETCH DATA
  ========================== */
  const fetchEnseignant = async () => {
    try {
      const res = await getEnseignantById(enseignantId);
      setEnseignant(res.data);
    } catch (error) {
      throw error;
    }
  };

  const fetchAffectations = async () => {
    setLoadingAffectations(true);
    try {
      const res = await getAffectationsParEnseignant(enseignantId);
      setAffectations(res.data);
      await fetchLibelles(res.data);
    } catch (error) {
      toast.error("Erreur de chargement des affectations");
      setAffectations([]);
    } finally {
      setLoadingAffectations(false);
    }
  };

  useEffect(() => {
    if (!enseignantId || isNaN(enseignantId)) {
      toast.error("ID d'enseignant invalide");
      navigate("/admin/enseignants");
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchEnseignant(), fetchAffectations()]);
      } catch {
        toast.error("Erreur de chargement des données");
        navigate("/admin/enseignants");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [enseignantId]);

  /* =========================
      DELETE
  ========================== */
  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette affectation ? Cette action est irréversible."))
      return;

    try {
      setDeletingId(id);
      await supprimerAffectation(id);
      toast.success("Affectation supprimée avec succès");
      fetchAffectations();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================
      UI STATES
  ========================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg-main)" }}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: "var(--color-primary)" }} />
          <p className="text-base font-medium tracking-tight mb-1" style={{ color: "var(--color-text-main)", fontFamily: 'var(--font-primary)' }}>
            Chargement du profil...
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Préparation des données
          </p>
        </div>
      </div>
    );
  }

  if (!enseignant) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg-main)" }}>
        <div className="text-center max-w-sm mx-auto p-8 rounded-2xl" style={{ background: "var(--color-bg-card)", boxShadow: "var(--shadow-md)" }}>
          <User className="h-16 w-16 mx-auto mb-5" style={{ color: "var(--color-neutral-300)" }} />
          <h2 className="text-xl font-bold mb-2 tracking-tight" style={{ color: "var(--color-text-main)", fontFamily: 'var(--font-primary)' }}>
            Enseignant introuvable
          </h2>
          <p className="mb-6 text-sm" style={{ color: "var(--color-text-muted)", lineHeight: "1.5" }}>
            L'enseignant que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => navigate("/admin/enseignants")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium tracking-wide transition-all duration-200 hover-lift mx-auto"
            style={{ background: "var(--gradient-primary)", color: "var(--color-text-on-primary)", boxShadow: "var(--shadow-sm)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  /* =========================
      RENDER
  ========================== */
  return (
    <div className="min-h-screen p-4 md:p-5 lg:p-6" style={{ 
      background: "var(--color-bg-main)",
      fontFamily: 'var(--font-primary)'
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/enseignants")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium tracking-wide transition-all duration-200 hover-lift mb-5"
            style={{ 
              color: "var(--color-text-muted)", 
              backgroundColor: "var(--color-neutral-200)",
              fontSize: '14px'
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </button>
        </div>

        {/* Profil enseignant */}
        <div className="mb-8 bg-[var(--color-bg-card)] rounded-xl p-5 lg:p-6" style={{ boxShadow: "var(--shadow-md)" }}>
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar et infos principales */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold tracking-tight" style={{ 
                  background: "var(--gradient-primary)",
                  fontFamily: 'var(--font-primary)'
                }}>
                  <span style={{ color: "var(--color-text-on-primary)" }}>
                    {enseignant.prenom[0]}{enseignant.nom[0]}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 rounded-full" style={{ 
                  background: "var(--color-accent)",
                  boxShadow: "var(--shadow-sm)"
                }}>
                  <User className="h-4 w-4" style={{ color: "var(--color-neutral-900)" }} />
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-2xl font-bold tracking-tight mb-2" style={{ 
                    color: "var(--color-text-main)",
                    fontFamily: 'var(--font-primary)'
                  }}>
                    {enseignant.prenom} {enseignant.nom}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5" style={{ color: "var(--color-text-light)" }} />
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        <span className="font-medium">{enseignant.matricule}</span>
                      </p>
                    </div>
                    <div className="h-3 w-px" style={{ background: "var(--color-neutral-300)" }} />
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" style={{ color: "var(--color-primary)" }} />
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        <span className="font-medium">{enseignant.specialite}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <span
                  className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold tracking-wide mt-2 md:mt-0"
                  style={{ 
                    background: "var(--color-bg-alt)", 
                    color: "var(--color-primary)",
                    border: "1px solid var(--color-primary-light)",
                    fontSize: '12px'
                  }}
                >
                  <School className="h-3.5 w-3.5 mr-1.5" />
                  {enseignant.specialite}
                </span>
              </div>

              {/* Informations de contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-xs" style={{ 
                  background: "var(--color-neutral-100)",
                  border: "1px solid var(--color-neutral-200)"
                }}>
                  <div className="p-2 rounded" style={{ background: "var(--gradient-primary)" }}>
                    <Mail className="h-4 w-4" style={{ color: "var(--color-text-on-primary)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider mb-0.5" style={{ color: "var(--color-text-light)", fontSize: '11px' }}>
                      Email
                    </p>
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--color-text-main)" }}>
                      {enseignant.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-xs" style={{ 
                  background: "var(--color-neutral-100)",
                  border: "1px solid var(--color-neutral-200)"
                }}>
                  <div className="p-2 rounded" style={{ background: "var(--gradient-primary)" }}>
                    <Phone className="h-4 w-4" style={{ color: "var(--color-text-on-primary)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider mb-0.5" style={{ color: "var(--color-text-light)", fontSize: '11px' }}>
                      Téléphone
                    </p>
                    <p className="font-semibold text-sm" style={{ color: "var(--color-text-main)" }}>
                      {enseignant.telephone || "Non renseigné"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section affectations */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                <ClipboardList className="h-5 w-5" style={{ color: "var(--color-text-on-primary)" }} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight mb-0.5" style={{ color: "var(--color-text-main)" }}>
                  Affectations
                </h2>
                <p className="text-xs" style={{ color: "var(--color-text-muted)", lineHeight: "1.4" }}>
                  Classes et matières attribuées
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium tracking-wide transition-all duration-200 hover-lift whitespace-nowrap min-w-[180px]"
              style={{ 
                background: "var(--gradient-primary)", 
                color: "var(--color-text-on-primary)", 
                boxShadow: "var(--shadow-sm)",
                fontSize: '14px'
              }}
            >
              <Plus className="h-4 w-4" />
              Nouvelle affectation
            </button>
          </div>

          <div className="bg-[var(--color-bg-card)] rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
            {loadingAffectations ? (
              <div className="py-16 text-center">
                <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" style={{ color: "var(--color-primary)" }} />
                <p className="text-base font-medium mb-1" style={{ color: "var(--color-text-main)" }}>
                  Chargement des affectations...
                </p>
              </div>
            ) : affectations.length === 0 ? (
              <div className="py-16 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-5" style={{ color: "var(--color-neutral-300)" }} />
                <h3 className="text-lg font-semibold mb-2 tracking-tight" style={{ color: "var(--color-text-main)" }}>
                  Aucune affectation
                </h3>
                <p className="mb-6 max-w-md mx-auto text-sm" style={{ color: "var(--color-text-muted)", lineHeight: "1.5" }}>
                  Cet enseignant n'est actuellement affecté à aucune classe ni matière.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium tracking-wide transition-all duration-200 hover-lift"
                  style={{ 
                    background: "var(--gradient-primary)", 
                    color: "var(--color-text-on-primary)", 
                    boxShadow: "var(--shadow-sm)",
                    fontSize: '14px'
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Créer une affectation
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ 
                      background: "var(--color-bg-alt)",
                      borderBottom: "2px solid var(--color-neutral-200)"
                    }}>
                      <th className="py-3 px-5 text-left font-semibold text-xs uppercase tracking-wider" style={{ 
                        color: "var(--color-text-main)",
                        fontSize: '11px',
                        letterSpacing: '0.05em'
                      }}>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded" style={{ background: "var(--color-success-light)" }}>
                            <Users className="h-3.5 w-3.5" style={{ color: "var(--color-success)" }} />
                          </div>
                          <span>Classe</span>
                        </div>
                      </th>
                      <th className="py-3 px-5 text-left font-semibold text-xs uppercase tracking-wider" style={{ 
                        color: "var(--color-text-main)",
                        fontSize: '11px',
                        letterSpacing: '0.05em'
                      }}>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded" style={{ background: "var(--color-info-light)" }}>
                            <BookOpen className="h-3.5 w-3.5" style={{ color: "var(--color-info)" }} />
                          </div>
                          <span>Matière</span>
                        </div>
                      </th>
                      <th className="py-3 px-5 text-left font-semibold text-xs uppercase tracking-wider" style={{ 
                        color: "var(--color-text-main)",
                        fontSize: '11px',
                        letterSpacing: '0.05em'
                      }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {affectations.map((affectation) => {
                      const classeInfo = classesMap[affectation.classeId];
                      const matiereInfo = matieresMap[affectation.matiereId];
                      
                      return (
                        <tr 
                          key={affectation.id} 
                          className="group border-b transition-all duration-200 hover:bg-[var(--color-bg-alt)]"
                          style={{ borderColor: "var(--color-neutral-200)" }}
                        >
                          {/* Colonne Classe */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0" 
                                style={{ 
                                  background: "var(--gradient-primary)",
                                  boxShadow: "var(--shadow-xs)"
                                }}>
                                <span className="font-bold text-xs" style={{ color: "var(--color-text-on-primary)" }}>
                                  {classeInfo?.libelle?.substring(0, 2).toUpperCase() || String(affectation.classeId).slice(-2)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm truncate mb-0.5" style={{ color: "var(--color-text-main)" }}>
                                  {classeInfo?.libelle || `Classe #${affectation.classeId}`}
                                </div>
                                <div className="flex items-center gap-2">
                                  {classeInfo?.niveau && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tracking-wide"
                                      style={{ 
                                        background: "var(--color-success-light)",
                                        color: "var(--color-success)",
                                        fontSize: '10px'
                                      }}>
                                      {classeInfo.niveau}
                                    </span>
                                  )}
                                  <span className="text-xs" style={{ color: "var(--color-text-light)", fontSize: '11px' }}>
                                    ID: {affectation.classeId}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          {/* Colonne Matière */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0" 
                                style={{ 
                                  background: "var(--color-info-light)",
                                  boxShadow: "var(--shadow-xs)"
                                }}>
                                <BookOpen className="h-4 w-4" style={{ color: "var(--color-info)" }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm truncate mb-0.5" style={{ color: "var(--color-text-main)" }}>
                                  {matiereInfo?.libelle || `Matière #${affectation.matiereId}`}
                                </div>
                                <div className="flex items-center gap-2">
                                  {matiereInfo?.code && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tracking-wide"
                                      style={{ 
                                        background: "var(--color-neutral-100)",
                                        color: "var(--color-text-muted)",
                                        border: "1px solid var(--color-neutral-300)",
                                        fontSize: '10px'
                                      }}>
                                      {matiereInfo.code}
                                    </span>
                                  )}
                                  <span className="text-xs" style={{ color: "var(--color-text-light)", fontSize: '11px' }}>
                                    ID: {affectation.matiereId}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          {/* Colonne Actions */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => navigate(`/admin/classes/${affectation.classeId}`)}
                                className="p-2 rounded-lg transition-all duration-200 hover-lift hover:shadow-xs"
                                style={{ 
                                  background: "var(--color-neutral-100)",
                                  color: "var(--color-primary)",
                                  border: "1px solid var(--color-neutral-300)"
                                }}
                                aria-label="Voir la classe"
                                title="Voir les détails de la classe"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              
                              <button
                                onClick={() => handleDelete(affectation.id)}
                                disabled={deletingId === affectation.id}
                                className="p-2 rounded-lg transition-all duration-200 hover-lift hover:shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ 
                                  background: deletingId === affectation.id 
                                    ? "var(--color-neutral-200)" 
                                    : "var(--color-danger-light)",
                                  color: "var(--color-danger)",
                                  border: "1px solid var(--color-danger-light)"
                                }}
                                aria-label="Supprimer l'affectation"
                                title="Supprimer cette affectation"
                              >
                                {deletingId === affectation.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Statistiques */}
          {affectations.length > 0 && !loadingAffectations && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--color-bg-card)] rounded-lg p-5 transition-all duration-200 hover:shadow-sm" style={{ boxShadow: "var(--shadow-xs)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-muted)", letterSpacing: '0.05em', fontSize: '11px' }}>
                      Total affectations
                    </p>
                    <p className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-main)" }}>
                      {affectations.length}
                    </p>
                  </div>
                  <div className="p-2.5 rounded" style={{ background: "var(--color-bg-alt)" }}>
                    <ClipboardList className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-bg-card)] rounded-lg p-5 transition-all duration-200 hover:shadow-sm" style={{ boxShadow: "var(--shadow-xs)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-muted)", letterSpacing: '0.05em', fontSize: '11px' }}>
                      Matières distinctes
                    </p>
                    <p className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-main)" }}>
                      {new Set(affectations.map((a) => matieresMap[a.matiereId]?.libelle || a.matiereId)).size}
                    </p>
                  </div>
                  <div className="p-2.5 rounded" style={{ background: "var(--color-success-light)" }}>
                    <BookOpen className="h-5 w-5" style={{ color: "var(--color-success)" }} />
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-bg-card)] rounded-lg p-5 transition-all duration-200 hover:shadow-sm" style={{ boxShadow: "var(--shadow-xs)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-muted)", letterSpacing: '0.05em', fontSize: '11px' }}>
                      Classes distinctes
                    </p>
                    <p className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-main)" }}>
                      {new Set(affectations.map((a) => classesMap[a.classeId]?.libelle || a.classeId)).size}
                    </p>
                  </div>
                  <div className="p-2.5 rounded" style={{ background: "var(--color-info-light)" }}>
                    <Users className="h-5 w-5" style={{ color: "var(--color-info)" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'affectation */}
      <AffectationModal
        open={modalOpen}
        enseignantId={enseignantId}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchAffectations}
      />
    </div>
  );
};

export default EnseignantDetail;