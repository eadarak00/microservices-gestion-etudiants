export interface AffectationRequestDto {
  classeId: number;
  matiereId: number;
  enseignantId: number;
}

export interface AffectationUpdateDto {
  enseignantId: number;
}

export interface AffectationResponseDto {
  id: number;
  classeId: number;
  matiereId: number;

  enseignantId: number;
  enseignantNom: string;
  enseignantPrenom: string;
}
