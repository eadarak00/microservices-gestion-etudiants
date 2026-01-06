package sn.uasz.m2info.enseignant_service.dtos;

import lombok.Data;

@Data
public class AffectationResponseDto {

    private Long id;
    private Long classeId;
    private String libelleClase;
    private Long matiereId;
    private String libelleMatiere;

    private Long enseignantId;
    private String enseignantNom;
    private String enseignantPrenom;
}