package sn.uasz.m2info.auth.service;

import lombok.RequiredArgsConstructor;
import sn.uasz.m2info.auth.dto.CreateUserRequest;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KeycloakAdminService {

    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    public void createUser(CreateUserRequest dto) {

        UsersResource users = keycloak.realm(realm).users();

        UserRepresentation user = new UserRepresentation();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEnabled(true);

        users.create(user);

        // récupérer l'utilisateur créé
        UserRepresentation createdUser = users.search(dto.getUsername()).get(0);

        // mot de passe
        CredentialRepresentation pwd = new CredentialRepresentation();
        pwd.setType(CredentialRepresentation.PASSWORD);
        pwd.setValue(dto.getPassword());
        pwd.setTemporary(false);

        users.get(createdUser.getId()).resetPassword(pwd);

        // rôle
        RoleRepresentation role = keycloak
                .realm(realm)
                .roles()
                .get(dto.getRole())
                .toRepresentation();

        users.get(createdUser.getId())
                .roles()
                .realmLevel()
                .add(List.of(role));
    }
}
