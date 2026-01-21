package com.fitness.gateway.user;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @Email(message = "Invalid email format")
    private String email;

    // Password is only used for auto-provisioned users; may be null for token-based flows
    @Size(min=6, message="password must have at least 6 characters")
    private String password;

    private String keycloakId;

    private String firstName;
    private String lastName;

}
