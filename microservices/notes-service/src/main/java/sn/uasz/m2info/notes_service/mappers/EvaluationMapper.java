package sn.uasz.m2info.notes_service.mappers;

import java.util.List;

import sn.uasz.m2info.notes_service.dtos.EvaluationRequestDto;
import sn.uasz.m2info.notes_service.dtos.EvaluationResponseDto;
import sn.uasz.m2info.notes_service.entities.Evaluation;

public class EvaluationMapper {

    private EvaluationMapper() {
    }

    public static Evaluation toEntity(EvaluationRequestDto dto) {
        Evaluation e = new Evaluation();
        e.setType(dto.getType());
        e.setDate(dto.getDate());
        e.setClasseId(dto.getClasseId());
        e.setMatiereId(dto.getMatiereId());
        return e;
    }

    public static EvaluationResponseDto toDto(Evaluation e) {
        EvaluationResponseDto dto = new EvaluationResponseDto();
        dto.setId(e.getId());
        dto.setType(e.getType());
        dto.setDate(e.getDate());
        dto.setClasseId(e.getClasseId());
        dto.setMatiereId(e.getMatiereId());
        return dto;
    }

    public static List<EvaluationResponseDto> toDtoList(List<Evaluation> evaluations) {
        return evaluations.stream()
                .map(EvaluationMapper::toDto)
                .toList();
    }

    public static void updateEntity(Evaluation e, EvaluationRequestDto dto) {
        e.setType(dto.getType());
        e.setDate(dto.getDate());
        e.setClasseId(dto.getClasseId());
        e.setMatiereId(dto.getMatiereId());
    }
}
