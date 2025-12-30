package sn.uasz.m2info.scolarite_service.dtos;

import lombok.Data;

@Data
public class ClasseResponseDto {

    private Long id;
    private String libelle;
    private Integer niveau;
    private String anneeAcademique;
}