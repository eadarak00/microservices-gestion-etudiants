import api from "../api/axios";
import type { Inscription, InscriptionCreate } from "../types/inscription";


const BASE_URL = "/inscriptions";


export const createInscription = (data: InscriptionCreate) =>
  api.post<Inscription>(BASE_URL, data);

export const getAllInscriptionEtudiants = (etudiantId : number) => 
    api.get<Inscription[]>(`${BASE_URL}/etudiant/${etudiantId}`)

export const annulerInscription = (id: number) => {
  return api.put(`${BASE_URL}/${id}/annuler`);
};

export const getAllInscriptions = () =>
  api.get<Inscription[]>(BASE_URL);

export const terminerInscriptionAdmin = (id: number) => {
  return api.put(`${BASE_URL}/${id}/terminer`);
};

export const suspendreInscriptionAdmin = (id: number) => {
  return api.put(`${BASE_URL}/${id}/suspendre`);
};