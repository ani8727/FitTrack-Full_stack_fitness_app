package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAIService aiService;
    private final RecommendationRepository recommendationRepository;

    @RabbitListener(queues = "activity.queue")
    public void processActivity(Activity activity) {
        log.info("Received activity for processing: {}", activity.getId());

        // Reactive / non-blocking processing
        aiService.generateRecommendation(activity)
                .doOnNext(recommendation -> {
                    log.info("Generated Recommendation for activity {}: {}", activity.getId(), recommendation.getRecommendation());
                    recommendationRepository.save(recommendation);
                })
                .doOnError(error -> log.error("Error generating recommendation for activity {}: {}", activity.getId(), error.getMessage()))
                .subscribe(); // Trigger execution
    }
}
