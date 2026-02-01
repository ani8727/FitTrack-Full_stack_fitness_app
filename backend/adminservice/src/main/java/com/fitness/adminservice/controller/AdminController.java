package com.fitness.adminservice.controller;

import java.util.List;
import java.util.Map;

import com.fitness.adminservice.dto.ActivityDTO;
import com.fitness.adminservice.dto.UserDTO;
import com.fitness.adminservice.dto.WorkoutDTO;
import com.fitness.adminservice.service.AdminFacadeService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminFacadeService facade;

    // All /admin/** endpoints require ADMIN role via SecurityConfig

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> listUsers() {
        return ResponseEntity.ok(facade.listUsers());
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        facade.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/activities")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityDTO>> listActivities() {
        return ResponseEntity.ok(facade.listActivities());
    }

    @DeleteMapping("/activities/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        facade.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/workouts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<WorkoutDTO>> listWorkouts() {
        return ResponseEntity.ok(facade.listWorkouts());
    }

    @DeleteMapping("/workouts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        facade.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> stats() {
        return ResponseEntity.ok(facade.stats());
    }
}

