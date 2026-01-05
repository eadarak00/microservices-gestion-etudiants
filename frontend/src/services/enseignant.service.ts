import api from "../api/axios";
import type { Enseignant, EnseignantCreate, EnseignantUpdate } from "../types/enseignant";


const BASE_URL = "/enseignants";

export const getEnseignants = () =>
  api.get<Enseignant[]>(BASE_URL);

export const getEnseignantById = (id: number) =>
  api.get<Enseignant>(`${BASE_URL}/${id}`);

export const creerEnseignant = (data: EnseignantCreate) =>
  api.post<Enseignant>(BASE_URL, data);

export const modifierEnseignant = (
  id: number,
  data: EnseignantUpdate
) =>
  api.put<Enseignant>(`${BASE_URL}/${id}`, data);

export const supprimerEnseignant = (id: number) =>
  api.delete(`${BASE_URL}/${id}`);
