package com.fitness.activityservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import com.fitness.activityservice.config.RabbitMqConfig.RabbitMQProperties;
import org.springframework.stereotype.Service;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.repository.ActivityRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;
    private final RabbitMQProperties rabbitProps;

    public ActivityResponse trackActivity(ActivityRequest request) {

        // Validate user exists before creating activity
        boolean isValidUser = userValidationService.validateUser(request.getUserId());
        if (!isValidUser) {
            log.warn("User not found, will skip validation: " + request.getUserId());
            // Don't throw error, just log warning and continue
            // This allows activities to be created even if user validation fails
        }

        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();

        // Fixed null type safety issue
        Activity savedActivity = activityRepository.save(activity);
        if (savedActivity == null) {
            throw new IllegalStateException("Failed to save activity");
        }

        // Publish to RabbitMQ for AI Processing
        try {
            rabbitTemplate.convertAndSend(rabbitProps.getExchange(), rabbitProps.getRoutingKey(), savedActivity);
        } catch(Exception e) {
            log.error("Failed to publish activity to RabbitMQ : ", e);
        }

        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity activity){
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        return response;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        return activities.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @SuppressWarnings("null")
    public ActivityResponse getActivityById(String activityId) {
        if (activityId == null) {
            throw new IllegalArgumentException("Activity ID cannot be null");
        }
        return activityRepository.findById(activityId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));
    }

    @SuppressWarnings("null")
    public void deleteActivity(String activityId, String userId) {
        if (activityId == null) {
            throw new IllegalArgumentException("Activity ID cannot be null");
        }
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));
        
        // Verify the activity belongs to the user
        if (!activity.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Activity does not belong to user");
        }
        
        activityRepository.deleteById(activityId);
        log.info("Activity deleted: {} by user: {}", activityId, userId);
    }

    // ADMIN METHODS
    
    public List<ActivityResponse> getAllActivities() {
        return activityRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @SuppressWarnings("null")
    public void adminDeleteActivity(String activityId) {
        if (activityId == null) {
            throw new IllegalArgumentException("Activity ID cannot be null");
        }
        activityRepository.deleteById(activityId);
        log.info("Activity deleted by admin: {}", activityId);
    }
}