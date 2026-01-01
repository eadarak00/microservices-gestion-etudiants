package com.university.enseignant.controller;

import com.university.enseignant.dto.EnseignantMatiereCreateDTO;
import com.university.enseignant.dto.EnseignantMatiereDTO;
import com.university.enseignant.service.EnseignantMatiereService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST pour la gestion des affectations enseignant-matière
 * Expose les endpoints pour affecter des enseignants aux matières
 */
@RestController
@RequestMapping("/api/affectations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Affectations", description = "API de gestion des affectations enseignant-matière")
public class EnseignantMatiereController {

    private final EnseignantMatiereService enseignantMatiereService;

    /**
     * Affecte un enseignant à une matière
     */
    @PostMapping
    @Operation(summary = "Affecter un enseignant à une matière", 
               description = "Crée une nouvelle affectation enseignant-matière")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Affectation créée avec succès"),
        @ApiResponse(responseCode = "400", description = "Données invalides"),
        @ApiResponse(responseCode = "404", description = "Enseignant ou matière non trouvé"),
        @ApiResponse(responseCode = "409", description = "Affectation déjà existante")
    })
    public ResponseEntity<EnseignantMatiereDTO> affecterEnseignant(
            @Valid @RequestBody EnseignantMatiereCreateDTO dto) {
        log.info("Requête POST /api/affectations - Création d'une affectation");
        EnseignantMatiereDTO created = enseignantMatiereService.affecter(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Récupère une affectation par son ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Détails d'une affectation", 
               description = "Récupère une affectation par son ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Affectation trouvée"),
        @ApiResponse(responseCode = "404", description = "Affectation non trouvée")
    })
    public ResponseEntity<EnseignantMatiereDTO> getAffectationById(
            @Parameter(description = "ID de l'affectation") @PathVariable Long id) {
        log.info("Requête GET /api/affectations/{} - Récupération d'une affectation", id);
        EnseignantMatiereDTO affectation = enseignantMatiereService.getById(id);
        return ResponseEntity.ok(affectation);
    }

    /**
     * Récupère les matières d'un enseignant pour une année scolaire
     */
    @GetMapping("/enseignant/{enseignantId}")
    @Operation(summary = "Matières d'un enseignant", 
               description = "Récupère toutes les matières d'un enseignant, optionnellement filtrées par année")
    @ApiResponse(responseCode = "200", description = "Liste des matières récupérée")
    public ResponseEntity<List<EnseignantMatiereDTO>> getMatieresByEnseignant(
            @Parameter(description = "ID de l'enseignant") @PathVariable Long enseignantId,
            @Parameter(description = "Année scolaire (optionnel)") @RequestParam(required = false) String anneeScolaire) {
        log.info("Requête GET /api/affectations/enseignant/{} - Année: {}", enseignantId, anneeScolaire);
        
        List<EnseignantMatiereDTO> matieres;
        if (anneeScolaire != null && !anneeScolaire.isEmpty()) {
            matieres = enseignantMatiereService.getMatieresByEnseignantAndAnnee(enseignantId, anneeScolaire);
        } else {
            matieres = enseignantMatiereService.getMatieresByEnseignant(enseignantId);
        }
        
        return ResponseEntity.ok(matieres);
    }

    /**
     * Récupère tous les enseignants d'une matière
     */
    @GetMapping("/matiere/{matiereId}")
    @Operation(summary = "Enseignants d'une matière", 
               description = "Récupère tous les enseignants affectés à une matière")
    @ApiResponse(responseCode = "200", description = "Liste des enseignants récupérée")
    public ResponseEntity<List<EnseignantMatiereDTO>> getEnseignantsByMatiere(
            @Parameter(description = "ID de la matière") @PathVariable Long matiereId) {
        log.info("Requête GET /api/affectations/matiere/{} - Récupération des enseignants", matiereId);
        List<EnseignantMatiereDTO> enseignants = enseignantMatiereService.getEnseignantsByMatiere(matiereId);
        return ResponseEntity.ok(enseignants);
    }

    /**
     * Récupère toutes les affectations pour une année scolaire
     */
    @GetMapping("/annee/{anneeScolaire}")
    @Operation(summary = "Affectations par année", 
               description = "Récupère toutes les affectations pour une année scolaire")
    @ApiResponse(responseCode = "200", description = "Liste des affectations récupérée")
    public ResponseEntity<List<EnseignantMatiereDTO>> getAffectationsByAnnee(
            @Parameter(description = "Année scolaire (ex: 2025-2026)") @PathVariable String anneeScolaire) {
        log.info("Requête GET /api/affectations/annee/{} - Récupération des affectations", anneeScolaire);
        List<EnseignantMatiereDTO> affectations = enseignantMatiereService.getAffectationsByAnnee(anneeScolaire);
        return ResponseEntity.ok(affectations);
    }

    /**
     * Supprime une affectation
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une affectation", 
               description = "Supprime une affectation enseignant-matière")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Affectation supprimée"),
        @ApiResponse(responseCode = "404", description = "Affectation non trouvée")
    })
    public ResponseEntity<Void> deleteAffectation(
            @Parameter(description = "ID de l'affectation") @PathVariable Long id) {
        log.info("Requête DELETE /api/affectations/{} - Suppression d'une affectation", id);
        enseignantMatiereService.deleteAffectation(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Supprime toutes les affectations d'un enseignant
     */
    @DeleteMapping("/enseignant/{enseignantId}")
    @Operation(summary = "Supprimer les affectations d'un enseignant", 
               description = "Supprime toutes les affectations d'un enseignant")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Affectations supprimées"),
        @ApiResponse(responseCode = "404", description = "Enseignant non trouvé")
    })
    public ResponseEntity<Void> deleteAffectationsByEnseignant(
            @Parameter(description = "ID de l'enseignant") @PathVariable Long enseignantId) {
        log.info("Requête DELETE /api/affectations/enseignant/{} - Suppression des affectations", enseignantId);
        enseignantMatiereService.deleteAffectationsByEnseignant(enseignantId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Vérifie si une affectation existe
     */
    @GetMapping("/exists")
    @Operation(summary = "Vérifier une affectation", 
               description = "Vérifie si un enseignant est déjà affecté à une matière pour une année")
    @ApiResponse(responseCode = "200", description = "Résultat de la vérification")
    public ResponseEntity<Boolean> existsAffectation(
            @Parameter(description = "ID de l'enseignant") @RequestParam Long enseignantId,
            @Parameter(description = "ID de la matière") @RequestParam Long matiereId,
            @Parameter(description = "Année scolaire") @RequestParam String anneeScolaire) {
        log.info("Requête GET /api/affectations/exists - Vérification d'affectation");
        boolean exists = enseignantMatiereService.existsAffectation(enseignantId, matiereId, anneeScolaire);
        return ResponseEntity.ok(exists);
    }

    /**
     * Compte le nombre de matières d'un enseignant
     */
    @GetMapping("/enseignant/{enseignantId}/count")
    @Operation(summary = "Compter les matières d'un enseignant", 
               description = "Retourne le nombre de matières enseignées par un enseignant")
    @ApiResponse(responseCode = "200", description = "Nombre de matières")
    public ResponseEntity<Long> countMatieresByEnseignant(
            @Parameter(description = "ID de l'enseignant") @PathVariable Long enseignantId) {
        log.info("Requête GET /api/affectations/enseignant/{}/count - Comptage des matières", enseignantId);
        long count = enseignantMatiereService.countMatieresByEnseignant(enseignantId);
        return ResponseEntity.ok(count);
    }
}