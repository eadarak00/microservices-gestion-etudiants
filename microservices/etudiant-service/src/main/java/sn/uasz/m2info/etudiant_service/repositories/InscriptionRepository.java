package sn.uasz.m2info.etudiant_service.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.uasz.m2info.etudiant_service.entities.EtatInscription;
import sn.uasz.m2info.etudiant_service.entities.Inscription;

@Repository
public interface InscriptionRepository
        extends JpaRepository<Inscription, Long> {

    List<Inscription> findByClasseId(Long classeId);

    List<Inscription> findByClasseIdAndEtat(Long classeId, EtatInscription etat);

    List<Inscription> findByEtudiantId(Long etudiantId);

    Optional<Inscription> findByEtudiantIdAndClasseId(Long etudiantId, Long classeId);

    // Ajouter cette méthode
    boolean existsByEtudiantIdAndEtat(Long etudiantId, EtatInscription etat);

    Optional<Inscription> findByEtudiantIdAndEtat(Long etudiantId, EtatInscription etat);

    @Modifying
    @Query("""
               UPDATE Inscription i
               SET i.etat = :etat
               WHERE i.etudiant.id = :etudiantId
                 AND i.id <> :inscriptionId
            """)
    void updateAutresInscriptionsEtat(
            @Param("etudiantId") Long etudiantId,
            @Param("inscriptionId") Long inscriptionId,
            @Param("etat") EtatInscription etat);

}
