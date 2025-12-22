package com.fitness.userservice.controller;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get user profile by DATABASE ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(userService.getUserProfile(id));
    }

    /**
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    /**
     * Validate user existence by KEYCLOAK ID
     */
    @GetMapping("/{keycloakId}/validate")
    public ResponseEntity<Boolean> validateUser(
            @PathVariable @NonNull String keycloakId) {
        return ResponseEntity.ok(userService.existByUserId(keycloakId));
    }
}
