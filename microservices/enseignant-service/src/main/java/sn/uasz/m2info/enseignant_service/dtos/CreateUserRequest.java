package sn.uasz.m2info.enseignant_service.dtos;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private String role;
}