package com.fitness.aiservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "daily_plans")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DailyPlan {
    
    @Id
    private String id;
    private String userId;
    private LocalDate planDate;
    private String morningRoutine;
    private List<WorkoutPlan> workouts;
    private String nutritionAdvice;
    private String hydrationReminder;
    private List<String> goals;
    private String motivationalQuote;
    private Integer targetSteps;
    private Integer targetCalories;
    private String restAndRecovery;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Explicit getters and setters to ensure IDE recognition
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public LocalDate getPlanDate() { return planDate; }
    public void setPlanDate(LocalDate planDate) { this.planDate = planDate; }
    
    public String getMorningRoutine() { return morningRoutine; }
    public void setMorningRoutine(String morningRoutine) { this.morningRoutine = morningRoutine; }
    
    public List<WorkoutPlan> getWorkouts() { return workouts; }
    public void setWorkouts(List<WorkoutPlan> workouts) { this.workouts = workouts; }
    
    public String getNutritionAdvice() { return nutritionAdvice; }
    public void setNutritionAdvice(String nutritionAdvice) { this.nutritionAdvice = nutritionAdvice; }
    
    public String getHydrationReminder() { return hydrationReminder; }
    public void setHydrationReminder(String hydrationReminder) { this.hydrationReminder = hydrationReminder; }
    
    public List<String> getGoals() { return goals; }
    public void setGoals(List<String> goals) { this.goals = goals; }
    
    public String getMotivationalQuote() { return motivationalQuote; }
    public void setMotivationalQuote(String motivationalQuote) { this.motivationalQuote = motivationalQuote; }
    
    public Integer getTargetSteps() { return targetSteps; }
    public void setTargetSteps(Integer targetSteps) { this.targetSteps = targetSteps; }
    
    public Integer getTargetCalories() { return targetCalories; }
    public void setTargetCalories(Integer targetCalories) { this.targetCalories = targetCalories; }
    
    public String getRestAndRecovery() { return restAndRecovery; }
    public void setRestAndRecovery(String restAndRecovery) { this.restAndRecovery = restAndRecovery; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class WorkoutPlan {
        private String time;
        private String type;
        private Integer duration;
        private String intensity;
        private String description;
        private List<String> exercises;
        
        // Explicit getters and setters
        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public Integer getDuration() { return duration; }
        public void setDuration(Integer duration) { this.duration = duration; }
        
        public String getIntensity() { return intensity; }
        public void setIntensity(String intensity) { this.intensity = intensity; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public List<String> getExercises() { return exercises; }
        public void setExercises(List<String> exercises) { this.exercises = exercises; }
    }
}
