import api from "../api/axios";
import type { Classe, ClasseCreate, ClasseUpdate } from "../types/classe";

const API_URL = "/classes";

export const getClasses = () => api.get<Classe[]>(API_URL);

export const getClasseById = (id: number) => api.get<Classe>(`${API_URL}/${id}`);

export const createClasse = (data: ClasseCreate) => api.post<Classe>(API_URL, data);

export const updateClasse = (id: number, data: ClasseUpdate) => api.put<Classe>(`${API_URL}/${id}`, data);

export const deleteClasse = (id: number) => api.delete<void>(`${API_URL}/${id}`);
