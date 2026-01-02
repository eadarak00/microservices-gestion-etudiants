package sn.uasz.m2Info.enseignant_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entité représentant un enseignant
 */
@Entity
@Table(name = "enseignant", uniqueConstraints = {
    @UniqueConstraint(name = "uk_enseignant_matricule", columnNames = "matricule_ens"),
    @UniqueConstraint(name = "uk_enseignant_email", columnNames = "email")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enseignant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le matricule est obligatoire")
    @Size(min = 3, max = 20, message = "Le matricule doit contenir entre 3 et 20 caractères")
    @Column(name = "matricule_ens", nullable = false, unique = true, length = 20)
    private String matriculeEns;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    @Column(name = "nom", nullable = false, length = 100)
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 100, message = "Le prénom doit contenir entre 2 et 100 caractères")
    @Column(name = "prenom", nullable = false, length = 100)
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email doit être valide")
    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Pattern(regexp = "^(\\+221)?\\d{9}$", message = "Le numéro de téléphone doit être valide (format: +221XXXXXXXXX ou XXXXXXXXX)")
    @Column(name = "telephone", length = 20)
    private String telephone;

    @Size(max = 100, message = "La spécialité ne doit pas dépasser 100 caractères")
    @Column(name = "specialite", length = 100)
    private String specialite;

    @CreatedDate
    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @LastModifiedDate
    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    // Relation OneToMany avec EnseignantMatiere
    @OneToMany(mappedBy = "enseignant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<EnseignantMatiere> matieres = new ArrayList<>();

    // Méthodes utilitaires pour gérer la relation bidirectionnelle
    public void addMatiere(EnseignantMatiere matiere) {
        matieres.add(matiere);
        matiere.setEnseignant(this);
    }

    public void removeMatiere(EnseignantMatiere matiere) {
        matieres.remove(matiere);
        matiere.setEnseignant(null);
    }

    @Override
    public String toString() {
        return "Enseignant{" +
                "id=" + id +
                ", matriculeEns='" + matriculeEns + '\'' +
                ", nom='" + nom + '\'' +
                ", prenom='" + prenom + '\'' +
                ", email='" + email + '\'' +
                ", telephone='" + telephone + '\'' +
                ", specialite='" + specialite + '\'' +
                '}';
    }
}