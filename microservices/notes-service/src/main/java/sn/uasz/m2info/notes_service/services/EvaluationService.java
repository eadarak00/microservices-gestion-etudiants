package sn.uasz.m2info.notes_service.services;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.notes_service.dtos.EvaluationRequestDto;
import sn.uasz.m2info.notes_service.dtos.EvaluationResponseDto;
import sn.uasz.m2info.notes_service.entities.Evaluation;
import sn.uasz.m2info.notes_service.mappers.EvaluationMapper;
import sn.uasz.m2info.notes_service.repositories.EvaluationRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class EvaluationService {

    private final EvaluationRepository repository;

    public EvaluationResponseDto create(EvaluationRequestDto dto) {
        Evaluation evaluation = EvaluationMapper.toEntity(dto);
        return EvaluationMapper.toDto(repository.save(evaluation));
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public EvaluationResponseDto getById(Long id) {
        Evaluation evaluation = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));
        return EvaluationMapper.toDto(evaluation);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<EvaluationResponseDto> getAll() {
        return EvaluationMapper.toDtoList(repository.findAll());
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
