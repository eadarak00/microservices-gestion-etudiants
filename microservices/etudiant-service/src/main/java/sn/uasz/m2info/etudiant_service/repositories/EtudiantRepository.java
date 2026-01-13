package sn.uasz.m2info.etudiant_service.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sn.uasz.m2info.etudiant_service.entities.Etudiant;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {

    Optional<Etudiant> findByMatricule(String matricule);
    Optional<Etudiant> findByEmail(String email);

    List<Etudiant> findByIdIn(List<Long> ids);
}
