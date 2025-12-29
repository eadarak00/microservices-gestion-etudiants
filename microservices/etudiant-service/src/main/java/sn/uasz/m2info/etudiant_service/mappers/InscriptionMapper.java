package sn.uasz.m2info.etudiant_service.mappers;

import sn.uasz.m2info.etudiant_service.dtos.InscriptionResponseDto;
import sn.uasz.m2info.etudiant_service.entities.Inscription;

public class InscriptionMapper {
    
    private InscriptionMapper() {
    }

    public static InscriptionResponseDto toDto(Inscription i) {
        InscriptionResponseDto dto = new InscriptionResponseDto();
        dto.setId(i.getId());
        dto.setDateInscription(i.getDateInscription());
        dto.setEtat(i.getEtat());
        dto.setClasseId(i.getClasseId());

        dto.setEtudiantId(i.getEtudiant().getId());
        dto.setMatricule(i.getEtudiant().getMatricule());
        dto.setNom(i.getEtudiant().getNom());
        dto.setPrenom(i.getEtudiant().getPrenom());

        return dto;
    }
}
