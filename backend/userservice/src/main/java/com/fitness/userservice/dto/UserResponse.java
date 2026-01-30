package com.fitness.userservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String auth0Id;
    private String email;
    private String name;
    private String role;
    private LocalDateTime createdAt;
}
