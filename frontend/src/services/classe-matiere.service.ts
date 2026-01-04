import api from "../api/axios";
import type { ClasseMatiereDTO } from "../types/classe-matiere";

const API_URL = "/classe-matieres";
// Liste des matières d'une classe
export const getMatieresParClasse = (classeId: number) =>
  api.get<ClasseMatiereDTO[]>(`${API_URL}/classe/${classeId}`);

// Affecter une matière à une classe
export const affecterMatiere = (classeId: number, matiereId: number, vh: number) =>
  api.post(`${API_URL}?classeId=${classeId}&matiereId=${matiereId}&vh=${vh}`);
