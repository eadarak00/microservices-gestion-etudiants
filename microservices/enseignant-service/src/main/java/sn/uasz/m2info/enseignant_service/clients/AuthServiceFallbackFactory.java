package sn.uasz.m2info.enseignant_service.clients;

import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;
import sn.uasz.m2info.enseignant_service.dtos.CreateUserRequest;
import sn.uasz.m2info.enseignant_service.exceptions.ServiceUnavailableException;

@Component
@Slf4j
public class AuthServiceFallbackFactory implements FallbackFactory<AuthServiceClient> {

    @Override
    public AuthServiceClient create(Throwable cause) {
        return new AuthServiceClient() {
            @Override
            public void createUser(CreateUserRequest request) {
                log.error("Erreur lors de l'appel à auth-service (createUser) : {}", cause.getMessage(), cause);
                throw new ServiceUnavailableException("AuthService is unavailable", cause);
            }

            @Override
            public void deleteUser(String username) {
                log.error("Erreur lors de l'appel à auth-service (deleteUser) : {}", cause.getMessage(), cause);
                throw new ServiceUnavailableException("AuthService is unavailable", cause);
            }
        };
    }
}
