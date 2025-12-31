package sn.uasz.m2info.enseignant_service.mappers;

import sn.uasz.m2info.enseignant_service.dtos.AffectationResponseDto;
import sn.uasz.m2info.enseignant_service.entities.Affectation;

public class AffectationMapper {

    private AffectationMapper() {}

    public static AffectationResponseDto toDto(Affectation a) {
        AffectationResponseDto dto = new AffectationResponseDto();
        dto.setId(a.getId());
        dto.setClasseId(a.getClasseId());
        dto.setMatiereId(a.getMatiereId());
        dto.setEnseignantId(a.getEnseignant().getId());
        dto.setEnseignantNom(a.getEnseignant().getNom());
        dto.setEnseignantPrenom(a.getEnseignant().getPrenom());
        return dto;
    }
}
