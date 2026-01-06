package sn.uasz.m2info.etudiant_service.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.etudiant_service.dtos.EtudiantResponseDto;
import sn.uasz.m2info.etudiant_service.services.EtudiantService;
import sn.uasz.m2info.etudiant_service.services.InscriptionService;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
public class EtudiantInternalController {
    private final InscriptionService iService;
    private final EtudiantService eService;

    @GetMapping("/inscriptions/classe/{classeId}/etudiants")
    public List<EtudiantResponseDto> getEtudiantsByClasse(@PathVariable Long classeId) {
        return iService.getEtudiantsByClasse(classeId);
    }

     @GetMapping("/etudiants/{id}")
    public EtudiantResponseDto getById(@PathVariable Long id) {
        return eService.getById(id);
    }

    @GetMapping("/etudiants/matricule/{matricule}")
    public EtudiantResponseDto getByMatricule(@PathVariable String matricule) {
        return eService.getByMatricule(matricule);
    }
}
