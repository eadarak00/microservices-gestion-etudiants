package sn.uasz.m2info.notes_service.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.notes_service.dtos.NoteRequestDto;
import sn.uasz.m2info.notes_service.dtos.NoteResponseDto;
import sn.uasz.m2info.notes_service.services.NoteService;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    // Créer une note
    @PostMapping
    public ResponseEntity<NoteResponseDto> create(@RequestBody NoteRequestDto dto) {
        NoteResponseDto response = noteService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Récupérer une note par id
    @GetMapping("/{id}")
    public ResponseEntity<NoteResponseDto> getById(@PathVariable Long id) {
        NoteResponseDto response = noteService.getById(id);
        return ResponseEntity.ok(response);
    }

    // Récupérer toutes les notes
    @GetMapping
    public ResponseEntity<List<NoteResponseDto>> getAll() {
        List<NoteResponseDto> notes = noteService.getAll();
        return ResponseEntity.ok(notes);
    }

    // Supprimer une note
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // (Optionnel) mettre à jour une note
    @PutMapping("/{id}")
    public ResponseEntity<NoteResponseDto> update(@PathVariable Long id, @RequestBody NoteRequestDto dto) {
        NoteResponseDto updated = noteService.update(id, dto);
        return ResponseEntity.ok(updated);
    }
}
