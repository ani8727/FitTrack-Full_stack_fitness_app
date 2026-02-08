package com.fitness.adminservice.controller;

import java.util.List;
import java.util.Map;

import com.fitness.adminservice.dto.ActivityDTO;
import com.fitness.adminservice.dto.UserDTO;
// workouts removed (no upstream workout service)
import com.fitness.adminservice.service.AdminFacadeService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    public ResponseEntity<List<UserDTO>> listUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status) {
        // status is currently not persisted in userservice; keep param for API compatibility.
        List<UserDTO> users = facade.listUsers();
        if (users == null) {
            return ResponseEntity.ok(List.of());
        }

        java.util.stream.Stream<UserDTO> stream = users.stream().filter(java.util.Objects::nonNull);
        if (search != null && !search.isBlank()) {
            String q = search.trim().toLowerCase();
            stream = stream.filter(u ->
                    (u.getEmail() != null && u.getEmail().toLowerCase().contains(q)) ||
                    (u.getFirstName() != null && u.getFirstName().toLowerCase().contains(q)) ||
                    (u.getLastName() != null && u.getLastName().toLowerCase().contains(q)) ||
                    (u.getId() != null && u.getId().toLowerCase().contains(q))
            );
        }
        if (role != null && !role.isBlank()) {
            String r = role.trim().toUpperCase();
            stream = stream.filter(u -> u.getRole() != null && u.getRole().trim().toUpperCase().equals(r));
        }
        // status currently ignored

        return ResponseEntity.ok(stream.toList());
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(facade.getUser(id));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        facade.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUser(@PathVariable Long id, @org.springframework.web.bind.annotation.RequestBody UserDTO user) {
        facade.updateUser(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/activities")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityDTO>> listActivities() {
        return ResponseEntity.ok(facade.listActivities());
    }

    @DeleteMapping("/activities/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteActivity(@PathVariable String id) {
        facade.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUserRole(
            @PathVariable String id,
            @RequestBody(required = false) java.util.Map<String, Object> body) {
        String role = body != null ? String.valueOf(body.getOrDefault("role", "")) : "";
        facade.updateUserRole(id, role);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUserStatus(
            @PathVariable String id,
            @RequestBody(required = false) java.util.Map<String, Object> body) {
        String status = body != null ? String.valueOf(body.getOrDefault("status", "")) : "";
        String reason = body != null ? String.valueOf(body.getOrDefault("reason", "")) : "";
        facade.updateUserStatus(id, status, reason);
        return ResponseEntity.noContent().build();
    }

    // Workout endpoints removed — no workout microservice available

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> stats() {
        return ResponseEntity.ok(facade.stats());
    }
}

