export interface EnseignantResponseDto {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  specialite?: string;
}
