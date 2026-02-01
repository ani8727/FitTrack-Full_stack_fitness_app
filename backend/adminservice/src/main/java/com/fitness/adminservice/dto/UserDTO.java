package com.fitness.adminservice.dto;

import java.time.Instant;

public class UserDTO {
    private Long id;
    private String auth0Id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String accountStatus;
    private Instant createdAt;
    private Instant updatedAt;

    public UserDTO() {}

    public UserDTO(Long id, String auth0Id, String email, String firstName, String lastName, String role, String accountStatus, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.auth0Id = auth0Id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.accountStatus = accountStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public String getAuth0Id() { return auth0Id; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getRole() { return role; }
    public String getAccountStatus() { return accountStatus; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}

