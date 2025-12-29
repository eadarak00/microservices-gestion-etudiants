package sn.uasz.m2info.etudiant_service.dtos;

import java.time.LocalDate;
import lombok.Data;

@Data
public class EtudiantResponseDto {

    private Long id;
    private String matricule;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String adresse;
    private String email;
    private String telephone;
    private String sexe;
}
