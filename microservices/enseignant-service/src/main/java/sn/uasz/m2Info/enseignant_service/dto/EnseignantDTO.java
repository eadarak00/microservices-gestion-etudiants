package sn.uasz.m2Info.enseignant_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO pour représenter un enseignant (réponse)
 * Utilisé pour les opérations GET
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnseignantDTO {

    private Long id;
    
    private String matriculeEns;
    
    private String nom;
    
    private String prenom;
    
    private String email;
    
    private String telephone;
    
    private String specialite;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateCreation;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateModification;
    
    // Liste des matières (optionnel, peut être null si non chargé)
    @Builder.Default
    private List<EnseignantMatiereDTO> matieres = new ArrayList<>();
    
    // Nom complet calculé (utile pour l'affichage)
    public String getNomComplet() {
        return prenom + " " + nom;
    }
}