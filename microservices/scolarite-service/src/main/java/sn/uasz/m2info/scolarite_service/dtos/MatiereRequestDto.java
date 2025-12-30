package sn.uasz.m2info.scolarite_service.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MatiereRequestDto {

    @NotBlank
    private String code;

    @NotBlank
    private String libelle;

    @NotNull
    private Integer coefficient;
}