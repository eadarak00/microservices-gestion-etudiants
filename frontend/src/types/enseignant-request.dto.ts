export interface EnseignantRequestDto {
  matricule: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  specialite?: string;
  password: string;
}