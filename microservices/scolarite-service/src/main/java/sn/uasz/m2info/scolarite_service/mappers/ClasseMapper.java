package sn.uasz.m2info.scolarite_service.mappers;

import sn.uasz.m2info.scolarite_service.entities.Classe;
import sn.uasz.m2info.scolarite_service.dtos.ClasseRequestDto;
import sn.uasz.m2info.scolarite_service.dtos.ClasseResponseDto;

public class ClasseMapper {

    private ClasseMapper(){}

    public static Classe toEntity(ClasseRequestDto dto) {
        Classe c = new Classe();
        c.setLibelle(dto.getLibelle());
        c.setNiveau(dto.getNiveau());
        c.setAnneeAcademique(dto.getAnneeAcademique());
        return c;
    }

    public static ClasseResponseDto toDto(Classe c) {
        ClasseResponseDto dto = new ClasseResponseDto();
        dto.setId(c.getId());
        dto.setLibelle(c.getLibelle());
        dto.setNiveau(c.getNiveau());
        dto.setAnneeAcademique(c.getAnneeAcademique());
        return dto;
    }

    public static void updateEntity(Classe c, ClasseRequestDto dto) {
        c.setLibelle(dto.getLibelle());
        c.setNiveau(dto.getNiveau());
        c.setAnneeAcademique(dto.getAnneeAcademique());
    }
}