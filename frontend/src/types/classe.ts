import type { ClasseRequestDto } from "./classe-request.dto";
import type { ClasseResponseDto } from "./classe-response.dto";

export type ClasseCreate = ClasseRequestDto;
export type ClasseUpdate = Partial<ClasseRequestDto>;
export type Classe = ClasseResponseDto;
