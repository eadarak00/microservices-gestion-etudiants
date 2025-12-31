package com.example.ms_scolarite.controller;

import com.example.ms_scolarite.dto.Inscriptiondto;
import com.example.ms_scolarite.dto.InscriptionRequest;
import com.example.ms_scolarite.dto.InscriptionResponse;
import com.example.ms_scolarite.service.InscriptionService;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inscriptions")
@RequiredArgsConstructor
public class InscriptionController {

    private final InscriptionService inscriptionService;

    // Create
    @PostMapping("/creeInscription")
    public InscriptionResponse create(@RequestBody InscriptionRequest request) {
        return inscriptionService.createInscription(request);
    }

    // Read all
    @GetMapping
    public List<Inscriptiondto> getAll() {
        return inscriptionService.getAllInscriptions();
    }

    // Read by ID
    @GetMapping("/{id}")
    public Inscriptiondto getById(@PathVariable Long id) {
        return inscriptionService.getInscriptionById(id);
    }

    // Update
    @PutMapping("/{id}")
    public Inscriptiondto update(@PathVariable Long id,
            @RequestParam(required = false) Long classeId,
            @RequestParam(required = false) String statut) {
        return inscriptionService.updateInscription(id, classeId, statut);
    }

    // Delete
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        inscriptionService.deleteInscription(id);
    }

    // Get by étudiant
    @GetMapping("/etudiant/{etudiantId}")
    public List<Inscriptiondto> getByEtudiant(@PathVariable Long etudiantId) {
        return inscriptionService.getInscriptionsByEtudiant(etudiantId);
    }
}