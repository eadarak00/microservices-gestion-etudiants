package sn.uasz.m2info.etudiant_service.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InscriptionRequestDto {

    @NotNull
    private Long etudiantId;

    @NotNull
    private Long classeId;
}