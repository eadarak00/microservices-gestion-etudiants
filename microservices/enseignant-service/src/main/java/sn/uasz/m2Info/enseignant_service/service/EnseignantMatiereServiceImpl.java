package sn.uasz.m2Info.enseignant_service.service;

import sn.uasz.m2Info.enseignant_service.dto.EnseignantMatiereCreateDTO;
import sn.uasz.m2Info.enseignant_service.dto.EnseignantMatiereDTO;
import sn.uasz.m2Info.enseignant_service.entity.Enseignant;
import sn.uasz.m2Info.enseignant_service.entity.EnseignantMatiere;
import sn.uasz.m2Info.enseignant_service.exception.DuplicateResourceException;
import sn.uasz.m2Info.enseignant_service.exception.ResourceNotFoundException;
import sn.uasz.m2Info.enseignant_service.mapper.EnseignantMatiereMapper;
import sn.uasz.m2Info.enseignant_service.repository.EnseignantMatiereRepository;
import sn.uasz.m2Info.enseignant_service.repository.EnseignantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implémentation du service de gestion des affectations enseignant-matière
 * Contient la logique métier et l'enrichissement avec les données de classe-service
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class EnseignantMatiereServiceImpl implements EnseignantMatiereService {

    private final EnseignantMatiereRepository enseignantMatiereRepository;
    private final EnseignantRepository enseignantRepository;
    private final EnseignantMatiereMapper enseignantMatiereMapper;
    // TODO: Injecter le client REST pour classe-service
    // private final ClasseServiceClient classeServiceClient;

    @Override
    public EnseignantMatiereDTO affecter(EnseignantMatiereCreateDTO dto) {
        log.info("Affectation de l'enseignant {} à la matière {} pour l'année {}", 
                dto.getEnseignantId(), dto.getMatiereId(), dto.getAnneeScolaire());

        // Vérifier que l'enseignant existe
        Enseignant enseignant = enseignantRepository.findById(dto.getEnseignantId())
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant", "id", dto.getEnseignantId()));

        // TODO: Vérifier que la matière existe via classe-service
        // MatiereDTO matiere = classeServiceClient.getMatiereById(dto.getMatiereId());

        // Vérifier si l'affectation existe déjà
        if (enseignantMatiereRepository.existsByEnseignantIdAndMatiereIdAndAnneeScolaire(
                dto.getEnseignantId(), dto.getMatiereId(), dto.getAnneeScolaire())) {
            log.warn("Tentative d'affectation déjà existante");
            throw new DuplicateResourceException(
                    String.format("L'enseignant %s est déjà affecté à la matière %s pour l'année %s",
                            dto.getEnseignantId(), dto.getMatiereId(), dto.getAnneeScolaire()));
        }

        // Créer l'affectation
        EnseignantMatiere affectation = enseignantMatiereMapper.toEntity(dto);
        affectation.setEnseignant(enseignant);

        // Sauvegarder
        EnseignantMatiere saved = enseignantMatiereRepository.save(affectation);
        log.info("Affectation créée avec succès - ID: {}", saved.getId());

        // Convertir en DTO
        EnseignantMatiereDTO result = enseignantMatiereMapper.toDTO(saved);

        // TODO: Enrichir avec les détails de la matière depuis classe-service
        // result.setMatiereDetails(matiere);

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public EnseignantMatiereDTO getById(Long id) {
        log.debug("Récupération de l'affectation avec ID: {}", id);

        EnseignantMatiere affectation = enseignantMatiereRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Affectation", "id", id));

        EnseignantMatiereDTO dto = enseignantMatiereMapper.toDTO(affectation);

        // TODO: Enrichir avec les détails de la matière
        // enrichirAvecDetailsMatiere(dto);

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnseignantMatiereDTO> getMatieresByEnseignant(Long enseignantId) {
        log.debug("Récupération des matières de l'enseignant: {}", enseignantId);

        // Vérifier que l'enseignant existe
        if (!enseignantRepository.existsById(enseignantId)) {
            throw new ResourceNotFoundException("Enseignant", "id", enseignantId);
        }

        List<EnseignantMatiere> affectations = enseignantMatiereRepository.findByEnseignantId(enseignantId);
        List<EnseignantMatiereDTO> dtos = enseignantMatiereMapper.toMatieresDTOList(affectations);

        // TODO: Enrichir chaque DTO avec les détails des matières
        // dtos.forEach(this::enrichirAvecDetailsMatiere);

        return dtos;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnseignantMatiereDTO> getMatieresByEnseignantAndAnnee(Long enseignantId, String anneeScolaire) {
        log.debug("Récupération des matières de l'enseignant {} pour l'année {}", enseignantId, anneeScolaire);

        // Vérifier que l'enseignant existe
        if (!enseignantRepository.existsById(enseignantId)) {
            throw new ResourceNotFoundException("Enseignant", "id", enseignantId);
        }

        List<EnseignantMatiere> affectations = enseignantMatiereRepository
                .findByEnseignantIdAndAnneeScolaire(enseignantId, anneeScolaire);
        List<EnseignantMatiereDTO> dtos = enseignantMatiereMapper.toMatieresDTOList(affectations);

        // TODO: Enrichir avec les détails des matières
        // dtos.forEach(this::enrichirAvecDetailsMatiere);

        return dtos;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnseignantMatiereDTO> getEnseignantsByMatiere(Long matiereId) {
        log.debug("Récupération des enseignants de la matière: {}", matiereId);

        // TODO: Vérifier que la matière existe via classe-service

        List<EnseignantMatiere> affectations = enseignantMatiereRepository.findByMatiereIdWithEnseignant(matiereId);
        return enseignantMatiereMapper.toDTOList(affectations);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnseignantMatiereDTO> getAffectationsByAnnee(String anneeScolaire) {
        log.debug("Récupération des affectations pour l'année: {}", anneeScolaire);

        List<EnseignantMatiere> affectations = enseignantMatiereRepository.findByAnneeScolaire(anneeScolaire);
        return enseignantMatiereMapper.toDTOList(affectations);
    }

    @Override
    public void deleteAffectation(Long id) {
        log.info("Suppression de l'affectation avec ID: {}", id);

        if (!enseignantMatiereRepository.existsById(id)) {
            throw new ResourceNotFoundException("Affectation", "id", id);
        }

        enseignantMatiereRepository.deleteById(id);
        log.info("Affectation supprimée avec succès - ID: {}", id);
    }

    @Override
    public void deleteAffectationsByEnseignant(Long enseignantId) {
        log.info("Suppression de toutes les affectations de l'enseignant: {}", enseignantId);

        if (!enseignantRepository.existsById(enseignantId)) {
            throw new ResourceNotFoundException("Enseignant", "id", enseignantId);
        }

        enseignantMatiereRepository.deleteByEnseignantId(enseignantId);
        log.info("Affectations supprimées pour l'enseignant: {}", enseignantId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsAffectation(Long enseignantId, Long matiereId, String anneeScolaire) {
        return enseignantMatiereRepository.existsByEnseignantIdAndMatiereIdAndAnneeScolaire(
                enseignantId, matiereId, anneeScolaire);
    }

    @Override
    @Transactional(readOnly = true)
    public long countMatieresByEnseignant(Long enseignantId) {
        return enseignantMatiereRepository.countByEnseignantId(enseignantId);
    }

    // TODO: Méthode privée pour enrichir avec les détails de la matière
    /*
    private void enrichirAvecDetailsMatiere(EnseignantMatiereDTO dto) {
        try {
            MatiereDTO matiere = classeServiceClient.getMatiereById(dto.getMatiereId());
            EnseignantMatiereDTO.MatiereDetailsDTO details = EnseignantMatiereDTO.MatiereDetailsDTO.builder()
                    .id(matiere.getId())
                    .codeMatiere(matiere.getCodeMatiere())
                    .nomMatiere(matiere.getNomMatiere())
                    .build();
            dto.setMatiereDetails(details);
        } catch (Exception e) {
            log.warn("Impossible de récupérer les détails de la matière {}: {}", 
                    dto.getMatiereId(), e.getMessage());
            // On continue sans les détails de la matière
        }
    }
    */
}