import api from "../api/axios";
import type { Matiere, MatiereCreate, MatiereUpdate } from "../types/matiere";

const API_URL = "/matieres";

export const getMatieres = () => api.get<Matiere[]>(API_URL);

export const getMatiereById = (id: number) => api.get<Matiere>(`${API_URL}/${id}`);

export const createMatiere = (data: MatiereCreate) => api.post<Matiere>(API_URL, data);

export const updateMatiere = (id: number, data: MatiereUpdate) => api.put<Matiere>(`${API_URL}/${id}`, data);

export const deleteMatiere = (id: number) => api.delete<void>(`${API_URL}/${id}`);
