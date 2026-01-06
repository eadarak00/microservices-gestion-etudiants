import api from "../api/axios";
import type { AffectationRequestDto, AffectationResponseDto, AffectationUpdateDto } from "../types/affectation";


const API_URL = "/affectations";


export const getAffectationsParEnseignant = (enseignantId: number) =>
  api.get<AffectationResponseDto[]>(
    `${API_URL}/enseignant/${enseignantId}`
  );


export const getAffectationsParClasse = (classeId: number) =>
  api.get<AffectationResponseDto[]>(
    `${API_URL}/classe/${classeId}`
  );


export const affecterEnseignant = (
  data: AffectationRequestDto
) =>
  api.post<AffectationResponseDto>(
    API_URL,
    data
  );

export const modifierAffectation = (
  id: number,
  data: AffectationUpdateDto
) =>
  api.put<AffectationResponseDto>(
    `${API_URL}/${id}`,
    data
  );

export const supprimerAffectation = (id: number) =>
  api.delete<void>(`${API_URL}/${id}`);
