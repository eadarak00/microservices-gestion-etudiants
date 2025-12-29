package sn.uasz.m2info.etudiant_service.mappers;

import sn.uasz.m2info.etudiant_service.dtos.*;
import sn.uasz.m2info.etudiant_service.entities.Etudiant;

public class EtudiantMapper {

    private EtudiantMapper() {
    }

    public static Etudiant toEntity(EtudiantRequestDto dto) {
        Etudiant e = new Etudiant();
        e.setMatricule(dto.getMatricule());
        e.setNom(dto.getNom());
        e.setPrenom(dto.getPrenom());
        e.setDateNaissance(dto.getDateNaissance());
        e.setAdresse(dto.getAdresse());
        e.setEmail(dto.getEmail());
        e.setTelephone(dto.getTelephone());
        e.setSexe(dto.getSexe());
        return e;
    }

    public static EtudiantResponseDto toDto(Etudiant e) {
        EtudiantResponseDto dto = new EtudiantResponseDto();
        dto.setId(e.getId());
        dto.setMatricule(e.getMatricule());
        dto.setNom(e.getNom());
        dto.setPrenom(e.getPrenom());
        dto.setDateNaissance(e.getDateNaissance());
        dto.setAdresse(e.getAdresse());
        dto.setEmail(e.getEmail());
        dto.setTelephone(e.getTelephone());
        dto.setSexe(e.getSexe());
        return dto;
    }

    public static void updateEntity(Etudiant e, EtudiantRequestDto dto) {
        e.setNom(dto.getNom());
        e.setPrenom(dto.getPrenom());
        e.setDateNaissance(dto.getDateNaissance());
        e.setAdresse(dto.getAdresse());
        e.setEmail(dto.getEmail());
        e.setTelephone(dto.getTelephone());
        e.setSexe(dto.getSexe());
    }
}
