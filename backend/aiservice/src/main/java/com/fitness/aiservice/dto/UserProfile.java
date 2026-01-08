package com.fitness.aiservice.dto;

import lombok.Data;

@Data
public class UserProfile {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String gender;
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
