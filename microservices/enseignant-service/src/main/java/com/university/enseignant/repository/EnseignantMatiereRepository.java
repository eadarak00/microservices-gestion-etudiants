package com.university.enseignant.repository;

import com.university.enseignant.entity.EnseignantMatiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité EnseignantMatiere
 */
@Repository
public interface EnseignantMatiereRepository extends JpaRepository<EnseignantMatiere, Long> {

    /**
     * Récupère toutes les matières d'un enseignant par son ID
     */
    List<EnseignantMatiere> findByEnseignantId(Long enseignantId);

    /**
     * Récupère toutes les affectations pour une matière spécifique
     */
    List<EnseignantMatiere> findByMatiereId(Long matiereId);

    /**
     * Récupère toutes les affectations pour une année scolaire
     */
    List<EnseignantMatiere> findByAnneeScolaire(String anneeScolaire);

    /**
     * Récupère les matières d'un enseignant pour une année scolaire
     */
    List<EnseignantMatiere> findByEnseignantIdAndAnneeScolaire(Long enseignantId, String anneeScolaire);

    /**
     * Récupère une affectation spécifique (enseignant + matière + année)
     */
    Optional<EnseignantMatiere> findByEnseignantIdAndMatiereIdAndAnneeScolaire(
        Long enseignantId, 
        Long matiereId, 
        String anneeScolaire
    );

    /**
     * Vérifie si un enseignant est déjà affecté à une matière pour une année
     */
    boolean existsByEnseignantIdAndMatiereIdAndAnneeScolaire(
        Long enseignantId, 
        Long matiereId, 
        String anneeScolaire
    );

    /**
     * Compte le nombre de matières d'un enseignant
     */
    long countByEnseignantId(Long enseignantId);

    /**
     * Compte le nombre d'enseignants affectés à une matière
     */
    long countByMatiereId(Long matiereId);

    /**
     * Supprime toutes les affectations d'un enseignant
     */
    void deleteByEnseignantId(Long enseignantId);

    /**
     * Supprime toutes les affectations d'une matière
     */
    void deleteByMatiereId(Long matiereId);

    /**
     * Récupère les affectations avec les données de l'enseignant (évite N+1)
     */
    @Query("SELECT em FROM EnseignantMatiere em JOIN FETCH em.enseignant WHERE em.matiereId = :matiereId")
    List<EnseignantMatiere> findByMatiereIdWithEnseignant(@Param("matiereId") Long matiereId);

    /**
     * Récupère toutes les matières uniques enseignées par un enseignant
     */
    @Query("SELECT DISTINCT em.matiereId FROM EnseignantMatiere em WHERE em.enseignant.id = :enseignantId")
    List<Long> findDistinctMatiereIdsByEnseignantId(@Param("enseignantId") Long enseignantId);

    /**
     * Récupère les affectations d'un enseignant avec ses informations
     */
    @Query("SELECT em FROM EnseignantMatiere em JOIN FETCH em.enseignant WHERE em.enseignant.id = :enseignantId")
    List<EnseignantMatiere> findByEnseignantIdWithDetails(@Param("enseignantId") Long enseignantId);
}