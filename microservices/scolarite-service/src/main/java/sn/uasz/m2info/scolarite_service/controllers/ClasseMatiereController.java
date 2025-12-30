package sn.uasz.m2info.scolarite_service.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.scolarite_service.entities.ClasseMatiere;
import sn.uasz.m2info.scolarite_service.services.ClasseMatiereService;

@RestController
@RequestMapping("/classe-matieres")
@RequiredArgsConstructor
public class ClasseMatiereController {

    private final ClasseMatiereService service;

    @PostMapping
    public ClasseMatiere affecter(
            @RequestParam Long classeId,
            @RequestParam Long matiereId,
            @RequestParam Integer vh) {

        return service.affecter(classeId, matiereId, vh);
    }

    @GetMapping("/classe/{classeId}")
    public List<ClasseMatiere> parClasse(@PathVariable Long classeId) {
        return service.matieresParClasse(classeId);
    }
}
