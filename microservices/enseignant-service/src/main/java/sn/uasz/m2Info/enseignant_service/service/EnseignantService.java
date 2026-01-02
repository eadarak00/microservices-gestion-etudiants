package sn.uasz.m2Info.enseignant_service.service;

import sn.uasz.m2Info.enseignant_service.dto.EnseignantCreateDTO;
import sn.uasz.m2Info.enseignant_service.dto.EnseignantDTO;
import sn.uasz.m2Info.enseignant_service.dto.EnseignantUpdateDTO;

import java.util.List;

/**
 * Interface du service de gestion des enseignants
 * Définit les opérations métier disponibles
 */
public interface EnseignantService {

    /**
     * Crée un nouvel enseignant
     * 
     * @param dto Données de l'enseignant à créer
     * @return L'enseignant créé
     * @throws DuplicateResourceException si le matricule ou l'email existe déjà
     */
    EnseignantDTO create(EnseignantCreateDTO dto);

    /**
     * Récupère un enseignant par son ID
     * 
     * @param id ID de l'enseignant
     * @return L'enseignant trouvé
     * @throws ResourceNotFoundException si l'enseignant n'existe pas
     */
    EnseignantDTO getById(Long id);

    /**
     * Récupère un enseignant par son matricule
     * 
     * @param matricule Matricule de l'enseignant
     * @return L'enseignant trouvé
     * @throws ResourceNotFoundException si l'enseignant n'existe pas
     */
    EnseignantDTO getByMatricule(String matricule);

    /**
     * Récupère un enseignant avec ses matières
     * 
     * @param id ID de l'enseignant
     * @return L'enseignant avec ses matières enrichies
     */
    EnseignantDTO getByIdWithMatieres(Long id);

    /**
     * Récupère tous les enseignants
     * 
     * @return Liste de tous les enseignants
     */
    List<EnseignantDTO> getAll();

    /**
     * Recherche des enseignants par nom
     * 
     * @param nom Nom à rechercher (insensible à la casse)
     * @return Liste des enseignants trouvés
     */
    List<EnseignantDTO> searchByNom(String nom);

    /**
     * Recherche des enseignants par spécialité
     * 
     * @param specialite Spécialité à rechercher
     * @return Liste des enseignants trouvés
     */
    List<EnseignantDTO> getBySpecialite(String specialite);

    /**
     * Met à jour un enseignant existant
     * 
     * @param id ID de l'enseignant à modifier
     * @param dto Nouvelles données de l'enseignant
     * @return L'enseignant mis à jour
     * @throws ResourceNotFoundException si l'enseignant n'existe pas
     * @throws DuplicateResourceException si l'email existe déjà
     */
    EnseignantDTO update(Long id, EnseignantUpdateDTO dto);

    /**
     * Supprime un enseignant
     * 
     * @param id ID de l'enseignant à supprimer
     * @throws ResourceNotFoundException si l'enseignant n'existe pas
     */
    void delete(Long id);

    /**
     * Vérifie si un enseignant existe par son ID
     * 
     * @param id ID de l'enseignant
     * @return true si l'enseignant existe, false sinon
     */
    boolean existsById(Long id);

    /**
     * Vérifie si un matricule existe
     * 
     * @param matricule Matricule à vérifier
     * @return true si le matricule existe, false sinon
     */
    boolean existsByMatricule(String matricule);

    /**
     * Compte le nombre total d'enseignants
     * 
     * @return Nombre d'enseignants
     */
    long count();
}