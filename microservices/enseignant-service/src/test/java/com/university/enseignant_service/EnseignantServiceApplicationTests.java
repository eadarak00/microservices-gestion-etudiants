package com.university.enseignant_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.university.enseignant.EnseignantServiceApplication; // <-- import explicite

@SpringBootTest(classes = EnseignantServiceApplication.class) // <-- classe principale précisée
@ActiveProfiles("test") // <-- profil test activé
class EnseignantServiceApplicationTests {

    @Test
    void contextLoads() {
        // Vérifie que le contexte Spring se charge correctement avec le profil test
    }
}
