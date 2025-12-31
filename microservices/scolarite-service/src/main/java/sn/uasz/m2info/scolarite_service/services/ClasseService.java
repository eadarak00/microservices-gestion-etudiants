package sn.uasz.m2info.scolarite_service.services;

import java.util.List;

import org.springframework.stereotype.Service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sn.uasz.m2info.scolarite_service.clients.EtudiantClient;
import sn.uasz.m2info.scolarite_service.dtos.ClasseRequestDto;
import sn.uasz.m2info.scolarite_service.dtos.ClasseResponseDto;
import sn.uasz.m2info.scolarite_service.dtos.EtudiantResponseDto;
import sn.uasz.m2info.scolarite_service.entities.Classe;
import sn.uasz.m2info.scolarite_service.exceptions.ResourceNotFoundException;
import sn.uasz.m2info.scolarite_service.mappers.ClasseMapper;
import sn.uasz.m2info.scolarite_service.repositories.ClasseRepository;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ClasseService {

    private final ClasseRepository repo;
    private final EtudiantClient etudiantClient;

    public ClasseResponseDto creer(ClasseRequestDto dto) {

        if (repo.existsByLibelleAndAnneeAcademique(
                dto.getLibelle(), dto.getAnneeAcademique())) {
            throw new IllegalStateException("Classe déjà existante pour cette année");
        }

        Classe classe = ClasseMapper.toEntity(dto);
        return ClasseMapper.toDto(repo.save(classe));
    }

    public ClasseResponseDto modifier(Long id, ClasseRequestDto dto) {

        Classe classe = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classe introuvable"));

        ClasseMapper.updateEntity(classe, dto);
        return ClasseMapper.toDto(repo.save(classe));
    }

    public void supprimer(Long id) {
        repo.deleteById(id);
    }

    public ClasseResponseDto getById(Long id) {
        return ClasseMapper.toDto(
                repo.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Classe introuvable")));
    }

    public List<ClasseResponseDto> getAll() {
        return repo.findAll()
                .stream()
                .map(ClasseMapper::toDto)
                .toList();
    }

    public List<ClasseResponseDto> getByNiveau(Integer niveau) {
        return repo.findByNiveau(niveau)
                .stream()
                .map(ClasseMapper::toDto)
                .toList();
    }

    public List<ClasseResponseDto> getByAnnee(String anneeAcademique) {
        return repo.findByAnneeAcademique(anneeAcademique)
                .stream()
                .map(ClasseMapper::toDto)
                .toList();
    }

    public boolean classeExists(Long id) {
        return repo.existsById(id);
    }

    @CircuitBreaker(name = "etudiantService", fallbackMethod = "getClasseAvecEtudiantsFallback")
    public List<EtudiantResponseDto> getClasseAvecEtudiants(Long classeId) {
        List<EtudiantResponseDto> etudiants = etudiantClient.getEtudiantsByClasse(classeId);
        log.info("nombre d'etudiants dans la classe {} : {}", classeId, etudiants.size());
        return etudiants;
    }

    public List<EtudiantResponseDto> getClasseAvecEtudiantsFallback(Long classeId, Throwable t) {
        log.error("Erreur lors de la récupération des etudiants de la classe {} : {}", classeId, t.getMessage());
        return java.util.Collections.emptyList();
    }
}