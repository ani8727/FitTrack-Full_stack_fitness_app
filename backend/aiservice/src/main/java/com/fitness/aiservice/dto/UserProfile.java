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
    
    // Explicit getters and setters for IDE recognition
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getFitnessGoals() { return fitnessGoals; }
    public void setFitnessGoals(String fitnessGoals) { this.fitnessGoals = fitnessGoals; }
    
    public String getAreasToImprove() { return areasToImprove; }
    public void setAreasToImprove(String areasToImprove) { this.areasToImprove = areasToImprove; }
    
    public String getWeaknesses() { return weaknesses; }
    public void setWeaknesses(String weaknesses) { this.weaknesses = weaknesses; }
    
    public String getHealthIssues() { return healthIssues; }
    public void setHealthIssues(String healthIssues) { this.healthIssues = healthIssues; }
    
    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }
    
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    
    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }
    
    public String getDietaryPreferences() { return dietaryPreferences; }
    public void setDietaryPreferences(String dietaryPreferences) { this.dietaryPreferences = dietaryPreferences; }
    
    public Integer getTargetWeeklyWorkouts() { return targetWeeklyWorkouts; }
    public void setTargetWeeklyWorkouts(Integer targetWeeklyWorkouts) { this.targetWeeklyWorkouts = targetWeeklyWorkouts; }
}
