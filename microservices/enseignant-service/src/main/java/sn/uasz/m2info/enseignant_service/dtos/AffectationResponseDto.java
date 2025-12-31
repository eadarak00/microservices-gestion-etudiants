package sn.uasz.m2info.enseignant_service.dtos;

import lombok.Data;

@Data
public class AffectationResponseDto {

    private Long id;
    private Long classeId;
    private Long matiereId;

    private Long enseignantId;
    private String enseignantNom;
    private String enseignantPrenom;
}