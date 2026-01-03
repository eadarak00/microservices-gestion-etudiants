import type { MatiereRequestDto } from "./matiere-request.dto";
import type { MatiereResponseDto } from "./matiere-response.dto";

export type MatiereCreate = MatiereRequestDto;
export type MatiereUpdate = Partial<MatiereRequestDto>;
export type Matiere = MatiereResponseDto;
