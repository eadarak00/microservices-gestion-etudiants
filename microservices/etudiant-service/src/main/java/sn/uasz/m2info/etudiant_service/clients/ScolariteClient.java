package sn.uasz.m2info.etudiant_service.clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import sn.uasz.m2info.etudiant_service.dtos.ClasseResponseDto;

@FeignClient(name = "scolarite-service", path = "/api.internal/classes", fallback = ScolariteClientFallback.class)
public interface ScolariteClient {

    @GetMapping("/{id}/exists")
    boolean classeExists(@PathVariable Long id);

    @GetMapping("/")
    List<ClasseResponseDto> getAll();
}