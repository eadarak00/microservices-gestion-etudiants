package sn.uasz.m2info.notes_service.dtos;

import lombok.Data;

@Data
public class ClasseDto {
    private Long id;
    private String libelle;
    private Integer niveau;
    private String anneeAcademique;
}
