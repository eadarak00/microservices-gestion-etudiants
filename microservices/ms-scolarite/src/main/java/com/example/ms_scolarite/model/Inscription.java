package com.example.ms_scolarite.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import java.time.LocalDate;

@Entity
@Table(name = "inscription")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Inscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private Long etudiantId; // référence externe
    @ManyToOne
    @JoinColumn(name = "classe_id")
    private Classe classe;

    private LocalDate dateInscription;
    private String statut;
}
