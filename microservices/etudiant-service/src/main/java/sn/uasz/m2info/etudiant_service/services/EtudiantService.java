package sn.uasz.m2info.etudiant_service.services;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.etudiant_service.dtos.EtudiantRequestDto;
import sn.uasz.m2info.etudiant_service.dtos.EtudiantResponseDto;
import sn.uasz.m2info.etudiant_service.entities.Etudiant;
import sn.uasz.m2info.etudiant_service.exceptions.ResourceNotFoundException;
import sn.uasz.m2info.etudiant_service.mappers.EtudiantMapper;
import sn.uasz.m2info.etudiant_service.repositories.EtudiantRepository;
import sn.uasz.m2info.etudiant_service.repositories.InscriptionRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class EtudiantService {

    private final EtudiantRepository repo;
    private final InscriptionRepository inscriptionRepo;
    
    String message = "Étudiant introuvable";


    public EtudiantResponseDto creer(EtudiantRequestDto dto) {
        Etudiant e = EtudiantMapper.toEntity(dto);
        return EtudiantMapper.toDto(repo.save(e));
    }

    public EtudiantResponseDto modifier(Long id, EtudiantRequestDto dto) {
        Etudiant e = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(message));
        EtudiantMapper.updateEntity(e, dto);
        return EtudiantMapper.toDto(repo.save(e));
    }

    public void supprimer(Long id) {
        repo.deleteById(id);
    }

    public EtudiantResponseDto getById(Long id) {
        return EtudiantMapper.toDto(
                repo.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException(message))
        );
    }

    public EtudiantResponseDto getByMatricule(String matricule) {
        return EtudiantMapper.toDto(
                repo.findByMatricule(matricule)
                    .orElseThrow(() -> new ResourceNotFoundException(message))
        );
    }

    public List<EtudiantResponseDto> getByClasse(Long classeId) {
        return inscriptionRepo.findByClasseId(classeId)
                .stream()
                .map(i -> EtudiantMapper.toDto(i.getEtudiant()))
                .toList();
    }
}
