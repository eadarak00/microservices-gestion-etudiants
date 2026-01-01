package sn.uasz.m2info.notes_service.services;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

import org.springframework.stereotype.Service;

import com.opencsv.CSVReader;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ServiceUnavailableException;
import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.notes_service.clients.EtudiantClient;
import sn.uasz.m2info.notes_service.clients.ScolariteClient;
import sn.uasz.m2info.notes_service.dtos.EtudiantDto;
import sn.uasz.m2info.notes_service.dtos.NoteRequestDto;
import sn.uasz.m2info.notes_service.dtos.NoteResponseDto;
import sn.uasz.m2info.notes_service.entities.Evaluation;
import sn.uasz.m2info.notes_service.entities.Note;
import sn.uasz.m2info.notes_service.exceptions.ResourceNotFoundException;
import sn.uasz.m2info.notes_service.mappers.NoteMapper;
import sn.uasz.m2info.notes_service.repositories.NoteRepository;
import sn.uasz.m2info.notes_service.repositories.EvaluationRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class NoteService {

    private final NoteRepository noteRepository;
    private final EvaluationRepository evaluationRepository;
    private final EtudiantClient etudiantClient;
    private final ScolariteClient scolariteClient;

    @CircuitBreaker(name = "etudiant-service", fallbackMethod = "createFallback")
    public NoteResponseDto create(NoteRequestDto dto) {
        // Vérifier l'existence de l'évaluation
        Evaluation evaluation = evaluationRepository.findById(dto.getEvaluationId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Evaluation with id " + dto.getEvaluationId() + " not found"));

        // Vérifier l'existence de l'étudiant via le microservice
        EtudiantDto etudiant;
        try {
            etudiant = etudiantClient.getEtudiant(dto.getEtudiantId());
        } catch (Exception e) {
            throw new ServiceUnavailableException("Etudiant service indisponible");
        }
        if (etudiant == null) {
            throw new ResourceNotFoundException("Etudiant with id " + dto.getEtudiantId() + " not found");
        }

        // Vérifier si la note existe déjà pour cet étudiant et cette évaluation
        Note note = noteRepository.findAll().stream()
                .filter(n -> n.getEvaluation().getId().equals(dto.getEvaluationId())
                        && n.getEtudiantId().equals(dto.getEtudiantId()))
                .findFirst()
                .orElse(NoteMapper.toEntity(dto, evaluation));

        // Mettre à jour ou créer
        note.setValeur(dto.getValeur());
        note.setEvaluation(evaluation);
        note.setEtudiantId(dto.getEtudiantId());

        // Sauvegarder et retourner le DTO
        return NoteMapper.toDto(noteRepository.save(note));
    }

    public NoteResponseDto getById(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        return NoteMapper.toDto(note);
    }

    public List<NoteResponseDto> getAll() {
        return NoteMapper.toDtoList(noteRepository.findAll());
    }

    public void delete(Long id) {
        noteRepository.deleteById(id);
    }

    public NoteResponseDto update(Long id, NoteRequestDto dto) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        Evaluation evaluation = evaluationRepository.findById(dto.getEvaluationId())
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));

        NoteMapper.updateEntity(note, dto, evaluation);
        return NoteMapper.toDto(noteRepository.save(note));
    }

    @Transactional
    @CircuitBreaker(name = "scolarite-service", fallbackMethod = "importCsvFallback")
    public void importCsv(InputStream csvInputStream, Long evaluationId) {
        // Vérifier que l'évaluation existe
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Evaluation with id " + evaluationId + " not found"));

        Long classeId = evaluation.getClasseId();

        // Récupérer les étudiants de la classe via ScolariteClient
        List<EtudiantDto> etudiantsDeClasse;
        try {
            etudiantsDeClasse = scolariteClient.getEtudiantsByClasse(classeId);
        } catch (Exception e) {
            throw new ServiceUnavailableException(
                    "Scolarite service indisponible pour la classe " + classeId);
        }

        try (CSVReader reader = new CSVReader(new InputStreamReader(csvInputStream))) {
            String[] line;
            while ((line = reader.readNext()) != null) {
                String matricule = line[0].trim();
                Double valeur = Double.parseDouble(line[1].trim());

                // Vérifier que l'étudiant est dans la classe et récupérer son ID
                EtudiantDto etudiant = etudiantsDeClasse.stream()
                        .filter(e -> e.getMatricule().equals(matricule))
                        .findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Etudiant with matricule " + matricule +
                                        " does not belong to class " + classeId));

                Long etudiantId = etudiant.getId();

                // Vérifier si la note existe déjà
                Note note = noteRepository.findByEvaluationIdAndEtudiantId(evaluationId, etudiantId)
                        .orElse(new Note());

                // Mettre à jour ou créer la note
                note.setEvaluation(evaluation);
                note.setEtudiantId(etudiantId);
                if (note.getValeur() == null || !note.getValeur().equals(valeur)) {
                    note.setValeur(valeur);
                }

                noteRepository.save(note);
            }
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la lecture du CSV: " + e.getMessage(), e);
        }
    }

    public NoteResponseDto createFallback(NoteRequestDto dto, Exception e) {
        throw new ServiceUnavailableException("Etudiant service indisponible");
    }

    public void importCsvFallback(InputStream csvInputStream, Long evaluationId, Exception e) {
        throw new ServiceUnavailableException("Scolarite service indisponible");
    }
}
