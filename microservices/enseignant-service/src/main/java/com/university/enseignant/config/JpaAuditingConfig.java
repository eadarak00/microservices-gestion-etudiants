package com.university.enseignant.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Configuration pour activer l'audit automatique JPA
 * Permet l'utilisation de @CreatedDate et @LastModifiedDate dans les entités
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
    // Cette classe active l'audit JPA
    // Les champs annotés avec @CreatedDate et @LastModifiedDate
    // seront automatiquement remplis par Spring Data JPA
}