package sn.uasz.m2info.scolarite_service.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sn.uasz.m2info.scolarite_service.entities.ClasseMatiere;

@Repository
public interface ClasseMatiereRepository
        extends JpaRepository<ClasseMatiere, Long> {

    List<ClasseMatiere> findByClasseId(Long classeId);
}
