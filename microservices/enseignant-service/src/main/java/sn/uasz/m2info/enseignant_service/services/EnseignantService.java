package sn.uasz.m2info.enseignant_service.services;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.enseignant_service.clients.AuthServiceClient;
import sn.uasz.m2info.enseignant_service.dtos.CreateUserRequest;
import sn.uasz.m2info.enseignant_service.dtos.EnseignantRequestDto;
import sn.uasz.m2info.enseignant_service.dtos.EnseignantResponseDto;
import sn.uasz.m2info.enseignant_service.entities.Enseignant;
import sn.uasz.m2info.enseignant_service.exceptions.ResourceNotFoundException;
import sn.uasz.m2info.enseignant_service.mappers.EnseignantMapper;
import sn.uasz.m2info.enseignant_service.repositories.EnseignantRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import sn.uasz.m2info.enseignant_service.exceptions.ServiceUnavailableException;

@Service
@Transactional
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class EnseignantService {

    private final EnseignantRepository repo;
    private final AuthServiceClient authClient;

    @CircuitBreaker(name = "auth-service", fallbackMethod = "creerFallback")
    public EnseignantResponseDto creer(EnseignantRequestDto dto) {

        if (repo.findByMatricule(dto.getMatricule()).isPresent()) {
            throw new ResourceNotFoundException("Matricule déjà utilisé");
        }

        boolean userCreated = false;

        try {
            // Création utilisateur Keycloak
            authClient.createUser(buildUser(dto));
            userCreated = true;

            // Créer enseignant (DB locale)
            Enseignant enseignant = EnseignantMapper.toEntity(dto);
            Enseignant saved = repo.save(enseignant);

            return EnseignantMapper.toDto(saved);

        } catch (Exception ex) {
            log.error("Erreur lors de la création de l'enseignant : {}", ex.getMessage(), ex);

            // Compensation (SAGA pattern)
            if (userCreated) {
                try {
                    authClient.deleteUser(dto.getMatricule());
                } catch (Exception e) {
                    log.error("Erreur lors de la compensation (suppression utilisateur) : {}", e.getMessage(), e);
                }
            }

            throw new ResourceNotFoundException(
                    "Création enseignant échouée, opération annulée", ex);
        }
    }

    private CreateUserRequest buildUser(EnseignantRequestDto dto) {
        CreateUserRequest user = new CreateUserRequest();
        user.setUsername(dto.getEmail());
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getPrenom());
        user.setLastName(dto.getNom());
        user.setPassword(dto.getPassword());
        user.setRole("ENSEIGNANT");
        return user;
    }

    public EnseignantResponseDto modifier(Long id, EnseignantRequestDto dto) {
        Enseignant e = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant introuvable"));
        EnseignantMapper.updateEntity(e, dto);
        return EnseignantMapper.toDto(repo.save(e));
    }

    public void supprimer(Long id) {
        repo.deleteById(id);
    }

    public EnseignantResponseDto getById(Long id) {
        return repo.findById(id)
                .map(EnseignantMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant introuvable"));
    }

    public List<EnseignantResponseDto> lister() {
        return repo.findAll()
                .stream()
                .map(EnseignantMapper::toDto)
                .toList();
    }

    public EnseignantResponseDto creerFallback(EnseignantRequestDto dto, Throwable t) {
        throw new ServiceUnavailableException("Le service d'authentification est indisponible.");
    }
}