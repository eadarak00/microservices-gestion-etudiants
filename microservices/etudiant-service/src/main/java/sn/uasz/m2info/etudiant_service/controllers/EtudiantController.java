package sn.uasz.m2info.etudiant_service.controllers;

import java.util.List;

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
@RequestMapping("/etudiants")
@RequiredArgsConstructor
public class EtudiantController {

    private final EtudiantService service;

    @PostMapping
    public EtudiantResponseDto creer(
            @Valid @RequestBody EtudiantRequestDto dto) {
        return service.creer(dto);
    }

    @PutMapping("/{id}")
    public EtudiantResponseDto modifier(
            @PathVariable Long id,
            @Valid @RequestBody EtudiantRequestDto dto) {
        return service.modifier(id, dto);
    }

    @DeleteMapping("/{id}")
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

    @GetMapping("/classe/{classeId}")
    public List<EtudiantResponseDto> getByClasse(@PathVariable Long classeId) {
        return service.getByClasse(classeId);
    }
}
