package sn.uasz.m2info.etudiant_service.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.etudiant_service.dtos.EtudiantResponseDto;
import sn.uasz.m2info.etudiant_service.dtos.InscriptionResponseDto;
import sn.uasz.m2info.etudiant_service.entities.EtatInscription;
import sn.uasz.m2info.etudiant_service.entities.Etudiant;
import sn.uasz.m2info.etudiant_service.entities.Inscription;
import sn.uasz.m2info.etudiant_service.exceptions.ResourceNotFoundException;
import sn.uasz.m2info.etudiant_service.exceptions.ServiceUnavailableException;
import sn.uasz.m2info.etudiant_service.mappers.EtudiantMapper;
import sn.uasz.m2info.etudiant_service.mappers.InscriptionMapper;
import sn.uasz.m2info.etudiant_service.repositories.EtudiantRepository;
import sn.uasz.m2info.etudiant_service.repositories.InscriptionRepository;
import sn.uasz.m2info.etudiant_service.clients.ScolariteClient;

@Service
@Transactional
@RequiredArgsConstructor
public class InscriptionService {

    private final InscriptionRepository inscriptionRepo;
    private final EtudiantRepository etudiantRepo;
    private final ScolariteClient scolariteClient;

    @CircuitBreaker(name = "scolariteService", fallbackMethod = "classeFallback")
    public InscriptionResponseDto inscrire(Long etudiantId, Long classeId) {

        // Vérifier classe
        boolean exists = scolariteClient.classeExists(classeId);
        if (!exists) {
            throw new ResourceNotFoundException("Classe introuvable");
        }

        // Vérifier étudiant
        Etudiant etudiant = etudiantRepo.findById(etudiantId)
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant introuvable"));

        // Vérifier inscription existante
        inscriptionRepo.findByEtudiantIdAndClasseId(etudiantId, classeId)
                .ifPresent(i -> {
                    throw new IllegalStateException(
                            "Étudiant déjà inscrit dans cette classe");
                });

        // =Créer inscription
        Inscription inscription = new Inscription();
        inscription.setEtudiant(etudiant);
        inscription.setClasseId(classeId);
        inscription.setDateInscription(LocalDate.now());
        inscription.setEtat(EtatInscription.ACTIF);

        return InscriptionMapper.toDto(inscriptionRepo.save(inscription));
    }

    // Fallback
    public InscriptionResponseDto classeFallback(
            Long etudiantId,
            Long classeId,
            Throwable ex) {
        throw new ServiceUnavailableException(
                "Impossible d’inscrire : service scolarité indisponible");
    }

    public InscriptionResponseDto changerEtat(Long inscriptionId, EtatInscription etat) {

        Inscription inscription = inscriptionRepo.findById(inscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Inscription introuvable"));

        inscription.setEtat(etat);
        return InscriptionMapper.toDto(inscriptionRepo.save(inscription));
    }

    public List<InscriptionResponseDto> getByClasse(Long classeId) {
        return inscriptionRepo.findByClasseId(classeId)
                .stream()
                .map(InscriptionMapper::toDto)
                .toList();
    }

    public List<InscriptionResponseDto> getDossierEtudiant(Long etudiantId) {
        return inscriptionRepo.findByEtudiantId(etudiantId)
                .stream()
                .map(InscriptionMapper::toDto)
                .toList();
    }

    public List<EtudiantResponseDto> getEtudiantsByClasse(Long classeId) {
        return inscriptionRepo.findByClasseId(classeId)
                .stream()
                .map(i -> EtudiantMapper.toDto(i.getEtudiant()))
                .toList();
    }
}
