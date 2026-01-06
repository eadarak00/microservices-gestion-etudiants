package sn.uasz.m2info.enseignant_service.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AffectationUpdateDto {

    @NotNull
    private Long enseignantId;
}
