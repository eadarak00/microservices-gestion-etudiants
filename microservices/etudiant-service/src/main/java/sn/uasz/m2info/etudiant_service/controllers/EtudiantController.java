package sn.uasz.m2info.etudiant_service.controllers;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.etudiant_service.dtos.EtudiantRequestDto;
import sn.uasz.m2info.etudiant_service.dtos.EtudiantResponseDto;
import sn.uasz.m2info.etudiant_service.services.EtudiantService;

@RestController
@RequestMapping("/api/etudiants")
@RequiredArgsConstructor
public class EtudiantController {

    private final EtudiantService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT')")
    public EtudiantResponseDto creer(
            @Valid @RequestBody EtudiantRequestDto dto) {
        return service.creer(dto);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<EtudiantResponseDto> getAll() {
        return service.getAll();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT')")
    public EtudiantResponseDto modifier(
            @PathVariable Long id,
            @Valid @RequestBody EtudiantRequestDto dto) {
        return service.modifier(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void supprimer(@PathVariable Long id) {
        service.supprimer(id);
    }

    @GetMapping("/{id}")
    public EtudiantResponseDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/matricule/{matricule}")
    public EtudiantResponseDto getByMatricule(@PathVariable String matricule) {
        return service.getByMatricule(matricule);
    }

    @GetMapping("/email/{email}")
    public EtudiantResponseDto getByEmail(@PathVariable String email) {
        return service.getByEmail(email);
    }

    @GetMapping("/classe/{classeId}")
    @PreAuthorize("hasAnyRole('ADMIN','ENSEIGNANT')")
    public List<EtudiantResponseDto> getByClasse(@PathVariable Long classeId) {
        return service.getByClasse(classeId);
    }
}
