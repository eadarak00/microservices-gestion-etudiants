package sn.uasz.m2info.etudiant_service.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.etudiant_service.dtos.ChangerEtatInscriptionDto;
import sn.uasz.m2info.etudiant_service.dtos.InscriptionRequestDto;
import sn.uasz.m2info.etudiant_service.dtos.InscriptionResponseDto;
import sn.uasz.m2info.etudiant_service.services.InscriptionService;

@RestController
@RequestMapping("/inscriptions")
@RequiredArgsConstructor
public class InscriptionController {

    private final InscriptionService service;

    @PostMapping
    public InscriptionResponseDto inscrire(
            @Valid @RequestBody InscriptionRequestDto dto) {
        return service.inscrire(dto.getEtudiantId(), dto.getClasseId());
    }

    @PutMapping("/{id}/etat")
    public InscriptionResponseDto changerEtat(
            @PathVariable Long id,
            @Valid @RequestBody ChangerEtatInscriptionDto dto) {
        return service.changerEtat(id, dto.getEtat());
    }

    @GetMapping("/classe/{classeId}")
    public List<InscriptionResponseDto> getByClasse(@PathVariable Long classeId) {
        return service.getByClasse(classeId);
    }

    @GetMapping("/etudiant/{etudiantId}")
    public List<InscriptionResponseDto> getDossierEtudiant(@PathVariable Long etudiantId) {
        return service.getDossierEtudiant(etudiantId);
    }
}
