import api from "../api/axios";
import type {
  Etudiant,
  EtudiantCreate,
  EtudiantUpdate,
} from "../types/etudiant";
import { getUserEmail } from "./token.service";

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

/** 
 * Récupérer un étudiant par email
*/
export const getEtudiantParEmail = ( email : string) =>
  api.get<Etudiant>(`${API_URL}/email/${email}`);


/**
 * Recuperer l'id de d'etudiant
*/
export const getStudentId = async (): Promise<number | null> => {
  const email = getUserEmail();

  if (!email) return null;

  try {
    const res = await getEtudiantParEmail(email);
    return res.data.id;
  } catch (e) {
    console.error("Erreur récupération étudiant par email", e);
    return null;
  }
};