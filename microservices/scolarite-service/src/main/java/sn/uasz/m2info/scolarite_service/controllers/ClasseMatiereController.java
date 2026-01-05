package sn.uasz.m2info.scolarite_service.controllers;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.scolarite_service.dtos.ClasseMatiereDTO;
import sn.uasz.m2info.scolarite_service.entities.ClasseMatiere;
import sn.uasz.m2info.scolarite_service.services.ClasseMatiereService;

@RestController
@RequestMapping("/api/classe-matieres")
@RequiredArgsConstructor
public class ClasseMatiereController {

    private final ClasseMatiereService service;

    /* AFFECTER */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ClasseMatiere affecter(
            @RequestParam Long classeId,
            @RequestParam Long matiereId,
            @RequestParam Integer vh) {

        return service.affecter(classeId, matiereId, vh);
    }

    /* UPDATE */
    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ClasseMatiere modifier(
            @RequestParam Long classeId,
            @RequestParam Long matiereId,
            @RequestParam Integer vh) {

        return service.modifier(classeId, matiereId, vh);
    }

    /* DELETE */
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public void supprimer(
            @RequestParam Long classeId,
            @RequestParam Long matiereId) {

        service.supprimer(classeId, matiereId);
    }

    /* GET */
    @GetMapping("/classe/{classeId}")
    public List<ClasseMatiereDTO> parClasse(@PathVariable Long classeId) {
        return service.matieresParClasse(classeId);
    }
}
