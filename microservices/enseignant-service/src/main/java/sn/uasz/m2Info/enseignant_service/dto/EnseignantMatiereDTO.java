package sn.uasz.m2Info.enseignant_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO pour représenter une affectation enseignant-matière (réponse)
 * Utilisé pour les opérations GET
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EnseignantMatiereDTO {

    private Long id;
    
    private Long enseignantId;
    
    private Long matiereId;
    
    private String anneeScolaire;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateAffectation;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateCreation;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateModification;
    
    // Informations de l'enseignant (optionnel)
    private EnseignantDTO enseignant;
    
    // Informations de la matière (récupérées depuis classe-service)
    private MatiereDetailsDTO matiereDetails;
    
    /**
     * DTO interne pour les détails de la matière
     * (récupérés depuis le microservice classe-service)
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MatiereDetailsDTO {
        private Long id;
        private String codeMatiere;
        private String nomMatiere;
    }
}