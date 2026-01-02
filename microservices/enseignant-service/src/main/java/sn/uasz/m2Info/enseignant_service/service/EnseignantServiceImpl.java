package sn.uasz.m2Info.enseignant_service.service;

import sn.uasz.m2Info.enseignant_service.dto.EnseignantCreateDTO;
import sn.uasz.m2Info.enseignant_service.dto.EnseignantDTO;
import sn.uasz.m2Info.enseignant_service.dto.EnseignantUpdateDTO;
import sn.uasz.m2Info.enseignant_service.entity.Enseignant;
import sn.uasz.m2Info.enseignant_service.exception.DuplicateResourceException;
import sn.uasz.m2Info.enseignant_service.exception.ResourceNotFoundException;
import sn.uasz.m2Info.enseignant_service.mapper.EnseignantMapper;
import sn.uasz.m2Info.enseignant_service.repository.EnseignantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implémentation du service de gestion des enseignants
 * Contient toute la logique métier
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class EnseignantServiceImpl implements EnseignantService {

    private final EnseignantRepository enseignantRepository;
    private final EnseignantMapper enseignantMapper;

    @Override
    public EnseignantDTO create(EnseignantCreateDTO dto) {
        log.info("Création d'un nouvel enseignant avec matricule: {}", dto.getMatriculeEns());

        // Vérifier si le matricule existe déjà
        if (enseignantRepository.existsByMatriculeEns(dto.getMatriculeEns())) {
            log.warn("Tentative de création d'un enseignant avec un matricule existant: {}", dto.getMatriculeEns());
            throw new DuplicateResourceException("Enseignant", "matricule", dto.getMatriculeEns());
        }

        // Vérifier si l'email existe déjà
        if (enseignantRepository.existsByEmail(dto.getEmail())) {
            log.warn("Tentative de création d'un enseignant avec un email existant: {}", dto.getEmail());
            throw new DuplicateResourceException("Enseignant", "email", dto.getEmail());
        }

        // Convertir DTO → Entity
        Enseignant enseignant = enseignantMapper.toEntity(dto);

        // Sauvegarder en base
        Enseignant saved = enseignantRepository.save(enseignant);
        log.info("Enseignant créé avec succès - ID: {}, Matricule: {}", saved.getId(), saved.getMatriculeEns());

        // Convertir Entity → DTO et retourner
        return enseignantMapper.toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EnseignantDTO getById(Long id) {
        log.debug("Récupération de l'enseignant avec ID: {}", id);

        Enseignant enseignant = enseignantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant", "id", id));

        return enseignantMapper.toDTO(enseignant);
    }

    @Override
    @Transactional(readOnly = true)
    public EnseignantDTO getByMatricule(String matricule) {
        log.debug("Récupération de l'enseignant avec matricule: {}", matricule);

        Enseignant enseignant = enseignantRepository.findByMatriculeEns(matricule)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant", "matricule", matricule));

        return enseignantMapper.toDTO(enseignant);
    }

    @Override
    @Transactional(readOnly = true)
    public EnseignantDTO getByIdWithMatieres(Long id) {
        log.debug("Récupération de l'enseignant avec ID: {} et ses matières", id);

        Enseignant enseignant = enseignantRepository.findByIdWithMatieres(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant", "id", id));

        // TODO: Enrichir les matières avec les détails depuis classe-service
        return enseignantMapper.toDTO(enseignant);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnseignantDTO> getAll() {
        log.debug("Récupération de tous les enseignants");

        List<Enseignant> enseignants = enseignantRepository.findAll();
        return enseignantMapper.toDTOList(enseignants);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnseignantDTO> searchByNom(String nom) {
        log.debug("Recherche d'enseignants par nom: {}", nom);

        List<Enseignant> enseignants = enseignantRepository.findByNomContainingIgnoreCase(nom);
        return enseignantMapper.toDTOList(enseignants);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnseignantDTO> getBySpecialite(String specialite) {
        log.debug("Récupération des enseignants par spécialité: {}", specialite);

        List<Enseignant> enseignants = enseignantRepository.findBySpecialite(specialite);
        return enseignantMapper.toDTOList(enseignants);
    }

    @Override
    public EnseignantDTO update(Long id, EnseignantUpdateDTO dto) {
        log.info("Mise à jour de l'enseignant avec ID: {}", id);

        // Vérifier que l'enseignant existe
        Enseignant enseignant = enseignantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant", "id", id));

        // Vérifier si l'email existe déjà (sauf pour cet enseignant)
        if (!enseignant.getEmail().equals(dto.getEmail()) && 
            enseignantRepository.existsByEmail(dto.getEmail())) {
            log.warn("Tentative de mise à jour avec un email existant: {}", dto.getEmail());
            throw new DuplicateResourceException("Enseignant", "email", dto.getEmail());
        }

        // Mettre à jour les champs
        enseignantMapper.updateEntityFromDTO(dto, enseignant);

        // Sauvegarder
        Enseignant updated = enseignantRepository.save(enseignant);
        log.info("Enseignant mis à jour avec succès - ID: {}", updated.getId());

        return enseignantMapper.toDTO(updated);
    }

    @Override
    public void delete(Long id) {
        log.info("Suppression de l'enseignant avec ID: {}", id);

        // Vérifier que l'enseignant existe
        if (!enseignantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Enseignant", "id", id);
        }

        enseignantRepository.deleteById(id);
        log.info("Enseignant supprimé avec succès - ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return enseignantRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByMatricule(String matricule) {
        return enseignantRepository.existsByMatriculeEns(matricule);
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return enseignantRepository.count();
    }
}