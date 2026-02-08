package com.fitness.userservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserProfileRequest {
    private String firstName;
    private String lastName;

    // The frontend sends many additional profile fields (age, height, goals, etc).
    // We intentionally ignore unknown fields to stay backward-compatible.
}
