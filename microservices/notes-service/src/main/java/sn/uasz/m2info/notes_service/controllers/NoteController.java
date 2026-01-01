package sn.uasz.m2info.notes_service.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<NoteResponseDto> create(@RequestBody NoteRequestDto dto) {
        NoteResponseDto response = noteService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Récupérer une note par id
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<NoteResponseDto> getById(@PathVariable Long id) {
        NoteResponseDto response = noteService.getById(id);
        return ResponseEntity.ok(response);
    }

    // Récupérer toutes les notes
    @GetMapping
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<List<NoteResponseDto>> getAll() {
        List<NoteResponseDto> notes = noteService.getAll();
        return ResponseEntity.ok(notes);
    }

    // Supprimer une note
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // (Optionnel) mettre à jour une note
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<NoteResponseDto> update(@PathVariable Long id, @RequestBody NoteRequestDto dto) {
        NoteResponseDto updated = noteService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/import/{evaluationId}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<String> importCsv(
            @PathVariable Long evaluationId,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Le fichier CSV est vide");
        }

        try {
            noteService.importCsv(file.getInputStream(), evaluationId);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("Import des notes effectué avec succès");
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la lecture du fichier CSV");
        }
    }
}
