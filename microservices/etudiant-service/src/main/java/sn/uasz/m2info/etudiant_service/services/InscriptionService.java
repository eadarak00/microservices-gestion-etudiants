package sn.uasz.m2info.etudiant_service.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.etudiant_service.dtos.InscriptionResponseDto;
import sn.uasz.m2info.etudiant_service.entities.EtatInscription;
import sn.uasz.m2info.etudiant_service.entities.Etudiant;
import sn.uasz.m2info.etudiant_service.entities.Inscription;
import sn.uasz.m2info.etudiant_service.exceptions.ResourceNotFoundException;
import sn.uasz.m2info.etudiant_service.mappers.InscriptionMapper;
import sn.uasz.m2info.etudiant_service.repositories.EtudiantRepository;
import sn.uasz.m2info.etudiant_service.repositories.InscriptionRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class InscriptionService {

    private final InscriptionRepository inscriptionRepo;
    private final EtudiantRepository etudiantRepo;

    public InscriptionResponseDto inscrire(Long etudiantId, Long classeId) {

        Etudiant etudiant = etudiantRepo.findById(etudiantId)
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant introuvable"));

        inscriptionRepo.findByEtudiantIdAndClasseId(etudiantId, classeId)
                .ifPresent(i -> {
                    throw new IllegalStateException("Étudiant déjà inscrit dans cette classe");
                });

        Inscription inscription = new Inscription();
        inscription.setEtudiant(etudiant);
        inscription.setClasseId(classeId);
        inscription.setDateInscription(LocalDate.now());
        inscription.setEtat(EtatInscription.ACTIF);

        return InscriptionMapper.toDto(inscriptionRepo.save(inscription));
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
}

