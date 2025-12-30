package sn.uasz.m2info.scolarite_service.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sn.uasz.m2info.scolarite_service.entities.Classe;

@Repository
public interface ClasseRepository extends JpaRepository<Classe, Long> {

    List<Classe> findByNiveau(Integer niveau);

    List<Classe> findByAnneeAcademique(String anneeAcademique);

    boolean existsByLibelleAndAnneeAcademique(String libelle, String anneeAcademique);
}