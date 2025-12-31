package sn.uasz.m2info.notes_service.mappers;

import java.util.List;
import java.util.stream.Collectors;

import sn.uasz.m2info.notes_service.dtos.NoteRequestDto;
import sn.uasz.m2info.notes_service.dtos.NoteResponseDto;
import sn.uasz.m2info.notes_service.entities.Evaluation;
import sn.uasz.m2info.notes_service.entities.Note;

public class NoteMapper {

    private NoteMapper() {}

    public static Note toEntity(NoteRequestDto dto, Evaluation evaluation) {
        Note note = new Note();
        note.setEtudiantId(dto.getEtudiantId());
        note.setValeur(dto.getValeur());
        note.setEvaluation(evaluation);
        return note;
    }

    public static NoteResponseDto toDto(Note note) {
        NoteResponseDto dto = new NoteResponseDto();
        dto.setId(note.getId());
        dto.setEtudiantId(note.getEtudiantId());
        dto.setValeur(note.getValeur());
        dto.setEvaluationId(note.getEvaluation() != null ? note.getEvaluation().getId() : null);
        return dto;
    }

    public static List<NoteResponseDto> toDtoList(List<Note> notes) {
        return notes.stream().map(NoteMapper::toDto).toList();
    }

    public static void updateEntity(Note note, NoteRequestDto dto, Evaluation evaluation) {
        note.setEtudiantId(dto.getEtudiantId());
        note.setValeur(dto.getValeur());
        note.setEvaluation(evaluation);
    }
}
