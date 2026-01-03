package com.fitness.userservice.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UpdateProfileRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository repository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private KeycloakService keycloakService;
    
    @Value("${keycloak.integration.enabled:true}")
    private boolean keycloakIntegrationEnabled;

    public UserResponse register(RegisterRequest request) {
        log.info("Registering user with email: {}", request.getEmail());
        
        // Check if user already exists in database
        if (repository.existsByEmail(request.getEmail())) {
            log.info("User already exists with email: {}", request.getEmail());
            User existingUser = repository.findByEmail(request.getEmail());
            UserResponse userResponse = new UserResponse();
            userResponse.setId(existingUser.getId());
            userResponse.setKeycloakId(existingUser.getKeycloakId());
            userResponse.setEmail(existingUser.getEmail());
            userResponse.setFirstName(existingUser.getFirstName());
            userResponse.setLastName(existingUser.getLastName());
            userResponse.setCreateAt(existingUser.getCreateAt());
            userResponse.setUpdateAt(existingUser.getUpdateAt());
            return userResponse;
        }

        String keycloakUserId = null;
        
        // Create user in Keycloak if integration is enabled
        if (keycloakIntegrationEnabled) {
            try {
                log.info("Creating user in Keycloak: {}", request.getEmail());
                List<String> roles = java.util.List.of("USER");
                
                keycloakUserId = keycloakService.createKeycloakUser(
                    request.getEmail(),
                    request.getFirstName(),
                    request.getLastName(),
                    request.getPassword(),
                    roles
                );
                
                if (keycloakUserId == null) {
                    log.warn("Failed to create user in Keycloak, will use generated ID");
                    keycloakUserId = request.getKeycloakId() != null ? 
                        request.getKeycloakId() : 
                        "local-" + java.util.UUID.randomUUID().toString();
                }
            } catch (Exception e) {
                log.error("Error creating user in Keycloak: {}", e.getMessage());
                keycloakUserId = request.getKeycloakId() != null ? 
                    request.getKeycloakId() : 
                    "local-" + java.util.UUID.randomUUID().toString();
            }
        } else {
            keycloakUserId = request.getKeycloakId() != null ? 
                request.getKeycloakId() : 
                "local-" + java.util.UUID.randomUUID().toString();
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash password
        user.setKeycloakId(keycloakUserId);
        user.setUsername(request.getUsername());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(com.fitness.userservice.model.UserRole.USER);

        User savedUser = repository.save(user);
        UserResponse userResponse = new UserResponse();
        userResponse.setKeycloakId(savedUser.getKeycloakId());
        userResponse.setId(savedUser.getId());
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setFirstName(savedUser.getFirstName());
        userResponse.setLastName(savedUser.getLastName());
        userResponse.setCreateAt(savedUser.getCreateAt());
        userResponse.setUpdateAt(savedUser.getUpdateAt());

        return userResponse;
    }

    @SuppressWarnings("null")
    public UserResponse getUserProfile(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        
        // Try to find by database ID first, then by Keycloak ID
        User user = repository.findById(userId).orElse(null);
        
        if (user == null) {
            // Try finding by Keycloak ID
            user = repository.findByKeycloakId(userId);
            if (user == null) {
                throw new RuntimeException("User Not Found with ID: " + userId);
            }
        }

        return convertToResponse(user);
    }

    public Boolean existByUserId(String userId) {
        log.info("Calling User Validation API for userId: {}", userId);
        try {
            return repository.existsByKeycloakId(userId);
        } catch (Exception e) {
            log.error("Error checking if user exists: {}", e.getMessage());
            return false; // Return false if there's a database error
        }
    }

    // ADMIN METHODS
    
    public List<UserResponse> getAllUsers(String search, String role, String status) {
        return repository.findAll().stream()
                .filter(user -> {
                    if (search == null || search.isBlank()) return true;
                    String s = search.toLowerCase();
                    return (user.getEmail() != null && user.getEmail().toLowerCase().contains(s))
                            || (user.getFirstName() != null && user.getFirstName().toLowerCase().contains(s))
                            || (user.getLastName() != null && user.getLastName().toLowerCase().contains(s))
                            || (user.getKeycloakId() != null && user.getKeycloakId().toLowerCase().contains(s));
                })
                .filter(user -> {
                    if (role == null || role.isBlank()) return true;
                    return user.getRole() != null && user.getRole().toString().equalsIgnoreCase(role);
                })
                .filter(user -> {
                    if (status == null || status.isBlank()) return true;
                    return user.getAccountStatus() != null && user.getAccountStatus().toString().equalsIgnoreCase(status);
                })
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getUserStats() {
        long totalUsers = repository.count();
        long activeUsers = repository.findAll().stream()
                .filter(user -> user.getRole() != null)
                .count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("adminUsers", repository.findAll().stream()
                .filter(user -> "ADMIN".equals(user.getRole().toString()))
                .count());
        return stats;
    }

    @SuppressWarnings("null")
    public UserResponse updateUserStatus(String userId, String status, String reason) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        
        // Try to find by database ID first, then by Keycloak ID
        User user = repository.findById(userId).orElse(null);
        
        if (user == null) {
            user = repository.findByKeycloakId(userId);
            if (user == null) {
                throw new RuntimeException("User Not Found with ID: " + userId);
            }
        }
        
        com.fitness.userservice.model.AccountStatus newStatus;
        try {
            newStatus = com.fitness.userservice.model.AccountStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
        user.setAccountStatus(newStatus);
        if (newStatus == com.fitness.userservice.model.AccountStatus.DEACTIVATED
                || newStatus == com.fitness.userservice.model.AccountStatus.SUSPENDED
                || newStatus == com.fitness.userservice.model.AccountStatus.BANNED) {
            user.setDeactivatedAt(java.time.LocalDateTime.now());
            user.setDeactivationReason(reason);
        }
        if (newStatus == com.fitness.userservice.model.AccountStatus.ACTIVE) {
            user.reactivate();
        }

        User savedUser = repository.save(user);
        return savedUser != null ? convertToResponse(savedUser) : null;
    }
    
    @SuppressWarnings("null")
    public UserResponse updateProfile(String userId, UpdateProfileRequest request) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        
        // Try to find by database ID first, then by Keycloak ID
        User user = repository.findById(userId).orElse(null);
        
        if (user == null) {
            user = repository.findByKeycloakId(userId);
            if (user == null) {
                throw new RuntimeException("User Not Found with ID: " + userId);
            }
        }
        
        // Update basic info
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        
        // Update extended profile
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getAge() != null) user.setAge(request.getAge());
        if (request.getLocation() != null) user.setLocation(request.getLocation());
        if (request.getFitnessGoals() != null) user.setFitnessGoals(request.getFitnessGoals());
        if (request.getAreasToImprove() != null) user.setAreasToImprove(request.getAreasToImprove());
        if (request.getWeaknesses() != null) user.setWeaknesses(request.getWeaknesses());
        if (request.getHealthIssues() != null) user.setHealthIssues(request.getHealthIssues());
        if (request.getHeight() != null) user.setHeight(request.getHeight());
        if (request.getWeight() != null) user.setWeight(request.getWeight());
        if (request.getActivityLevel() != null) user.setActivityLevel(request.getActivityLevel());
        if (request.getDietaryPreferences() != null) user.setDietaryPreferences(request.getDietaryPreferences());
        if (request.getTargetWeeklyWorkouts() != null) user.setTargetWeeklyWorkouts(request.getTargetWeeklyWorkouts());
        
        User savedUser = repository.save(user);
        return savedUser != null ? convertToResponse(savedUser) : null;
    }

    private UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setKeycloakId(user.getKeycloakId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole() != null ? user.getRole().toString() : "USER");
        response.setAccountStatus(user.getAccountStatus() != null ? user.getAccountStatus().toString() : null);
        response.setEmailVerified(user.getEmailVerified());
        response.setLastLoginAt(user.getLastLoginAt());
        response.setGender(user.getGender());
        response.setAge(user.getAge());
        response.setLocation(user.getLocation());
        response.setFitnessGoals(user.getFitnessGoals());
        response.setAreasToImprove(user.getAreasToImprove());
        response.setWeaknesses(user.getWeaknesses());
        response.setHealthIssues(user.getHealthIssues());
        response.setHeight(user.getHeight());
        response.setWeight(user.getWeight());
        response.setActivityLevel(user.getActivityLevel());
        response.setDietaryPreferences(user.getDietaryPreferences());
        response.setTargetWeeklyWorkouts(user.getTargetWeeklyWorkouts());
        response.setCreateAt(user.getCreateAt());
        response.setUpdateAt(user.getUpdateAt());
        return response;
    }
}