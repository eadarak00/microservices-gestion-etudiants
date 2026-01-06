package sn.uasz.m2info.scolarite_service.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.scolarite_service.dtos.ClasseResponseDto;
import sn.uasz.m2info.scolarite_service.dtos.EtudiantResponseDto;
import sn.uasz.m2info.scolarite_service.dtos.MatiereResponseDto;
import sn.uasz.m2info.scolarite_service.services.ClasseService;
import sn.uasz.m2info.scolarite_service.services.MatiereService;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
public class ScolariteInternalControlle {
    private final ClasseService classeService;
    private final MatiereService matiereService;

    @GetMapping("classes/{id}")
    public ClasseResponseDto getClasseById(@PathVariable Long id) {
        return classeService.getById(id);
    }

    @GetMapping("/classes")
    public List<ClasseResponseDto> getAll() {
        return classeService.getAll();
    }

    @GetMapping("/classes/{id}/exists")
    public boolean classeExists(@PathVariable Long id) {
        return classeService.classeExists(id);
    }

    @GetMapping("/classes/{id}/etudiants")
    public List<EtudiantResponseDto> getClasseAvecEtudiants(@PathVariable Long id) {
        return classeService.getClasseAvecEtudiants(id);
    }

    @GetMapping("/matieres/{id}")
    public MatiereResponseDto getMatiereById(@PathVariable Long id) {
        return matiereService.getById(id);
    }

}
