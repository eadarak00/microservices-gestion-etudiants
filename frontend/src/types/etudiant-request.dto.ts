export interface EtudiantRequestDto {
  matricule: string;
  nom: string;
  prenom: string;

  dateNaissance?: string;
  adresse?: string;

  email?: string;
  telephone?: string;
  sexe?: "M" | "F";

  password?: string;
}
