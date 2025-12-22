package com.fitness.aiservice.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.fitness.aiservice.exception.CustomException;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor

public class ActivityMessageListener {

    private final ActivityAIService aiService;
    private final RecommendationRepository recommendationRepository;
    private final GeminiService geminiService;

    private static final int MAX_RETRIES = 3;

    @RabbitListener(queues = "activity.queue")
    public void processActivity(Activity activity) {
        log.info("Received activity for processing: {}", activity.getId());
        Recommendation recommendation = aiService.generateRecommendation(activity);
        if (recommendation == null) {
            log.warn("AI service returned null recommendation for activity: {}", activity.getId());
            return;
        }
        recommendationRepository.save(recommendation); // Removed dead code

        int retryCount = 0;
        boolean success = false;

        while (retryCount < MAX_RETRIES && !success) {
            try {
                geminiService.getAnswer(activity.getId()); // Pass the correct type (String) to GeminiService
                success = true;
            } catch (CustomException e) {
                retryCount++;
                log.error("Attempt {} failed: {}", retryCount, e.getMessage());
                if (retryCount >= MAX_RETRIES) {
                    log.error("Max retries reached. Failing activity processing.");
                    // Optionally send to a dead-letter queue or log the failure
                }
            }
        }
    }
}
