package sn.uasz.m2info.enseignant_service.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AffectationRequestDto {

    @NotNull
    private Long classeId;

    @NotNull
    private Long matiereId;

    @NotNull
    private Long enseignantId;
}
