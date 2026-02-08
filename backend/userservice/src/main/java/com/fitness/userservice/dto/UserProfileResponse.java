package com.fitness.userservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileResponse {
    private String firstName;
    private String lastName;
    private String email;

    // Additional fields used by the frontend UI. We don't persist these yet.
    private Integer age;
    private String gender;
    private Double height;
    private Double weight;
    private String activityLevel;
    private String fitnessGoals;
    private String areasToImprove;
    private String weaknesses;
    private String healthIssues;
    private String dietaryPreferences;
    private Integer targetWeeklyWorkouts;
    private String location;
}
