package sn.uasz.m2info.notes_service.clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import sn.uasz.m2info.notes_service.dtos.ClasseDto;
import sn.uasz.m2info.notes_service.dtos.EtudiantDto;
import sn.uasz.m2info.notes_service.dtos.MatiereDto;

@FeignClient(name = "scolarite-service", fallback = ScolariteClientFallback.class)
public interface ScolariteClient {

    @GetMapping("/internal/classes/{id}")
    ClasseDto getClasse(@PathVariable Long id);

    @GetMapping("/internal/classes/{idClasse}/etudiants")
    List<EtudiantDto> getEtudiantsByClasse(@PathVariable Long idClasse);

    @GetMapping("/internal/matieres/{id}")
    MatiereDto getMatiere(@PathVariable Long id);
}
