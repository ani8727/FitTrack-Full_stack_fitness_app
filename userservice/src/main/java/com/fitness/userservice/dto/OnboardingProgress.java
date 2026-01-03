package com.fitness.userservice.dto;

import lombok.Data;

@Data
public class OnboardingProgress {
    private boolean profileCompleted;
    private boolean firstActivityLogged;
    private boolean firstRecommendationViewed;
    private boolean dailyPlanGenerated;
    private int completionPercentage;
    
    public OnboardingProgress() {
        this.profileCompleted = false;
        this.firstActivityLogged = false;
        this.firstRecommendationViewed = false;
        this.dailyPlanGenerated = false;
        this.completionPercentage = 0;
    }
    
    public void calculateCompletionPercentage() {
        int completed = 0;
        if (profileCompleted) completed += 25;
        if (firstActivityLogged) completed += 25;
        if (firstRecommendationViewed) completed += 25;
        if (dailyPlanGenerated) completed += 25;
        this.completionPercentage = completed;
    }
    
    public boolean isComplete() {
        return completionPercentage == 100;
    }
}
