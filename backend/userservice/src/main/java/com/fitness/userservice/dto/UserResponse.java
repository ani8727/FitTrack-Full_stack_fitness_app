package com.fitness.userservice.dto;

import com.fitness.userservice.model.Gender;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {

    private String id;
    private String keycloakId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String accountStatus;
    private Boolean emailVerified;
    private java.time.LocalDateTime lastLoginAt;
    private Gender gender;
    private Integer age;
    private String location;
    private String fitnessGoals;
    private String areasToImprove;
    private String weaknesses;
    private String healthIssues;
    private Double height;
    private Double weight;
    private String activityLevel;
    private String dietaryPreferences;
    private Integer targetWeeklyWorkouts;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

}
