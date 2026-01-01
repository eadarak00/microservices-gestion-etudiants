package com.university.enseignant.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO pour créer une nouvelle affectation enseignant-matière
 * Utilisé pour les opérations POST
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnseignantMatiereCreateDTO {

    @NotNull(message = "L'ID de l'enseignant est obligatoire")
    @Positive(message = "L'ID de l'enseignant doit être positif")
    private Long enseignantId;

    @NotNull(message = "L'ID de la matière est obligatoire")
    @Positive(message = "L'ID de la matière doit être positif")
    private Long matiereId;

    @NotBlank(message = "L'année scolaire est obligatoire")
    @Pattern(regexp = "^\\d{4}-\\d{4}$", message = "L'année scolaire doit être au format YYYY-YYYY (ex: 2025-2026)")
    private String anneeScolaire;

    @PastOrPresent(message = "La date d'affectation ne peut pas être dans le futur")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateAffectation;
}