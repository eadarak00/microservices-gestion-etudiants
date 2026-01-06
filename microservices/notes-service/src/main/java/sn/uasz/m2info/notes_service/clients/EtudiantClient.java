package sn.uasz.m2info.notes_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import sn.uasz.m2info.notes_service.dtos.EtudiantDto;

@FeignClient(name = "etudiant-service", path = "/api/internal/etudiants", fallback = EtudiantClientFallback.class)
public interface EtudiantClient {

    @GetMapping("/{id}")
    EtudiantDto getEtudiant(@PathVariable Long id);

    @GetMapping("/matricule/{matricule}")
    EtudiantDto getEtudiantByMatricule(@PathVariable String matricule);
}
