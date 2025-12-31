package sn.uasz.m2info.scolarite_service.controllers;

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
import sn.uasz.m2info.scolarite_service.dtos.ClasseRequestDto;
import sn.uasz.m2info.scolarite_service.dtos.ClasseResponseDto;
import sn.uasz.m2info.scolarite_service.dtos.EtudiantResponseDto;
import sn.uasz.m2info.scolarite_service.services.ClasseService;

@RestController
@RequestMapping("/classes")
@RequiredArgsConstructor
public class ClasseController {

    private final ClasseService service;

    @PostMapping
    public ClasseResponseDto creer(@RequestBody @Valid ClasseRequestDto dto) {
        return service.creer(dto);
    }

    @PutMapping("/{id}")
    public ClasseResponseDto modifier(
            @PathVariable Long id,
            @RequestBody @Valid ClasseRequestDto dto) {
        return service.modifier(id, dto);
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        service.supprimer(id);
    }

    @GetMapping("/{id}")
    public ClasseResponseDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<ClasseResponseDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}/exists")
    public boolean classeExists(@PathVariable Long id) {
        return service.classeExists(id);
    }

    @GetMapping("/{id}/etudiants")
    public List<EtudiantResponseDto> getClasseAvecEtudiants(@PathVariable Long id) {
        return service.getClasseAvecEtudiants(id);
    }

}