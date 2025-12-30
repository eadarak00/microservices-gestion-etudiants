package sn.uasz.m2info.etudiant_service.dtos;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class EtudiantRequestDto {

    @NotBlank
    private String matricule;

    @NotBlank
    private String nom;

    @NotBlank
    private String prenom;

    private LocalDate dateNaissance;
    private String adresse;

    @Email(message = "Email invalide")
    private String email;

    @Pattern(regexp = "^(\\+221|221)?7\\d{8}$", message = "Numéro sénégalais invalide")
    private String telephone;

    @Pattern(regexp = "[MF]", message = "Le sexe doit être 'M' ou 'F'")
    private String sexe;
    private String password;
}
