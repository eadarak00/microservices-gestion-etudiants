package sn.uasz.m2info.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import sn.uasz.m2info.auth.dto.LoginRequest;
import sn.uasz.m2info.auth.service.KeycloakAuthService;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final KeycloakAuthService authService;

    public AuthController(KeycloakAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        return authService.login(request.username(), request.password());
    }
}