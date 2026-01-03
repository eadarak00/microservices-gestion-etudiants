import api from "../api/axios";
import type {
  Etudiant,
  EtudiantCreate,
  EtudiantUpdate,
} from "../types/etudiant";

const API_URL = "/etudiants";

/**
 * Récupérer tous les étudiants
 */
export const getEtudiants = () =>
  api.get<Etudiant[]>(API_URL);

/**
 * Récupérer un étudiant par ID
 */
export const getEtudiantById = (id: number) =>
  api.get<Etudiant>(`${API_URL}/${id}`);

/**
 * Créer un étudiant
 */
export const createEtudiant = (data: EtudiantCreate) =>
  api.post<Etudiant>(API_URL, data);

/**
 * Mettre à jour un étudiant
 */
export const updateEtudiant = (id: number, data: EtudiantUpdate) =>
  api.put<Etudiant>(`${API_URL}/${id}`, data);

/**
 * Supprimer un étudiant
 */
export const deleteEtudiant = (id: number) =>
  api.delete<void>(`${API_URL}/${id}`);
