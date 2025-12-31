package com.example.ms_scolarite.feign;

import lombok.Data;
import java.time.LocalDate;

@Data
public class EtudiantResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String adresse;
    private String telephone;
    private String sexe;
    private LocalDate dateNaissance;
    private String matricule;
}
