package sn.uasz.m2info.notes_service.services;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.notes_service.dtos.NoteRequestDto;
import sn.uasz.m2info.notes_service.dtos.NoteResponseDto;
import sn.uasz.m2info.notes_service.entities.Evaluation;
import sn.uasz.m2info.notes_service.entities.Note;
import sn.uasz.m2info.notes_service.mappers.NoteMapper;
import sn.uasz.m2info.notes_service.repositories.NoteRepository;
import sn.uasz.m2info.notes_service.repositories.EvaluationRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class NoteService {

    private final NoteRepository noteRepository;
    private final EvaluationRepository evaluationRepository;

    public NoteResponseDto create(NoteRequestDto dto) {
        Evaluation evaluation = evaluationRepository.findById(dto.getEvaluationId())
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));
        Note note = NoteMapper.toEntity(dto, evaluation);
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
}
