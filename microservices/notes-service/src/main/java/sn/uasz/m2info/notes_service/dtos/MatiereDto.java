package sn.uasz.m2info.notes_service.dtos;

import lombok.Data;

@Data
public class MatiereDto {
    private Long id;
    private String code;
    private String libelle;
    private Integer coefficient;
}
