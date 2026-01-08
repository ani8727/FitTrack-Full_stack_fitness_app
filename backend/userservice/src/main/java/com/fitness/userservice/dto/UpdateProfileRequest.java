package com.fitness.userservice.dto;

import com.fitness.userservice.model.Gender;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String email;
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
}
