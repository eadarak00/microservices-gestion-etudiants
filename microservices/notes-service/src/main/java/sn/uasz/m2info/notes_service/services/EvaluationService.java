package sn.uasz.m2info.notes_service.services;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.notes_service.dtos.ClasseDto;
import sn.uasz.m2info.notes_service.clients.ScolariteClient;
import sn.uasz.m2info.notes_service.dtos.EvaluationRequestDto;
import sn.uasz.m2info.notes_service.dtos.EvaluationResponseDto;
import sn.uasz.m2info.notes_service.dtos.MatiereDto;
import sn.uasz.m2info.notes_service.entities.Evaluation;
import sn.uasz.m2info.notes_service.exceptions.ResourceNotFoundException;
import sn.uasz.m2info.notes_service.exceptions.ServiceUnavailableException;
import sn.uasz.m2info.notes_service.mappers.EvaluationMapper;
import sn.uasz.m2info.notes_service.repositories.EvaluationRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

@Service
@RequiredArgsConstructor
@Transactional
public class EvaluationService {

    private final EvaluationRepository repository;
    private final ScolariteClient scolariteClient;

    @CircuitBreaker(name = "scolarite-service", fallbackMethod = "createFallback")
    public EvaluationResponseDto create(EvaluationRequestDto dto) {

        // Vérifier la classe
        ClasseDto classe;
        try {
            classe = scolariteClient.getClasse(dto.getClasseId());
        } catch (Exception e) {
            throw new ServiceUnavailableException("Scolarite service indisponible pour Classe");
        }
        if (classe == null) {
            throw new ResourceNotFoundException("Classe with id " + dto.getClasseId() + " not found");
        }

        // Vérifier la matière
        MatiereDto matiere;
        try {
            matiere = scolariteClient.getMatiere(dto.getMatiereId());
        } catch (Exception e) {
            throw new ServiceUnavailableException("Scolarite service indisponible pour Matiere");
        }
        if (matiere == null) {
            throw new ResourceNotFoundException("Matiere with id " + dto.getMatiereId() + " not found");
        }

        // Créer l’évaluation
        Evaluation evaluation = EvaluationMapper.toEntity(dto);
        return EvaluationMapper.toDto(repository.save(evaluation));
    }

    public EvaluationResponseDto getById(Long id) {
        Evaluation evaluation = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));
        return EvaluationMapper.toDto(evaluation);
    }

    public List<EvaluationResponseDto> getAll() {
        return EvaluationMapper.toDtoList(repository.findAll());
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public EvaluationResponseDto createFallback(EvaluationRequestDto dto, Exception e) {
        throw new ServiceUnavailableException("Scolarite service indisponible pour l'evaluation");
    }
}
