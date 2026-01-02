package sn.uasz.m2Info.enseignant_service.controller;

import sn.uasz.m2Info.enseignant_service.dto.EnseignantCreateDTO;
import sn.uasz.m2Info.enseignant_service.dto.EnseignantDTO;
import sn.uasz.m2Info.enseignant_service.dto.EnseignantMatiereDTO;
import sn.uasz.m2Info.enseignant_service.dto.EnseignantUpdateDTO;
import sn.uasz.m2Info.enseignant_service.service.EnseignantMatiereService;
import sn.uasz.m2Info.enseignant_service.service.EnseignantService;
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
 * Controller REST pour la gestion des enseignants
 * Expose les endpoints CRUD pour les enseignants
 */
@RestController
@RequestMapping("/api/enseignants")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Enseignants", description = "API de gestion des enseignants")
public class EnseignantController {

    private final EnseignantService enseignantService;
    private final EnseignantMatiereService enseignantMatiereService;

    /**
     * Crée un nouvel enseignant
     */
    @PostMapping
    @Operation(summary = "Créer un enseignant", description = "Crée un nouvel enseignant dans le système")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Enseignant créé avec succès"),
        @ApiResponse(responseCode = "400", description = "Données invalides"),
        @ApiResponse(responseCode = "409", description = "Matricule ou email déjà existant")
    })
    public ResponseEntity<EnseignantDTO> createEnseignant(
            @Valid @RequestBody EnseignantCreateDTO dto) {
        log.info("Requête POST /api/enseignants - Création d'un enseignant");
        EnseignantDTO created = enseignantService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Récupère tous les enseignants
     */
    @GetMapping
    @Operation(summary = "Liste des enseignants", description = "Récupère la liste de tous les enseignants")
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public ResponseEntity<List<EnseignantDTO>> getAllEnseignants() {
        log.info("Requête GET /api/enseignants - Récupération de tous les enseignants");
        List<EnseignantDTO> enseignants = enseignantService.getAll();
        return ResponseEntity.ok(enseignants);
    }

    /**
     * Récupère un enseignant par son ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Détails d'un enseignant", description = "Récupère un enseignant par son ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Enseignant trouvé"),
        @ApiResponse(responseCode = "404", description = "Enseignant non trouvé")
    })
    public ResponseEntity<EnseignantDTO> getEnseignantById(
            @Parameter(description = "ID de l'enseignant") @PathVariable Long id) {
        log.info("Requête GET /api/enseignants/{} - Récupération d'un enseignant", id);
        EnseignantDTO enseignant = enseignantService.getById(id);
        return ResponseEntity.ok(enseignant);
    }

    /**
     * Récupère un enseignant par son matricule
     */
    @GetMapping("/matricule/{matricule}")
    @Operation(summary = "Rechercher par matricule", description = "Récupère un enseignant par son matricule")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Enseignant trouvé"),
        @ApiResponse(responseCode = "404", description = "Enseignant non trouvé")
    })
    public ResponseEntity<EnseignantDTO> getEnseignantByMatricule(
            @Parameter(description = "Matricule de l'enseignant") @PathVariable String matricule) {
        log.info("Requête GET /api/enseignants/matricule/{} - Recherche par matricule", matricule);
        EnseignantDTO enseignant = enseignantService.getByMatricule(matricule);
        return ResponseEntity.ok(enseignant);
    }

    /**
     * Recherche des enseignants par nom
     */
    @GetMapping("/search")
    @Operation(summary = "Rechercher par nom", description = "Recherche des enseignants par nom (insensible à la casse)")
    @ApiResponse(responseCode = "200", description = "Résultats de recherche")
    public ResponseEntity<List<EnseignantDTO>> searchByNom(
            @Parameter(description = "Nom à rechercher") @RequestParam String nom) {
        log.info("Requête GET /api/enseignants/search?nom={} - Recherche par nom", nom);
        List<EnseignantDTO> enseignants = enseignantService.searchByNom(nom);
        return ResponseEntity.ok(enseignants);
    }

    /**
     * Récupère les enseignants par spécialité
     */
    @GetMapping("/specialite/{specialite}")
    @Operation(summary = "Filtrer par spécialité", description = "Récupère les enseignants d'une spécialité")
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public ResponseEntity<List<EnseignantDTO>> getBySpecialite(
            @Parameter(description = "Spécialité") @PathVariable String specialite) {
        log.info("Requête GET /api/enseignants/specialite/{} - Filtrage par spécialité", specialite);
        List<EnseignantDTO> enseignants = enseignantService.getBySpecialite(specialite);
        return ResponseEntity.ok(enseignants);
    }

    /**
     * Met à jour un enseignant
     */
    @PutMapping("/{id}")
    @Operation(summary = "Modifier un enseignant", description = "Met à jour les informations d'un enseignant")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Enseignant mis à jour"),
        @ApiResponse(responseCode = "400", description = "Données invalides"),
        @ApiResponse(responseCode = "404", description = "Enseignant non trouvé"),
        @ApiResponse(responseCode = "409", description = "Email déjà existant")
    })
    public ResponseEntity<EnseignantDTO> updateEnseignant(
            @Parameter(description = "ID de l'enseignant") @PathVariable Long id,
            @Valid @RequestBody EnseignantUpdateDTO dto) {
        log.info("Requête PUT /api/enseignants/{} - Mise à jour d'un enseignant", id);
        EnseignantDTO updated = enseignantService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Supprime un enseignant
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un enseignant", description = "Supprime un enseignant du système")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Enseignant supprimé"),
        @ApiResponse(responseCode = "404", description = "Enseignant non trouvé")
    })
    public ResponseEntity<Void> deleteEnseignant(
            @Parameter(description = "ID de l'enseignant") @PathVariable Long id) {
        log.info("Requête DELETE /api/enseignants/{} - Suppression d'un enseignant", id);
        enseignantService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Récupère les matières d'un enseignant
     */
    @GetMapping("/{id}/matieres")
    @Operation(summary = "Matières d'un enseignant", description = "Récupère toutes les matières enseignées par un enseignant")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Liste récupérée"),
        @ApiResponse(responseCode = "404", description = "Enseignant non trouvé")
    })
    public ResponseEntity<List<EnseignantMatiereDTO>> getMatieresByEnseignant(
            @Parameter(description = "ID de l'enseignant") @PathVariable Long id) {
        log.info("Requête GET /api/enseignants/{}/matieres - Récupération des matières", id);
        List<EnseignantMatiereDTO> matieres = enseignantMatiereService.getMatieresByEnseignant(id);
        return ResponseEntity.ok(matieres);
    }

    /**
     * Compte le nombre total d'enseignants
     */
    @GetMapping("/count")
    @Operation(summary = "Compter les enseignants", description = "Retourne le nombre total d'enseignants")
    @ApiResponse(responseCode = "200", description = "Nombre d'enseignants")
    public ResponseEntity<Long> countEnseignants() {
        log.info("Requête GET /api/enseignants/count - Comptage des enseignants");
        long count = enseignantService.count();
        return ResponseEntity.ok(count);
    }
}