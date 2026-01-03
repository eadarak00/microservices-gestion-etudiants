import type { EtudiantRequestDto } from "./etudiant-request.dto";
import type { EtudiantResponseDto } from "./etudiant-response.dto";

export type EtudiantCreate = EtudiantRequestDto;
export type EtudiantUpdate = Partial<EtudiantRequestDto>;
export type Etudiant = EtudiantResponseDto;
