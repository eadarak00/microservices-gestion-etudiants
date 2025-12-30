package sn.uasz.m2info.scolarite_service.services;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.scolarite_service.dtos.MatiereRequestDto;
import sn.uasz.m2info.scolarite_service.dtos.MatiereResponseDto;
import sn.uasz.m2info.scolarite_service.entities.Matiere;
import sn.uasz.m2info.scolarite_service.exceptions.ResourceNotFoundException;
import sn.uasz.m2info.scolarite_service.mappers.MatiereMapper;
import sn.uasz.m2info.scolarite_service.repositories.MatiereRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class MatiereService {

    private final MatiereRepository repo;

    public MatiereResponseDto creer(MatiereRequestDto dto) {

        if (repo.existsByCode(dto.getCode())) {
            throw new IllegalStateException("Code matière déjà existant");
        }

        Matiere matiere = MatiereMapper.toEntity(dto);
        return MatiereMapper.toDto(repo.save(matiere));
    }

    public MatiereResponseDto modifier(Long id, MatiereRequestDto dto) {

        Matiere matiere = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Matière introuvable"));

        MatiereMapper.updateEntity(matiere, dto);
        return MatiereMapper.toDto(repo.save(matiere));
    }

    public void supprimer(Long id) {
        repo.deleteById(id);
    }

    public MatiereResponseDto getById(Long id) {
        return MatiereMapper.toDto(
                repo.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Matière introuvable"))
        );
    }

    public MatiereResponseDto getByCode(String code) {
        return MatiereMapper.toDto(
                repo.findByCode(code)
                    .orElseThrow(() -> new ResourceNotFoundException("Matière introuvable"))
        );
    }

    public List<MatiereResponseDto> getAll() {
        return repo.findAll()
                .stream()
                .map(MatiereMapper::toDto)
                .toList();
    }
}