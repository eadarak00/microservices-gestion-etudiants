package sn.uasz.m2info.etudiant_service.dtos;

import java.time.LocalDate;
import lombok.Data;
import sn.uasz.m2info.etudiant_service.entities.EtatInscription;

@Data
public class InscriptionResponseDto {

    private Long id;
    private LocalDate dateInscription;
    private EtatInscription etat;
    private Long classeId;

    // infos minimales étudiant
    private Long etudiantId;
    private String matricule;
    private String nom;
    private String prenom;
}
