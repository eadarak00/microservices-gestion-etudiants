package sn.uasz.m2info.enseignant_service.controllers;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.enseignant_service.dtos.AffectationRequestDto;
import sn.uasz.m2info.enseignant_service.dtos.AffectationResponseDto;
import sn.uasz.m2info.enseignant_service.services.AffectationService;

@RestController
@RequestMapping("/api/affectations")
@RequiredArgsConstructor
public class AffectationController {

    private final AffectationService service;

    /**
     * Affecter un enseignant à une matière dans une classe
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AffectationResponseDto affecter(
            @Valid @RequestBody AffectationRequestDto dto) {
        return service.affecter(dto);
    }

    /**
     * Lister les affectations par classe
     */
    @GetMapping("/classe/{classeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AffectationResponseDto> getByClasse(
            @PathVariable Long classeId) {
        return service.getByClasse(classeId);
    }

    /**
     * Lister les affectations par enseignant
     */
    @GetMapping("/enseignant/{enseignantId}")
    @PreAuthorize("hasRole('ADMIN', 'ENSEIGNANT')")
    public List<AffectationResponseDto> getByEnseignant(
            @PathVariable Long enseignantId) {
        return service.getByEnseignant(enseignantId);
    }
}