package sn.uasz.m2info.scolarite_service.clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import sn.uasz.m2info.scolarite_service.dtos.EtudiantResponseDto;

@FeignClient(name = "etudiant-service", fallback = EtudiantClientFallback.class)
public interface EtudiantClient {

    @GetMapping("/inscriptions/classe/{classeId}/etudiants")
    List<EtudiantResponseDto> getEtudiantsByClasse(@PathVariable Long classeId);

}
