package com.university.enseignant.service;

import com.university.enseignant.dto.EnseignantMatiereCreateDTO;
import com.university.enseignant.dto.EnseignantMatiereDTO;

import java.util.List;

/**
 * Interface du service de gestion des affectations enseignant-matière
 * Définit les opérations métier disponibles
 */
public interface EnseignantMatiereService {

    /**
     * Affecte un enseignant à une matière
     * 
     * @param dto Données de l'affectation
     * @return L'affectation créée avec détails enrichis
     * @throws ResourceNotFoundException si l'enseignant n'existe pas
     * @throws DuplicateResourceException si l'affectation existe déjà
     */
    EnseignantMatiereDTO affecter(EnseignantMatiereCreateDTO dto);

    /**
     * Récupère une affectation par son ID
     * 
     * @param id ID de l'affectation
     * @return L'affectation avec détails enrichis
     * @throws ResourceNotFoundException si l'affectation n'existe pas
     */
    EnseignantMatiereDTO getById(Long id);

    /**
     * Récupère toutes les matières d'un enseignant
     * 
     * @param enseignantId ID de l'enseignant
     * @return Liste des matières avec détails enrichis
     */
    List<EnseignantMatiereDTO> getMatieresByEnseignant(Long enseignantId);

    /**
     * Récupère toutes les matières d'un enseignant pour une année scolaire
     * 
     * @param enseignantId ID de l'enseignant
     * @param anneeScolaire Année scolaire (ex: "2025-2026")
     * @return Liste des matières avec détails enrichis
     */
    List<EnseignantMatiereDTO> getMatieresByEnseignantAndAnnee(Long enseignantId, String anneeScolaire);

    /**
     * Récupère tous les enseignants affectés à une matière
     * 
     * @param matiereId ID de la matière
     * @return Liste des affectations avec détails des enseignants
     */
    List<EnseignantMatiereDTO> getEnseignantsByMatiere(Long matiereId);

    /**
     * Récupère toutes les affectations pour une année scolaire
     * 
     * @param anneeScolaire Année scolaire (ex: "2025-2026")
     * @return Liste de toutes les affectations
     */
    List<EnseignantMatiereDTO> getAffectationsByAnnee(String anneeScolaire);

    /**
     * Supprime une affectation
     * 
     * @param id ID de l'affectation à supprimer
     * @throws ResourceNotFoundException si l'affectation n'existe pas
     */
    void deleteAffectation(Long id);

    /**
     * Supprime toutes les affectations d'un enseignant
     * 
     * @param enseignantId ID de l'enseignant
     */
    void deleteAffectationsByEnseignant(Long enseignantId);

    /**
     * Vérifie si un enseignant est déjà affecté à une matière pour une année
     * 
     * @param enseignantId ID de l'enseignant
     * @param matiereId ID de la matière
     * @param anneeScolaire Année scolaire
     * @return true si l'affectation existe, false sinon
     */
    boolean existsAffectation(Long enseignantId, Long matiereId, String anneeScolaire);

    /**
     * Compte le nombre de matières d'un enseignant
     * 
     * @param enseignantId ID de l'enseignant
     * @return Nombre de matières
     */
    long countMatieresByEnseignant(Long enseignantId);
}