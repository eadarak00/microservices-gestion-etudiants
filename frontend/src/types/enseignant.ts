import type { EnseignantRequestDto } from "./enseignant-request.dto";
import type { EnseignantResponseDto } from "./enseignant-response.dto";

export type EnseignantCreate = EnseignantRequestDto;
export type EnseignantUpdate = Partial<EnseignantRequestDto>;
export type Enseignant = EnseignantResponseDto;
