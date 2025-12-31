package com.example.ms_scolarite.service;

import com.example.ms_scolarite.dto.Inscriptiondto;
import com.example.ms_scolarite.dto.InscriptionRequest;
import com.example.ms_scolarite.dto.InscriptionResponse;
import com.example.ms_scolarite.feign.EtudiantClient;
import com.example.ms_scolarite.feign.EtudiantResponse;
import com.example.ms_scolarite.mapper.InscriptionMapper;
import com.example.ms_scolarite.model.Classe;
import com.example.ms_scolarite.model.Inscription;
import com.example.ms_scolarite.repository.ClasseRepository;
import com.example.ms_scolarite.repository.InscriptionRepository;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InscriptionServiceImpl implements InscriptionService {

    private final InscriptionRepository inscriptionRepository;
    private final ClasseRepository classeRepository;
    private final ObjectProvider<EtudiantClient> etudiantClientProvider;
    private final InscriptionMapper inscriptionMapper;

    public InscriptionServiceImpl(
            InscriptionRepository inscriptionRepository,
            ClasseRepository classeRepository,
            ObjectProvider<EtudiantClient> etudiantClientProvider,
            InscriptionMapper inscriptionMapper) {
        this.inscriptionRepository = inscriptionRepository;
        this.classeRepository = classeRepository;
        this.etudiantClientProvider = etudiantClientProvider;
        this.inscriptionMapper = inscriptionMapper;
    }

    @Override
    public InscriptionResponse createInscription(InscriptionRequest request) {

        if (request == null || request.getEtudiantId() == null || request.getClasseId() == null) {
            throw new IllegalArgumentException("Requête invalide : etudiantId et classeId sont requis");
        }

        // Récupération des informations de l'étudiant via Feign avec circuit breaker
        EtudiantResponse etudiant = null;
        EtudiantClient client = etudiantClientProvider.getIfAvailable();

        if (client != null) {
            // Le circuit breaker est configuré dans EtudiantClient
            // Il retournera automatiquement les données de fallback si le service est down
            etudiant = client.getEtudiantById(request.getEtudiantId());
        } else {
            // Fallback local si le client Feign n'est pas disponible
            etudiant = new EtudiantResponse();
            etudiant.setId(request.getEtudiantId());
            etudiant.setNom("Service Étudiant Indisponible");
            etudiant.setPrenom("N/A");
        }

        // Récupération de la classe
        Classe classe = classeRepository.findById(request.getClasseId())
                .orElseThrow(() -> new RuntimeException("Classe non trouvée avec l'ID: " + request.getClasseId()));

        // Création de l'inscription
        Inscription inscription = new Inscription();
        inscription.setEtudiantId(etudiant.getId());
        inscription.setClasse(classe);
        inscription.setDateInscription(LocalDate.now());
        inscription.setStatut("ACTIVE");

        // Sauvegarde de l'inscription
        Inscription savedInscription = inscriptionRepository.save(inscription);

        // Création de la réponse enrichie avec les informations de l'étudiant
        return inscriptionMapper.toResponse(savedInscription, etudiant);
    }

    @Override
    public List<Inscriptiondto> getAllInscriptions() {
        return inscriptionRepository.findAll().stream()
                .map(inscriptionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Inscriptiondto getInscriptionById(Long id) {
        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        return inscriptionMapper.toDto(inscription);
    }

    @Override
    public Inscriptiondto updateInscription(Long id, Long classeId, String statut) {
        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));

        if (classeId != null) {
            Classe classe = classeRepository.findById(classeId)
                    .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
            inscription.setClasse(classe);
        }

        if (statut != null) {
            inscription.setStatut(statut);
        }

        Inscription updatedInscription = inscriptionRepository.save(inscription);
        return inscriptionMapper.toDto(updatedInscription);
    }

    @Override
    public void deleteInscription(Long id) {
        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        inscriptionRepository.delete(inscription);
    }

    @Override
    public List<Inscriptiondto> getInscriptionsByEtudiant(Long etudiantId) {
        return inscriptionRepository.findByEtudiantId(etudiantId).stream()
                .map(inscriptionMapper::toDto)
                .collect(Collectors.toList());
    }
}
