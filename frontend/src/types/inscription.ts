import type { InscriptionRequest } from "./inscription-request.dto";
import type { InscriptionResponse } from "./inscription-response.dto";

export type InscriptionCreate = InscriptionRequest;
export type InscriptionUpdate = Partial<InscriptionRequest>;
export type Inscription = InscriptionResponse;
