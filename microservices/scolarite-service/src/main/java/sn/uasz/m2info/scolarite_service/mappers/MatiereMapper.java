package sn.uasz.m2info.scolarite_service.mappers;

import sn.uasz.m2info.scolarite_service.dtos.MatiereRequestDto;
import sn.uasz.m2info.scolarite_service.dtos.MatiereResponseDto;
import sn.uasz.m2info.scolarite_service.entities.Matiere;


public class MatiereMapper {

    private MatiereMapper(){}

    public static Matiere toEntity(MatiereRequestDto dto) {
        Matiere m = new Matiere();
        m.setCode(dto.getCode());
        m.setLibelle(dto.getLibelle());
        m.setCoefficient(dto.getCoefficient());
        return m;
    }

    public static MatiereResponseDto toDto(Matiere m) {
        MatiereResponseDto dto = new MatiereResponseDto();
        dto.setId(m.getId());
        dto.setCode(m.getCode());
        dto.setLibelle(m.getLibelle());
        dto.setCoefficient(m.getCoefficient());
        return dto;
    }

    public static void updateEntity(Matiere m, MatiereRequestDto dto) {
        m.setCode(dto.getCode());
        m.setLibelle(dto.getLibelle());
        m.setCoefficient(dto.getCoefficient());
    }
}
