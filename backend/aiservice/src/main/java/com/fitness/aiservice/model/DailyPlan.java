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
    }
}
