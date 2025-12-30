package sn.uasz.m2info.etudiant_service.clients;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import sn.uasz.m2info.etudiant_service.dtos.CreateUserRequest;
import sn.uasz.m2info.etudiant_service.exceptions.ServiceUnavailableException;

@Component
@Slf4j
public class AuthServiceFallback implements AuthServiceClient {

    @Override
    public void createUser(CreateUserRequest request) {
        throw new ServiceUnavailableException(
                "Auth-service indisponible. Réessayer plus tard.");
    }

    @Override
    public void deleteUser(String username) {
        // LOG uniquement — ne pas re-throw
        log.warn("Impossible de supprimer l'utilisateur Keycloak : " + username);
    }
}