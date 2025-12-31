package com.example.ms_scolarite.controller;

import com.example.ms_scolarite.dto.Classedto;
import com.example.ms_scolarite.service.ClasseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClasseController {

    private final ClasseService classeService;

    @PostMapping("/createClasse")
    public Classedto createClasse(@RequestBody Classedto classeDto) {
        return classeService.createClasse(classeDto);
    }

    @GetMapping
    public List<Classedto> getAllClasses() {
        return classeService.getAllClasses();
    }

    @GetMapping("/{id}")
    public Classedto getClasseById(@PathVariable Long id) {
        return classeService.getClasseById(id);
    }

    @PutMapping("/{id}")
    public Classedto updateClasse(@PathVariable Long id, @RequestBody Classedto classeDto) {
        return classeService.updateClasse(id, classeDto);
    }

    @DeleteMapping("/{id}")
    public void deleteClasse(@PathVariable Long id) {
        classeService.deleteClasse(id);
    }
}