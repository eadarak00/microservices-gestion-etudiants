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

                // Vérifier inscription existante dans la même classe
                inscriptionRepo.findByEtudiantIdAndClasseId(etudiantId, classeId)
                                .ifPresent(i -> {
                                        throw new IllegalStateException(
                                                        "Étudiant déjà inscrit dans cette classe");
                                });

                // Ajouter la nouvelle vérification : vérifier si l'étudiant a déjà une
                // inscription TERMINE
                boolean hasTerminatedInscription = inscriptionRepo.existsByEtudiantIdAndEtat(
                                etudiantId, EtatInscription.TERMINE);

                if (hasTerminatedInscription) {
                        throw new IllegalStateException(
                                        "L'étudiant a déjà une inscription terminée et ne peut pas s'inscrire à nouveau");
                }

                // Créer inscription
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

        public List<InscriptionResponseDto> getInscriptionsEtudiant(Long etudiantId) {
                return inscriptionRepo.findByEtudiantId(etudiantId)
                                .stream()
                                .map(InscriptionMapper::toDto)
                                .toList();
        }

        public InscriptionResponseDto getDossierInscription(Long etudiantId) {
                // Vérifier si l'étudiant existe
                if (!etudiantRepo.existsById(etudiantId)) {
                        throw new ResourceNotFoundException("Étudiant introuvable");
                }

                // Chercher l'inscription TERMINE (s'il n'y en a qu'une)
                return inscriptionRepo.findByEtudiantIdAndEtat(etudiantId, EtatInscription.TERMINE)
                                .stream()
                                .findFirst() // Prend la première inscription TERMINE
                                .map(InscriptionMapper::toDto)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Aucune inscription terminée trouvée pour cet étudiant"));
        }

        public List<EtudiantResponseDto> getEtudiantsByClasse(Long classeId) {
                return inscriptionRepo.findByClasseIdAndEtat(classeId, EtatInscription.TERMINE)
                                .stream()
                                .map(i -> EtudiantMapper.toDto(i.getEtudiant()))
                                .distinct() // Pour éviter les doublons si un étudiant a plusieurs inscriptions TERMINE
                                .toList();
        }

        public List<InscriptionResponseDto> getAll() {
                return inscriptionRepo.findAll()
                                .stream()
                                .map(InscriptionMapper::toDto)
                                .toList();
        }

        @Transactional
        public InscriptionResponseDto terminerInscription(Long inscriptionId) {

                Inscription inscription = inscriptionRepo.findById(inscriptionId)
                                .orElseThrow(() -> new ResourceNotFoundException("Inscription introuvable"));

                // 1. Terminer l'inscription choisie
                inscription.setEtat(EtatInscription.TERMINE);
                inscriptionRepo.save(inscription);

                // 2. Suspendre toutes les autres inscriptions du même étudiant
                Long etudiantId = inscription.getEtudiant().getId();

                inscriptionRepo.updateAutresInscriptionsEtat(
                                etudiantId,
                                inscriptionId,
                                EtatInscription.SUSPENDU);

                return InscriptionMapper.toDto(inscription);
        }

        @Transactional
        public InscriptionResponseDto annulerInscription(Long id) {
                Inscription ins = inscriptionRepo.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Inscription introuvable"));

                ins.setEtat(EtatInscription.ANNULE);
                return InscriptionMapper.toDto(inscriptionRepo.save(ins));
        }

        @Transactional
        public InscriptionResponseDto suspendreInscription(Long id) {
                Inscription ins = inscriptionRepo.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Inscription introuvable"));

                ins.setEtat(EtatInscription.SUSPENDU);
                return InscriptionMapper.toDto(inscriptionRepo.save(ins));
        }

}
