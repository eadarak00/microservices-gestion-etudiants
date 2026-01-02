package sn.uasz.m2Info.enseignant_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entité représentant l'affectation d'un enseignant à une matière
 * La matière elle-même est gérée par le microservice classe-service
 */
@Entity
@Table(name = "enseignant_matiere", indexes = {
    @Index(name = "idx_enseignant_id", columnList = "enseignant_id"),
    @Index(name = "idx_matiere_id", columnList = "matiere_id"),
    @Index(name = "idx_annee_scolaire", columnList = "annee_scolaire")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnseignantMatiere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relation ManyToOne avec Enseignant
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enseignant_id", nullable = false, foreignKey = @ForeignKey(name = "fk_enseignant_matiere_enseignant"))
    @NotNull(message = "L'enseignant est obligatoire")
    private Enseignant enseignant;

    // Référence vers la matière (gérée par classe-service)
    @NotNull(message = "L'ID de la matière est obligatoire")
    @Column(name = "matiere_id", nullable = false)
    private Long matiereId;

    @NotBlank(message = "L'année scolaire est obligatoire")
    @Pattern(regexp = "^\\d{4}-\\d{4}$", message = "L'année scolaire doit être au format YYYY-YYYY (ex: 2025-2026)")
    @Column(name = "annee_scolaire", nullable = false, length = 9)
    private String anneeScolaire;

    @NotNull(message = "La date d'affectation est obligatoire")
    @PastOrPresent(message = "La date d'affectation ne peut pas être dans le futur")
    @Column(name = "date_affectation", nullable = false)
    private LocalDate dateAffectation;

    @CreatedDate
    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @LastModifiedDate
    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @PrePersist
    protected void onCreate() {
        if (dateAffectation == null) {
            dateAffectation = LocalDate.now();
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EnseignantMatiere)) return false;
        EnseignantMatiere that = (EnseignantMatiere) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "EnseignantMatiere{" +
                "id=" + id +
                ", enseignantId=" + (enseignant != null ? enseignant.getId() : null) +
                ", matiereId=" + matiereId +
                ", anneeScolaire='" + anneeScolaire + '\'' +
                ", dateAffectation=" + dateAffectation +
                '}';
    }
}