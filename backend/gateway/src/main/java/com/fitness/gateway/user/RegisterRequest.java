package com.fitness.gateway.user;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
public class RegisterRequest {

    @Email(message = "Invalid email format")
    private String email;

    // Password is only used for auto-provisioned users; may be null for token-based flows
    @Size(min=6, message="password must have at least 6 characters")
    private String password;

    private String keycloakId;

    private String firstName;
    private String lastName;

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getKeycloakId() {
        return keycloakId;
    }
    public void setKeycloakId(String keycloakId) {
        this.keycloakId = keycloakId;
    }
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

}
