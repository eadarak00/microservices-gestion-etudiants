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
} from "lucide-react";
import { toast } from "react-hot-toast";

import { getEnseignantById } from "../../services/enseignant.service";
import {
  getAffectationsParEnseignant,
  supprimerAffectation,
} from "../../services/affectation.service";

import type { Enseignant } from "../../types/enseignant";
import type { AffectationResponseDto } from "../../types/affectation";
import AffectationModal from "../../components/Affectation";
import { getClasseById } from "../../services/classe.service";
import { getMatiereById } from "../../services/matiere.service";

const EnseignantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const enseignantId = Number(id);

  const [enseignant, setEnseignant] = useState<Enseignant | null>(null);
  const [affectations, setAffectations] = useState<AffectationResponseDto[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [classesMap, setClassesMap] = useState<Record<number, string>>({});
  const [matieresMap, setMatieresMap] = useState<Record<number, string>>({});

  /* =========================
      FETCH LIBELLES
  ========================== */
  const fetchLibelles = async () => {
    const classeIds = Array.from(new Set(affectations.map((a) => a.classeId)));
    const matiereIds = Array.from(
      new Set(affectations.map((a) => a.matiereId))
    );

    const classesRes = await Promise.all(classeIds.map((id) => getClasseById(id)));
    const matieresRes = await Promise.all(matiereIds.map((id) => getMatiereById(id)));

    setClassesMap(
      classesRes.reduce((acc, res) => ({ ...acc, [res.data.id]: res.data.libelle }), {})
    );
    setMatieresMap(
      matieresRes.reduce((acc, res) => ({ ...acc, [res.data.id]: res.data.libelle }), {})
    );
  };

  /* =========================
      FETCH DATA
  ========================== */
  const fetchEnseignant = async () => {
    const res = await getEnseignantById(enseignantId);
    setEnseignant(res.data);
  };

  const fetchAffectations = async () => {
    const res = await getAffectationsParEnseignant(enseignantId);
    setAffectations(res.data);
    await fetchLibelles(); // mettre à jour les libellés après chaque fetch
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
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette affectation ? Cette action est irréversible."
      )
    )
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
          <p className="text-lg font-medium" style={{ color: "var(--color-text-main)" }}>
            Chargement du profil enseignant...
          </p>
        </div>
      </div>
    );
  }

  if (!enseignant) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg-main)" }}>
        <div className="text-center max-w-md mx-auto p-8 rounded-2xl" style={{ background: "var(--color-bg-card)", boxShadow: "var(--shadow-md)" }}>
          <User className="h-16 w-16 mx-auto mb-4" style={{ color: "var(--color-neutral-300)" }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>
            Enseignant introuvable
          </h2>
          <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>
            L'enseignant que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => navigate("/admin/enseignants")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover-lift mx-auto"
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
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ background: "var(--color-bg-main)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/enseignants")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover-lift mb-4"
            style={{ color: "var(--color-text-muted)", backgroundColor: "var(--color-neutral-200)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </button>
        </div>

        {/* Profil enseignant */}
        <div className="mb-8 bg-[var(--color-bg-card)] rounded-2xl p-6" style={{ boxShadow: "var(--shadow-md)" }}>
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: "var(--gradient-primary)" }}>
                    <span style={{ color: "var(--color-text-on-primary)" }}>
                      {enseignant.prenom[0]}
                      {enseignant.nom[0]}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-2 rounded-full" style={{ background: "var(--color-accent)" }}>
                    <User className="h-4 w-4" style={{ color: "var(--color-neutral-900)" }} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--color-text-main)" }}>
                        {enseignant.prenom} {enseignant.nom}
                      </h1>
                      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                        Matricule : <span className="font-medium">{enseignant.matricule}</span>
                      </p>
                    </div>
                    <span
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
                      style={{ background: "var(--color-bg-alt)", color: "var(--color-primary)" }}
                    >
                      {enseignant.specialite}
                    </span>
                  </div>

                  {/* Informations de contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--color-neutral-100)" }}>
                      <div className="p-2 rounded-lg" style={{ background: "var(--color-bg-alt)" }}>
                        <Mail className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Email</p>
                        <p className="font-medium" style={{ color: "var(--color-text-main)" }}>{enseignant.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--color-neutral-100)" }}>
                      <div className="p-2 rounded-lg" style={{ background: "var(--color-bg-alt)" }}>
                        <Phone className="h-4 w-4" style={{ color: "var(--color-secondary)" }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Téléphone</p>
                        <p className="font-medium" style={{ color: "var(--color-text-main)" }}>{enseignant.telephone || "Non renseigné"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section affectations */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                <ClipboardList className="h-6 w-6" style={{ color: "var(--color-text-on-primary)" }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "var(--color-text-main)" }}>Affectations</h2>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Liste des classes et matières attribuées</p>
              </div>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all duration-200 hover-lift whitespace-nowrap"
              style={{ background: "var(--gradient-primary)", color: "var(--color-text-on-primary)", boxShadow: "var(--shadow-md)" }}
            >
              <Plus className="h-5 w-5" />
              Nouvelle affectation
            </button>
          </div>

          <div className="bg-[var(--color-bg-card)] rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
            {affectations.length === 0 ? (
              <div className="py-16 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4" style={{ color: "var(--color-neutral-300)" }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--color-text-main)" }}>Aucune affectation</h3>
                <p className="mb-6 max-w-md mx-auto" style={{ color: "var(--color-text-muted)" }}>
                  Cet enseignant n'est actuellement affecté à aucune classe ni matière. Commencez par créer une nouvelle affectation.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover-lift"
                  style={{ background: "var(--gradient-primary)", color: "var(--color-text-on-primary)", boxShadow: "var(--shadow-sm)" }}
                >
                  <Plus className="h-4 w-4" />
                  Créer une affectation
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "var(--color-bg-alt)" }}>
                      <th className="py-4 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: "var(--color-text-main)" }}>
                        <div className="flex items-center gap-2"><Users className="h-4 w-4" />Classe</div>
                      </th>
                      <th className="py-4 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: "var(--color-text-main)" }}>
                        <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" />Matière</div>
                      </th>
                      <th className="py-4 px-6 text-left font-medium text-sm uppercase tracking-wider" style={{ color: "var(--color-text-main)" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affectations.map((affectation) => (
                      <tr key={affectation.id} className="border-b transition-colors hover:bg-[var(--color-bg-alt)]" style={{ borderColor: "var(--color-neutral-200)" }}>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: "var(--color-success-light)" }}>
                              <span className="font-bold" style={{ color: "var(--color-success)" }}>
                                {classesMap[affectation.classeId]?.slice(0, 2) || String(affectation.classeId).slice(-2)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium" style={{ color: "var(--color-text-main)" }}>
                                {classesMap[affectation.classeId] || `Classe #${affectation.classeId}`}
                              </div>
                              <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                ID: {affectation.classeId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: "var(--color-info-light)" }}>
                              <BookOpen className="h-4 w-4" style={{ color: "var(--color-info)" }} />
                            </div>
                            <div>
                              <div className="font-medium" style={{ color: "var(--color-text-main)" }}>
                                {matieresMap[affectation.matiereId] || `Matière #${affectation.matiereId}`}
                              </div>
                              <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                ID: {affectation.matiereId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(affectation.id)}
                              disabled={deletingId === affectation.id}
                              className="p-2.5 rounded-lg transition-all duration-200 hover-lift disabled:opacity-50"
                              style={{ background: "var(--color-danger-light)", color: "var(--color-danger)" }}
                              aria-label="Supprimer l'affectation"
                            >
                              {deletingId === affectation.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Statistiques */}
          {affectations.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--color-bg-card)] rounded-xl p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Total affectations</p>
                    <p className="text-2xl font-bold" style={{ color: "var(--color-text-main)" }}>{affectations.length}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: "var(--color-bg-alt)" }}>
                    <ClipboardList className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-bg-card)] rounded-xl p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Matières distinctes</p>
                    <p className="text-2xl font-bold" style={{ color: "var(--color-text-main)" }}>
                      {new Set(affectations.map((a) => matieresMap[a.matiereId] || a.matiereId)).size}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: "var(--color-success-light)" }}>
                    <BookOpen className="h-6 w-6" style={{ color: "var(--color-success)" }} />
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-bg-card)] rounded-xl p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Classes distinctes</p>
                    <p className="text-2xl font-bold" style={{ color: "var(--color-text-main)" }}>
                      {new Set(affectations.map((a) => classesMap[a.classeId] || a.classeId)).size}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: "var(--color-info-light)" }}>
                    <Users className="h-6 w-6" style={{ color: "var(--color-info)" }} />
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
