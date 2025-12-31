package sn.uasz.m2info.enseignant_service.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class EnseignantRequestDto {

    @NotBlank
    private String matricule;

    @NotBlank
    private String nom;

    @NotBlank
    private String prenom;

    @Email
    private String email;

    @Pattern(regexp = "^(\\+221|221)?7\\d{8}$", message = "Numéro de téléphone invalide")
    private String telephone;

    private String specialite;

    @NotBlank
    private String password;
}
