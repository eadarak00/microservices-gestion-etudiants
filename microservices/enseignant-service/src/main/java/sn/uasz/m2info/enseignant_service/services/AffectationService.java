package sn.uasz.m2info.enseignant_service.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.enseignant_service.clients.ScolariteClient;
import sn.uasz.m2info.enseignant_service.dtos.AffectationRequestDto;
import sn.uasz.m2info.enseignant_service.dtos.AffectationResponseDto;
import sn.uasz.m2info.enseignant_service.dtos.ClasseDto;
import sn.uasz.m2info.enseignant_service.dtos.MatiereDto;
import sn.uasz.m2info.enseignant_service.entities.Affectation;
import sn.uasz.m2info.enseignant_service.entities.Enseignant;
import sn.uasz.m2info.enseignant_service.exceptions.ResourceNotFoundException;
import sn.uasz.m2info.enseignant_service.mappers.AffectationMapper;
import sn.uasz.m2info.enseignant_service.repositories.AffectationRepository;
import sn.uasz.m2info.enseignant_service.repositories.EnseignantRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import sn.uasz.m2info.enseignant_service.exceptions.ServiceUnavailableException;

@Service
@RequiredArgsConstructor
@Transactional
public class AffectationService {

    private final AffectationRepository repo;
    private final EnseignantRepository enseignantRepo;
    private final ScolariteClient scolariteClient;

    //create affectation
    @CircuitBreaker(name = "scolarite-service", fallbackMethod = "affecterFallback")
    public AffectationResponseDto affecter(AffectationRequestDto dto) {

        // Vérifier enseignant
        Enseignant enseignant = enseignantRepo.findById(dto.getEnseignantId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Enseignant introuvable"));

        // Vérifier classe (ms-scolarite)
        ClasseDto classe = scolariteClient.getClasse(dto.getClasseId());
        if (classe.getId() == null) {
            throw new IllegalStateException(
                    "Classe inexistante ou service scolarité indisponible"
            );
        }

        // Vérifier matière (ms-scolarite)
        MatiereDto matiere = scolariteClient.getMatiere(dto.getMatiereId());
        if (matiere.getId() == null) {
            throw new IllegalStateException(
                    "Matière inexistante ou service scolarité indisponible"
            );
        }

        //  Vérifier unicité classe + matière
        if (repo.existsByClasseIdAndMatiereId(dto.getClasseId(), dto.getMatiereId())) {
            throw new IllegalStateException(
                    "Cette matière est déjà affectée à cette classe"
            );
        }

        // 5Création affectation
        Affectation affectation = new Affectation();
        affectation.setClasseId(dto.getClasseId());
        affectation.setMatiereId(dto.getMatiereId());
        affectation.setEnseignant(enseignant);

        return AffectationMapper.toDto(repo.save(affectation));
    }

    public List<AffectationResponseDto> getByClasse(Long classeId) {
        return repo.findByClasseId(classeId)
                .stream()
                .map(AffectationMapper::toDto)
                .toList();
    }

    public List<AffectationResponseDto> getByEnseignant(Long enseignantId) {
        return repo.findByEnseignantId(enseignantId)
                .stream()
                .map(AffectationMapper::toDto)
                .toList();
    }

    public AffectationResponseDto affecterFallback(AffectationRequestDto dto, Throwable t) {
        throw new ServiceUnavailableException("Le service scolarité est indisponible.");
    }
}
