package sn.uasz.m2info.etudiant_service.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import sn.uasz.m2info.etudiant_service.entities.EtatInscription;

@Data
public class ChangerEtatInscriptionDto {
    @NotNull
    private EtatInscription etat;
}
