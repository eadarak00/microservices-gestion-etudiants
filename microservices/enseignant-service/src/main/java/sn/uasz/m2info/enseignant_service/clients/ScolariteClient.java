package sn.uasz.m2info.enseignant_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import sn.uasz.m2info.enseignant_service.dtos.ClasseDto;
import sn.uasz.m2info.enseignant_service.dtos.MatiereDto;

@FeignClient(name = "scolarite-service", fallback = ScolariteClientFallback.class)
public interface ScolariteClient {

    @GetMapping("/classes/{id}")
    ClasseDto getClasse(@PathVariable Long id);

    @GetMapping("/matieres/{id}")
    MatiereDto getMatiere(@PathVariable Long id);
}
