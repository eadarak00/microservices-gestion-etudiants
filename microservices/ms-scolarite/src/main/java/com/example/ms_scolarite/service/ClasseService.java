package com.example.ms_scolarite.service;

import com.example.ms_scolarite.dto.Classedto;

import java.util.List;

public interface ClasseService {

    Classedto createClasse(Classedto classeDto);

    List<Classedto> getAllClasses();

    Classedto getClasseById(Long id);

    Classedto updateClasse(Long id, Classedto classeDto);

    void deleteClasse(Long id);
}