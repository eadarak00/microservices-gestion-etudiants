package sn.uasz.m2info.enseignant_service.controllers;

import java.util.List;

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
@RequestMapping("/enseignants")
@RequiredArgsConstructor
public class EnseignantController {

    private final EnseignantService service;

    @PostMapping
    public EnseignantResponseDto creer(
            @Valid @RequestBody EnseignantRequestDto dto) {
        return service.creer(dto);
    }

    @PutMapping("/{id}")
    public EnseignantResponseDto modifier(
            @PathVariable Long id,
            @Valid @RequestBody EnseignantRequestDto dto) {
        return service.modifier(id, dto);
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        service.supprimer(id);
    }

    @GetMapping("/{id}")
    public EnseignantResponseDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<EnseignantResponseDto> lister() {
        return service.lister();
    }
}
