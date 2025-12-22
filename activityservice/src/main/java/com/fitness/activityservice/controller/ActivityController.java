package com.fitness.activityservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.service.ActivityService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
@Slf4j
public class ActivityController {

    private ActivityService activityService;

    @PostMapping
    public ResponseEntity trackActivity(
            @Valid @RequestBody ActivityRequest request,
            @RequestHeader(value = "X-User-ID", required = true) String userId) {
        
        log.info("Received track activity request for user: {}", userId);
        
        // Set userId from header
        request.setUserId(userId);
        
        ActivityResponse response = activityService.trackActivity(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List> getUserActivities(
            @RequestHeader(value = "X-User-ID", required = true) String userId) {
        
        log.info("Fetching activities for user: {}", userId);
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }

    @GetMapping("/{activityId}")
    public ResponseEntity getActivity(
            @PathVariable String activityId) {
        return ResponseEntity.ok(activityService.getActivityById(activityId));
    }
}