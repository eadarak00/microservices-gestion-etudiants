package sn.uasz.m2info.enseignant_service.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import sn.uasz.m2info.enseignant_service.entities.Affectation;


public interface AffectationRepository extends JpaRepository<Affectation, Long> {

    List<Affectation> findByClasseId(Long classeId);

    List<Affectation> findByEnseignantId(Long enseignantId);

    boolean existsByClasseIdAndMatiereId(Long classeId, Long matiereId);
}
