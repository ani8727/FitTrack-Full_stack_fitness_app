package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RecommendationService {
    private final RecommendationRepository recommendationRepository;

    public RecommendationService(RecommendationRepository recommendationRepository) {
        this.recommendationRepository = recommendationRepository;
    }

    public List<Recommendation> getUserRecommendation(String userId) {
        return recommendationRepository.findByUserId(userId);
    }

    public Recommendation getActivityRecommendation(String activityId) {
        return recommendationRepository.findByActivityId(activityId)
            .orElseGet(() -> {
                Recommendation fallback = new Recommendation();
                fallback.setActivityId(activityId);
                fallback.setGenerated(false);
                fallback.setRecommendation("No AI recommendation generated for this activity yet.");
                fallback.setCreatedAt(LocalDateTime.now());
                return fallback;
            });
    }
}
