package sn.uasz.m2info.scolarite_service.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClasseMatiereDTO {

    private Long matiereId;
    private String code;
    private String libelle;
    private Integer coefficient;
    private Integer volumeHoraire;
}
