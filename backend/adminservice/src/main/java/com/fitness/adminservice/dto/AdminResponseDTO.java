package com.fitness.adminservice.dto;

import java.time.Instant;

public class AdminResponseDTO {
    private Long id;
    private String auth0Id;
    private String email;
    private String name;
    private String role;
    private Instant createdAt;

    public AdminResponseDTO() {}

    public AdminResponseDTO(Long id, String auth0Id, String email, String name, String role, Instant createdAt) {
        this.id = id;
        this.auth0Id = auth0Id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getAuth0Id() {
        return auth0Id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
