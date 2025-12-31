package com.example.ms_scolarite.dto;

import com.example.ms_scolarite.feign.EtudiantResponse;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InscriptionResponse {
    private Long id;
    private Long etudiantId;
    private EtudiantResponse etudiant;
    private Classedto classe;
    private LocalDate dateInscription;
    private String statut;
}
