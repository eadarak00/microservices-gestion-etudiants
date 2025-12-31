package sn.uasz.m2info.enseignant_service.services;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.enseignant_service.dtos.EnseignantRequestDto;
import sn.uasz.m2info.enseignant_service.dtos.EnseignantResponseDto;
import sn.uasz.m2info.enseignant_service.entities.Enseignant;
import sn.uasz.m2info.enseignant_service.exceptions.ResourceNotFoundException;
import sn.uasz.m2info.enseignant_service.mappers.EnseignantMapper;
import sn.uasz.m2info.enseignant_service.repositories.EnseignantRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class EnseignantService {

    private final EnseignantRepository repo;

    public EnseignantResponseDto creer(EnseignantRequestDto dto) {
        Enseignant e = EnseignantMapper.toEntity(dto);
        return EnseignantMapper.toDto(repo.save(e));
    }

    public EnseignantResponseDto modifier(Long id, EnseignantRequestDto dto) {
        Enseignant e = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant introuvable"));
        EnseignantMapper.updateEntity(e, dto);
        return EnseignantMapper.toDto(repo.save(e));
    }

    public void supprimer(Long id) {
        repo.deleteById(id);
    }

    public EnseignantResponseDto getById(Long id) {
        return repo.findById(id)
                .map(EnseignantMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant introuvable"));
    }

    public List<EnseignantResponseDto> lister() {
        return repo.findAll()
                .stream()
                .map(EnseignantMapper::toDto)
                .toList();
    }
}