package sn.uasz.m2info.notes_service.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sn.uasz.m2info.notes_service.entities.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByEtudiantId(Long etudiantId);

    List<Note> findByEvaluationId(Long evaluationId);
}