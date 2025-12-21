package com.fitness.activityservice.dto;

import com.fitness.activityservice.modal.ActivityType;
import com.fitness.activityservice.validation.ValidActivityType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityRequest {

    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotNull(message = "Activity type is required")
    @ValidActivityType
    private ActivityType type;
    
    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer duration;
    
    @NotNull(message = "Calories burned is required")
    @Min(value = 0, message = "Calories burned cannot be negative")
    private Integer caloriesBurned;
    
    private LocalDateTime startTime;
    private Map<String, Object> additionalMetrics;

}
