package sn.uasz.m2info.scolarite_service.controllers;

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
import sn.uasz.m2info.scolarite_service.dtos.MatiereRequestDto;
import sn.uasz.m2info.scolarite_service.dtos.MatiereResponseDto;
import sn.uasz.m2info.scolarite_service.services.MatiereService;

@RestController
@RequestMapping("/api/matieres")
@RequiredArgsConstructor
public class MatiereController {

    private final MatiereService service;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public MatiereResponseDto creer(@RequestBody @Valid MatiereRequestDto dto) {
        return service.creer(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public MatiereResponseDto modifier(
            @PathVariable Long id,
            @RequestBody @Valid MatiereRequestDto dto) {
        return service.modifier(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void supprimer(@PathVariable Long id) {
        service.supprimer(id);
    }

    @GetMapping("/{id}")
    public MatiereResponseDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/code/{code}")
    public MatiereResponseDto getByCode(@PathVariable String code) {
        return service.getByCode(code);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<MatiereResponseDto> getAll() {
        return service.getAll();
    }
}