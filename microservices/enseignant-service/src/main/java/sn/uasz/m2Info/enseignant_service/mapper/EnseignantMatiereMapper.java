package sn.uasz.m2Info.enseignant_service.mapper;

import sn.uasz.m2Info.enseignant_service.dto.EnseignantMatiereCreateDTO;
import sn.uasz.m2Info.enseignant_service.dto.EnseignantMatiereDTO;
import sn.uasz.m2Info.enseignant_service.entity.EnseignantMatiere;
import org.mapstruct.*;

import java.util.List;

/**
 * Mapper MapStruct pour convertir entre EnseignantMatiere et ses DTOs
 * MapStruct génère automatiquement l'implémentation à la compilation
 */
@Mapper(
    componentModel = "spring",
    injectionStrategy = InjectionStrategy.CONSTRUCTOR
)
public interface EnseignantMatiereMapper {

    /**
     * Convertit une entité EnseignantMatiere en DTO
     * Inclut les informations de l'enseignant
     */
    @Mapping(target = "enseignantId", source = "enseignant.id")
    @Mapping(target = "enseignant", source = "enseignant", qualifiedByName = "toEnseignantDTO")
    @Mapping(target = "matiereDetails", ignore = true) // Sera rempli par le service via REST
    EnseignantMatiereDTO toDTO(EnseignantMatiere enseignantMatiere);

    /**
     * Convertit une entité EnseignantMatiere en DTO sans l'enseignant
     * Utilisé pour éviter les références circulaires
     */
    @Named("toDTOWithoutEnseignant")
    @Mapping(target = "enseignantId", source = "enseignant.id")
    @Mapping(target = "enseignant", ignore = true)
    @Mapping(target = "matiereDetails", ignore = true)
    EnseignantMatiereDTO toDTOWithoutEnseignant(EnseignantMatiere enseignantMatiere);

    /**
     * Convertit une liste d'entités en liste de DTOs sans l'enseignant
     * Utilisé quand on récupère les matières d'un enseignant
     */
    @Named("toMatieresDTOList")
    @IterableMapping(qualifiedByName = "toDTOWithoutEnseignant")
    List<EnseignantMatiereDTO> toMatieresDTOList(List<EnseignantMatiere> matieres);

    /**
     * Convertit une liste d'entités en liste de DTOs avec l'enseignant
     */
    List<EnseignantMatiereDTO> toDTOList(List<EnseignantMatiere> matieres);

    /**
     * Convertit un DTO de création en entité
     * L'enseignant sera défini par le service
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "enseignant", ignore = true) // Sera défini par le service
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateModification", ignore = true)
    EnseignantMatiere toEntity(EnseignantMatiereCreateDTO dto);

    /**
     * Mapping personnalisé pour l'enseignant (sans matières pour éviter cycle)
     * Utilisé par @Mapping(qualifiedByName = "toEnseignantDTO")
     */
    @Named("toEnseignantDTO")
    @Mapping(target = "matieres", ignore = true)
    sn.uasz.m2Info.enseignant_service.dto.EnseignantDTO toEnseignantDTO(sn.uasz.m2Info.enseignant_service.entity.Enseignant enseignant);
}