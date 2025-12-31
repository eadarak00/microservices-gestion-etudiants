package sn.uasz.m2info.enseignant_service.mappers;

import sn.uasz.m2info.enseignant_service.dtos.EnseignantRequestDto;
import sn.uasz.m2info.enseignant_service.dtos.EnseignantResponseDto;
import sn.uasz.m2info.enseignant_service.entities.Enseignant;

public class EnseignantMapper {

    private EnseignantMapper() {}

    public static Enseignant toEntity(EnseignantRequestDto dto) {
        return Enseignant.builder()
                .matricule(dto.getMatricule())
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .email(dto.getEmail())
                .telephone(dto.getTelephone())
                .specialite(dto.getSpecialite())
                .build();
    }

    public static void updateEntity(Enseignant e, EnseignantRequestDto dto) {
        e.setNom(dto.getNom());
        e.setPrenom(dto.getPrenom());
        e.setEmail(dto.getEmail());
        e.setTelephone(dto.getTelephone());
        e.setSpecialite(dto.getSpecialite());
    }

    public static EnseignantResponseDto toDto(Enseignant e) {
        return EnseignantResponseDto.builder()
                .id(e.getId())
                .matricule(e.getMatricule())
                .nom(e.getNom())
                .prenom(e.getPrenom())
                .email(e.getEmail())
                .telephone(e.getTelephone())
                .specialite(e.getSpecialite())
                .build();
    }
}
