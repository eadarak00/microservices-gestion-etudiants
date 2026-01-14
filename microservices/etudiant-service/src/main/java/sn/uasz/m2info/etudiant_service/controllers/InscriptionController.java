package sn.uasz.m2info.etudiant_service.controllers;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
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
import sn.uasz.m2info.etudiant_service.dtos.EtudiantResponseDto;
import sn.uasz.m2info.etudiant_service.dtos.InscriptionRequestDto;
import sn.uasz.m2info.etudiant_service.dtos.InscriptionResponseDto;
import sn.uasz.m2info.etudiant_service.entities.EtatInscription;
import sn.uasz.m2info.etudiant_service.services.InscriptionService;

@RestController
@RequestMapping("/api/inscriptions")
@RequiredArgsConstructor
public class InscriptionController {

    private final InscriptionService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT')")
    public InscriptionResponseDto inscrire(
            @Valid @RequestBody InscriptionRequestDto dto) {
        return service.inscrire(dto.getEtudiantId(), dto.getClasseId());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<InscriptionResponseDto> getAll() {
        return service.getAll();
    }

    @PutMapping("/{id}/etat")
    @PreAuthorize("hasRole('ADMIN')")
    public InscriptionResponseDto changerEtat(
            @PathVariable Long id,
            @Valid @RequestBody ChangerEtatInscriptionDto dto) {
        return service.changerEtat(id, dto.getEtat());
    }


     @PutMapping("/{id}/accepter")
    @PreAuthorize("hasRole('ADMIN')")
    public InscriptionResponseDto terminerInscription(
            @PathVariable Long id) {
        return service.terminerInscription(id);
    }

    @PutMapping("/{id}/annuler")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT')")
    public InscriptionResponseDto annuler(@PathVariable Long id){
        return service.annulerInscription(id);
    }


    @GetMapping("/classe/{classeId}")
    @PreAuthorize("hasAnyRole('ADMIN','ENSEIGNANT')")
    public List<InscriptionResponseDto> getByClasse(@PathVariable Long classeId) {
        return service.getByClasse(classeId);
    }

    @GetMapping("/etudiant/{etudiantId}")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT')")
    public List<InscriptionResponseDto> getInscriptionsEtudiant(@PathVariable Long etudiantId) {
        return service.getInscriptionsEtudiant(etudiantId);
    }

    @GetMapping("/etudiant/{etudiantId}/dossier-inscription")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT')")
    public InscriptionResponseDto getDossierEtudiant(@PathVariable Long etudiantId) {
        return service.getDossierInscription(etudiantId);
    }

    @GetMapping("/classe/{classeId}/etudiants")
    @PreAuthorize("hasAnyRole('ADMIN','ENSEIGNANT')")
    public List<EtudiantResponseDto> getEtudiantsByClasse(@PathVariable Long classeId) {
        return service.getEtudiantsByClasse(classeId);
    }
}
