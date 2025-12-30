package sn.uasz.m2info.scolarite_service.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClasseRequestDto {

    @NotBlank
    private String libelle;

    @NotNull
    private Integer niveau;

    @NotBlank
    private String anneeAcademique;
}
