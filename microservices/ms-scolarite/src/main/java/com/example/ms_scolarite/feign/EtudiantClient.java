package com.example.ms_scolarite.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

@FeignClient(name = "etudiant-service", url = "${etudiant.service.url}")
public interface EtudiantClient {
    @GetMapping("/api/etudiants/{id}")
    @CircuitBreaker(name = "etudiant-service", fallbackMethod = "getEtudiantByIdFallback")
    EtudiantResponse getEtudiantById(@PathVariable("id") Long id);

    /**
     * Méthode par défaut pour tolérance aux pannes si le service Étudiant n'est pas
     * disponible.
     */
    default EtudiantResponse getEtudiantByIdFallback(Long id, Throwable throwable) {
        EtudiantResponse fallback = new EtudiantResponse();
        fallback.setId(id);
        fallback.setNom("Inconnu");
        fallback.setPrenom("Inconnu");
        return fallback;
    }

}
