package com.example.ms_scolarite.mapper;

import com.example.ms_scolarite.dto.Inscriptiondto;
import com.example.ms_scolarite.dto.InscriptionResponse;
import com.example.ms_scolarite.feign.EtudiantResponse;
import com.example.ms_scolarite.model.Inscription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class InscriptionMapper {

    @Autowired
    private ClasseMapper classeMapper;

    /**
     * Convertit une entité Inscription en DTO
     * 
     * @param inscription L'entité Inscription
     * @return Le DTO Inscriptiondto
     */
    public Inscriptiondto toDto(Inscription inscription) {
        if (inscription == null) {
            return null;
        }

        Inscriptiondto dto = new Inscriptiondto();
        dto.setEtudiantId(inscription.getEtudiantId());
        dto.setClasse(inscription.getClasse());
        dto.setDateInscription(inscription.getDateInscription());
        dto.setStatut(inscription.getStatut());

        return dto;
    }

    /**
     * Convertit une entité Inscription avec les informations de l'étudiant en
     * InscriptionResponse
     * 
     * @param inscription L'entité Inscription
     * @param etudiant    Les informations de l'étudiant récupérées via Feign
     * @return Le DTO InscriptionResponse enrichi
     */
    public InscriptionResponse toResponse(Inscription inscription, EtudiantResponse etudiant) {
        if (inscription == null) {
            return null;
        }

        InscriptionResponse response = new InscriptionResponse();
        response.setId(inscription.getId());
        response.setEtudiantId(inscription.getEtudiantId());
        response.setEtudiant(etudiant);
        response.setClasse(classeMapper.toDto(inscription.getClasse()));
        response.setDateInscription(inscription.getDateInscription());
        response.setStatut(inscription.getStatut());

        return response;
    }

    /**
     * Convertit un DTO en entité Inscription
     * 
     * @param dto Le DTO Inscriptiondto
     * @return L'entité Inscription
     */
    public Inscription toEntity(Inscriptiondto dto) {
        if (dto == null) {
            return null;
        }

        Inscription inscription = new Inscription();
        inscription.setEtudiantId(dto.getEtudiantId());
        inscription.setClasse(dto.getClasse());
        inscription.setDateInscription(dto.getDateInscription());
        inscription.setStatut(dto.getStatut());

        return inscription;
    }

    /**
     * Met à jour une entité Inscription existante avec les données du DTO
     * 
     * @param dto         Le DTO contenant les nouvelles données
     * @param inscription L'entité à mettre à jour
     * @return L'entité mise à jour
     */
    public Inscription updateEntity(Inscriptiondto dto, Inscription inscription) {
        if (dto == null || inscription == null) {
            return inscription;
        }

        inscription.setEtudiantId(dto.getEtudiantId());
        inscription.setClasse(dto.getClasse());
        inscription.setDateInscription(dto.getDateInscription());
        inscription.setStatut(dto.getStatut());

        return inscription;
    }
}
