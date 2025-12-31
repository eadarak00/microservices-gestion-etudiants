package com.example.ms_scolarite.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.ms_scolarite.dto.Classedto;
import com.example.ms_scolarite.mapper.ClasseMapper;
import com.example.ms_scolarite.model.Classe;
import com.example.ms_scolarite.repository.ClasseRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClasseServiceImpl implements ClasseService {

    private final ClasseRepository classeRepository;
    private final ClasseMapper classeMapper;

    @Override
    public Classedto createClasse(Classedto classeDto) {
        if (classeDto.getLibelle() == null || classeDto.getLibelle().trim().isEmpty()) {
            throw new IllegalArgumentException("Le libellé de la classe ne peut pas être nul ou vide");
        }
        if (classeDto.getNiveau() == null || classeDto.getNiveau().trim().isEmpty()) {
            throw new IllegalArgumentException("Le niveau de la classe ne peut pas être nul ou vide");
        }
        if (classeDto.getAnnee() == null || classeDto.getAnnee().trim().isEmpty()) {
            throw new IllegalArgumentException("L'année de la classe ne peut pas être nulle ou vide");
        }

        Classe classe = classeMapper.toEntity(classeDto);
        Classe savedClasse = classeRepository.save(classe);
        return classeMapper.toDto(savedClasse);
    }

    @Override
    public List<Classedto> getAllClasses() {
        return classeRepository.findAll().stream()
                .map(classeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Classedto getClasseById(Long id) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
        return classeMapper.toDto(classe);
    }

    @Override
    public Classedto updateClasse(Long id, Classedto classeDto) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));

        classeMapper.updateEntity(classeDto, classe);
        Classe updatedClasse = classeRepository.save(classe);
        return classeMapper.toDto(updatedClasse);
    }

    @Override
    public void deleteClasse(Long id) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
        classeRepository.delete(classe);
    }
}
