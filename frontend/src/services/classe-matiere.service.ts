import api from "../api/axios";
import type { ClasseMatiereDTO } from "../types/classe-matiere";

/**
 * Base URL du module classe-matiere
 * (préfixe déjà géré par Axios + Gateway)
 */
const BASE_URL = "/classe-matieres";

/* =========================
   GET – matières par classe
========================= */
export const getMatieresParClasse = (classeId: number) => {
  return api.get<ClasseMatiereDTO[]>(
    `${BASE_URL}/classe/${classeId}`
  );
};

/* =========================
   POST – affecter matière
========================= */
export const affecterMatiere = (
  classeId: number,
  matiereId: number,
  volumeHoraire: number
) => {
  return api.post(BASE_URL, null, {
    params: {
      classeId,
      matiereId,
      vh: volumeHoraire,
    },
  });
};

/* =========================
   PUT – modifier VH
========================= */
export const modifierMatiere = (
  classeId: number,
  matiereId: number,
  volumeHoraire: number
) => {
  return api.put(BASE_URL, null, {
    params: {
      classeId,
      matiereId,
      vh: volumeHoraire,
    },
  });
};

/* =========================
   DELETE – supprimer
========================= */
export const supprimerMatiere = (
  classeId: number,
  matiereId: number
) => {
  return api.delete(BASE_URL, {
    params: {
      classeId,
      matiereId,
    },
  });
};
