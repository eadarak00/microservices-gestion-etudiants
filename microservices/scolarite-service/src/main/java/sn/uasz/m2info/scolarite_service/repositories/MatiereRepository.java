package sn.uasz.m2info.scolarite_service.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sn.uasz.m2info.scolarite_service.entities.Matiere;

@Repository
public interface MatiereRepository extends JpaRepository<Matiere, Long> {

    Optional<Matiere> findByCode(String code);

    boolean existsByCode(String code);
}