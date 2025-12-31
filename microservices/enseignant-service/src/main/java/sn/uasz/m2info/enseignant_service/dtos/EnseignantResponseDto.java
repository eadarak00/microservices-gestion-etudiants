package sn.uasz.m2info.enseignant_service.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EnseignantResponseDto {

    private Long id;
    private String matricule;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String specialite;
}
