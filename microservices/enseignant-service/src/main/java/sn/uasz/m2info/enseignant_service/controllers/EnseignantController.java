package sn.uasz.m2info.enseignant_service.controllers;

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
import sn.uasz.m2info.enseignant_service.dtos.EnseignantRequestDto;
import sn.uasz.m2info.enseignant_service.dtos.EnseignantResponseDto;
import sn.uasz.m2info.enseignant_service.services.EnseignantService;

@RestController
@RequestMapping("/api/enseignants")
@RequiredArgsConstructor
public class EnseignantController {

    private final EnseignantService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ENSEIGNANT')")
    public EnseignantResponseDto creer(
            @Valid @RequestBody EnseignantRequestDto dto) {
        return service.creer(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENSEIGNANT')")
    public EnseignantResponseDto modifier(
            @PathVariable Long id,
            @Valid @RequestBody EnseignantRequestDto dto) {
        return service.modifier(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void supprimer(@PathVariable Long id) {
        service.supprimer(id);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENSEIGNANT')")
    public EnseignantResponseDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<EnseignantResponseDto> lister() {
        return service.lister();
    }
}
