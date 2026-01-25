package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.repository.RecommendationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
// Removed custom RabbitMQProperties
import org.springframework.stereotype.Service;
import reactor.core.scheduler.Schedulers;

@Service
public class ActivityMessageListener {

    private static final Logger log = LoggerFactory.getLogger(ActivityMessageListener.class);

    private final ActivityAIService aiService;
    private final RecommendationRepository recommendationRepository;
    public ActivityMessageListener(ActivityAIService aiService, RecommendationRepository recommendationRepository) {
        this.aiService = aiService;
        this.recommendationRepository = recommendationRepository;
    }

    @RabbitListener(queues = "${activity.rabbitmq.queue}", autoStartup = "true")
    public void processActivity(Activity activity) {
        log.info("Received activity for processing: {}", activity.getId());

        // Reactive processing with blocking persistence offloaded
        aiService.generateRecommendation(activity)
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(recommendation -> {
                    log.info("Generated Recommendation for activity {}: {}", activity.getId(), recommendation.getRecommendation());
                    recommendationRepository.save(recommendation);
                })
                .doOnError(error -> log.error("Error generating recommendation for activity {}: {}", activity.getId(), error.getMessage()))
                .subscribe();
    }
}
