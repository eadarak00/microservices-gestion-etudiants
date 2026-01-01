package com.university.enseignant.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pour mettre à jour un enseignant existant
 * Utilisé pour les opérations PUT/PATCH
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnseignantUpdateDTO {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 100, message = "Le prénom doit contenir entre 2 et 100 caractères")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email doit être valide")
    private String email;

    @Pattern(regexp = "^(\\+221)?\\d{9}$", message = "Le numéro de téléphone doit être valide (format: +221XXXXXXXXX ou XXXXXXXXX)")
    private String telephone;

    @Size(max = 100, message = "La spécialité ne doit pas dépasser 100 caractères")
    private String specialite;
}