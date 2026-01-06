package sn.uasz.m2info.enseignant_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import sn.uasz.m2info.enseignant_service.dtos.ClasseDto;
import sn.uasz.m2info.enseignant_service.dtos.MatiereDto;
import sn.uasz.m2info.enseignant_service.security.FeignSecurityConfig;

@FeignClient(name = "scolarite-service", configuration = FeignSecurityConfig.class, fallback = ScolariteClientFallback.class)
public interface ScolariteClient {

    @GetMapping("/internal/classes/{id}")
    ClasseDto getClasse(@PathVariable Long id);

    @GetMapping("/internal/matieres/{id}")
    MatiereDto getMatiere(@PathVariable Long id);
}
