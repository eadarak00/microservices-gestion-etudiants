package com.university.enseignant.repository;

import com.university.enseignant.entity.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Enseignant
 */
@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {

    /**
     * Recherche un enseignant par son matricule
     */
    Optional<Enseignant> findByMatriculeEns(String matriculeEns);

    /**
     * Recherche un enseignant par son email
     */
    Optional<Enseignant> findByEmail(String email);

    /**
     * Vérifie si un enseignant existe avec ce matricule
     */
    boolean existsByMatriculeEns(String matriculeEns);

    /**
     * Vérifie si un enseignant existe avec cet email
     */
    boolean existsByEmail(String email);

    /**
     * Recherche des enseignants par nom (insensible à la casse)
     */
    List<Enseignant> findByNomContainingIgnoreCase(String nom);

    /**
     * Recherche des enseignants par prénom (insensible à la casse)
     */
    List<Enseignant> findByPrenomContainingIgnoreCase(String prenom);

    /**
     * Recherche des enseignants par spécialité
     */
    List<Enseignant> findBySpecialite(String specialite);

    /**
     * Recherche des enseignants par nom ET prénom (insensible à la casse)
     */
    List<Enseignant> findByNomContainingIgnoreCaseAndPrenomContainingIgnoreCase(String nom, String prenom);

    /**
     * Compte le nombre d'enseignants par spécialité
     */
    long countBySpecialite(String specialite);

    /**
     * Récupère tous les enseignants avec leurs matières (évite le N+1 problem)
     */
    @Query("SELECT DISTINCT e FROM Enseignant e LEFT JOIN FETCH e.matieres")
    List<Enseignant> findAllWithMatieres();

    /**
     * Récupère un enseignant avec ses matières par ID
     */
    @Query("SELECT e FROM Enseignant e LEFT JOIN FETCH e.matieres WHERE e.id = :id")
    Optional<Enseignant> findByIdWithMatieres(@Param("id") Long id);

    /**
     * Récupère un enseignant avec ses matières par matricule
     */
    @Query("SELECT e FROM Enseignant e LEFT JOIN FETCH e.matieres WHERE e.matriculeEns = :matricule")
    Optional<Enseignant> findByMatriculeWithMatieres(@Param("matricule") String matricule);
}