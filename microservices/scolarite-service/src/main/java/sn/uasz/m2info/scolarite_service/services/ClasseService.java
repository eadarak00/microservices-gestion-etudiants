package sn.uasz.m2info.scolarite_service.services;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.scolarite_service.dtos.ClasseRequestDto;
import sn.uasz.m2info.scolarite_service.dtos.ClasseResponseDto;
import sn.uasz.m2info.scolarite_service.entities.Classe;
import sn.uasz.m2info.scolarite_service.exceptions.ResourceNotFoundException;
import sn.uasz.m2info.scolarite_service.mappers.ClasseMapper;
import sn.uasz.m2info.scolarite_service.repositories.ClasseRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class ClasseService {

    private final ClasseRepository repo;

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
                    .orElseThrow(() -> new ResourceNotFoundException("Classe introuvable"))
        );
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
}