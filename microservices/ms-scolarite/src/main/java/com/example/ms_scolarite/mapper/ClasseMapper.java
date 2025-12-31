package com.example.ms_scolarite.mapper;

import com.example.ms_scolarite.dto.Classedto;
import com.example.ms_scolarite.model.Classe;
import org.springframework.stereotype.Component;

@Component
public class ClasseMapper {

    /**
     * Convertit une entité Classe en DTO
     * 
     * @param classe L'entité Classe
     * @return Le DTO Classedto
     */
    public Classedto toDto(Classe classe) {
        if (classe == null) {
            return null;
        }

        Classedto dto = new Classedto();
        dto.setLibelle(classe.getLibelle());
        dto.setNiveau(classe.getNiveau());
        dto.setAnnee(classe.getAnnee());

        return dto;
    }

    /**
     * Convertit un DTO en entité Classe
     * 
     * @param dto Le DTO Classedto
     * @return L'entité Classe
     */
    public Classe toEntity(Classedto dto) {
        if (dto == null) {
            return null;
        }

        Classe classe = new Classe();
        classe.setLibelle(dto.getLibelle());
        classe.setNiveau(dto.getNiveau());
        classe.setAnnee(dto.getAnnee());

        return classe;
    }

    /**
     * Met à jour une entité Classe existante avec les données du DTO
     * 
     * @param dto    Le DTO contenant les nouvelles données
     * @param classe L'entité à mettre à jour
     * @return L'entité mise à jour
     */
    public Classe updateEntity(Classedto dto, Classe classe) {
        if (dto == null || classe == null) {
            return classe;
        }

        classe.setLibelle(dto.getLibelle());
        classe.setNiveau(dto.getNiveau());
        classe.setAnnee(dto.getAnnee());

        return classe;
    }
}
