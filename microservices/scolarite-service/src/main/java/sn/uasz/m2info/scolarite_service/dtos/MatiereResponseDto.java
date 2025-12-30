package sn.uasz.m2info.scolarite_service.dtos;

import lombok.Data;

@Data
public class MatiereResponseDto {

    private Long id;
    private String code;
    private String libelle;
    private Integer coefficient;
}