package com.fitness.userservice.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UpdateProfileRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get user profile by DATABASE ID
     */
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.name or @userSecurity.isOwner(#userId, authentication.name)")
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable String userId){
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    /**
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request){
        return ResponseEntity.ok(userService.register(request));
    }

    /**
     * Validate user existence by KEYCLOAK ID
     * Note: This endpoint is publicly accessible for service-to-service communication
     */
    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String userId){
        try {
            Boolean exists = userService.existByUserId(userId);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            // Return false if validation fails instead of 500 error
            return ResponseEntity.ok(false);
        }
    }

    /**
     * ADMIN: Get all users
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status){
        return ResponseEntity.ok(userService.getAllUsers(search, role, status));
    }

    /**
     * ADMIN: Get user statistics
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getUserStats(){
        return ResponseEntity.ok(userService.getUserStats());
    }

    /**
     * ADMIN: Update user status
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/{userId}/status")
    public ResponseEntity<UserResponse> updateUserStatus(@PathVariable String userId, @RequestBody Map<String, String> body){
        String status = body.get("status");
        String reason = body.getOrDefault("reason", null);
        return ResponseEntity.ok(userService.updateUserStatus(userId, status, reason));
    }
    
    /**
     * Update user profile with extended information
     */
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.name or @userSecurity.isOwner(#userId, authentication.name)")
    @PutMapping("/{userId}/profile")
    public ResponseEntity<UserResponse> updateProfile(@PathVariable String userId, @Valid @RequestBody UpdateProfileRequest request){
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }
}
