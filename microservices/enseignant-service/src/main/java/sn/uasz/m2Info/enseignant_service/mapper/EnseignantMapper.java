package sn.uasz.m2Info.enseignant_service.mapper;

import sn.uasz.m2Info.enseignant_service.dto.EnseignantCreateDTO;
import sn.uasz.m2Info.enseignant_service.dto.EnseignantDTO;
import sn.uasz.m2Info.enseignant_service.dto.EnseignantUpdateDTO;
import sn.uasz.m2Info.enseignant_service.entity.Enseignant;
import org.mapstruct.*;

import java.util.List;

/**
 * Mapper MapStruct pour convertir entre Enseignant et ses DTOs
 * MapStruct génère automatiquement l'implémentation à la compilation
 */
@Mapper(
    componentModel = "spring",
    uses = {EnseignantMatiereMapper.class},
    injectionStrategy = InjectionStrategy.CONSTRUCTOR
)
public interface EnseignantMapper {

    /**
     * Convertit une entité Enseignant en DTO
     * Inclut la liste des matières si elle est chargée
     */
    @Mapping(target = "matieres", qualifiedByName = "toMatieresDTOList")
    EnseignantDTO toDTO(Enseignant enseignant);

    /**
     * Convertit une entité Enseignant en DTO sans les matières
     * Utilisé pour éviter les références circulaires
     */
    @Named("toDTOWithoutMatieres")
    @Mapping(target = "matieres", ignore = true)
    EnseignantDTO toDTOWithoutMatieres(Enseignant enseignant);

    /**
     * Convertit une liste d'entités en liste de DTOs
     */
    List<EnseignantDTO> toDTOList(List<Enseignant> enseignants);

    /**
     * Convertit un DTO de création en entité
     * Les champs non présents dans le DTO (id, dates, matieres) sont ignorés
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateModification", ignore = true)
    @Mapping(target = "matieres", ignore = true)
    Enseignant toEntity(EnseignantCreateDTO dto);

    /**
     * Met à jour une entité existante avec les données du DTO
     * Ignore les champs qui ne doivent pas être modifiés
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "matriculeEns", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateModification", ignore = true)
    @Mapping(target = "matieres", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(EnseignantUpdateDTO dto, @MappingTarget Enseignant enseignant);
}