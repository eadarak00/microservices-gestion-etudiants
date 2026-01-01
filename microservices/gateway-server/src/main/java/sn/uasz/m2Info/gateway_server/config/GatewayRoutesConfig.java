package sn.uasz.m2Info.gateway_server.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Auth Service Routes
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .uri("lb://AUTH-SERVICE"))

                // Etudiant Service Routes
                .route("etudiant-service", r -> r
                        .path("/api/etudiants/**", "/api/inscriptions/**")
                        .uri("lb://ETUDIANT-SERVICE"))

                // Scolarite Service Routes
                .route("scolarite-service", r -> r
                        .path("/api/matieres/**", "/api/classes/**")
                        .uri("lb://SCOLARITE-SERVICE"))

                // Enseignant Service Routes
                .route("enseignant-service", r -> r
                        .path("/api/enseignants/**", "/api/affectations/**")
                        .uri("lb://ENSEIGNANT-SERVICE"))

                // Notes Service Routes
                .route("notes-service", r -> r
                        .path("/api/notes/**", "/api/evaluations/**")
                        .uri("lb://NOTES-SERVICE"))

                .build();
    }
}
