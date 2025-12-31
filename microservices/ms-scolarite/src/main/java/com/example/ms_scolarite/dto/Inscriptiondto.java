package com.example.ms_scolarite.dto;

import java.time.LocalDate;
import com.example.ms_scolarite.model.Classe;
import lombok.Data;

@Data
public class Inscriptiondto {
    private Long etudiantId;
    private Classe classe;
    private LocalDate dateInscription;
    private String statut;
}
