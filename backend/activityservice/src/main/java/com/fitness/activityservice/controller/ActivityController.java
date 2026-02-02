package com.fitness.activityservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.service.ActivityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(@RequestBody ActivityRequest request, @RequestHeader("X-User-ID") String userId){
        if (userId != null) {
            request.setUserId(userId);
        }
        return ResponseEntity.ok(activityService.trackActivity(request));
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivities(@RequestHeader("X-User-ID") String userId){
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }


    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivity(@PathVariable String activityId){
        return ResponseEntity.ok(activityService.getActivityById(activityId));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats(@RequestHeader("X-User-ID") String userId){
        List<ActivityResponse> activities = activityService.getUserActivities(userId);
        
        int count = activities.size();
        int totalDuration = activities.stream().mapToInt(ActivityResponse::getDuration).sum();
        int totalCalories = activities.stream().mapToInt(ActivityResponse::getCaloriesBurned).sum();
        double avgCalories = count > 0 ? (double) totalCalories / count : 0;
        
        return ResponseEntity.ok(new java.util.HashMap<String, Object>() {{
            put("count", count);
            put("totalDurationMinutes", totalDuration);
            put("totalCaloriesBurned", totalCalories);
            put("avgCaloriesPerActivity", avgCalories);
        }});
    }

    @DeleteMapping("/{activityId}")
    public ResponseEntity<Void> deleteActivity(@PathVariable String activityId, @RequestHeader("X-User-ID") String userId){
        activityService.deleteActivity(activityId, userId);
        return ResponseEntity.ok().build();
    }

    // ADMIN ENDPOINTS
    
    @GetMapping("/admin/activities")
    public ResponseEntity<List<ActivityResponse>> getAllActivities(){
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    @GetMapping("/admin/activities/stats")
    public ResponseEntity<?> getAdminStats(){
        List<ActivityResponse> activities = activityService.getAllActivities();
        
        int totalActivities = activities.size();
        int totalDuration = activities.stream().mapToInt(ActivityResponse::getDuration).sum();
        int totalCalories = activities.stream().mapToInt(ActivityResponse::getCaloriesBurned).sum();
        long uniqueUsers = activities.stream().map(ActivityResponse::getUserId).distinct().count();
        
        return ResponseEntity.ok(new java.util.HashMap<String, Object>() {{
            put("totalActivities", totalActivities);
            put("totalDurationMinutes", totalDuration);
            put("totalCaloriesBurned", totalCalories);
            put("uniqueUsers", uniqueUsers);
        }});
    }

    @DeleteMapping("/admin/activities/{activityId}")
    public ResponseEntity<Void> adminDeleteActivity(@PathVariable String activityId){
        activityService.adminDeleteActivity(activityId);
        return ResponseEntity.ok().build();
    }
}