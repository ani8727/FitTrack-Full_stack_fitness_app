package com.fitness.userservice.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public UserResponse register(RegisterRequest request) {
        // Prepare safe defaults for token-based auto registration
        String email = request.getEmail();
        String keycloakId = request.getKeycloakId();
        if (email == null || email.isBlank()) {
            email = (keycloakId != null ? keycloakId : "user") + "@auth.local";
        }
        String password = request.getPassword();
        if (password == null || password.isBlank()) {
            password = "TempPass!234";
        }
        String username = request.getUsername();
        if (username == null || username.isBlank()) {
            username = email.split("@")[0];
        }

        log.info("Registering user with email: {}", email);
        
        // Check if user already exists in database
        if (repository.existsByEmail(email)) {
            log.info("✅ User already exists with email: {}. Returning existing user.", email);
            User existingUser = repository.findByEmail(email);
            return convertToResponse(existingUser);
        }

        // User registration handled by Auth0
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // Hash password
        user.setUsername(username);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setKeycloakId(keycloakId);
        user.setRole(com.fitness.userservice.model.UserRole.USER);

        try {
            User savedUser = repository.save(user);
            log.info("✅ User registered successfully with email: {}", email);
            return convertToResponse(savedUser);
        } catch (DataIntegrityViolationException e) {
            // Handle race condition: another thread inserted the user between our check and insert
            log.warn("⚠️ Race condition detected - user was inserted by another thread. Fetching existing user for email: {}", email);
            User existingUser = repository.findByEmail(email);
            if (existingUser != null) {
                return convertToResponse(existingUser);
            }
            log.error("❌ Failed to handle duplicate registration for email: {}", email, e);
            throw new RuntimeException("Failed to register user: duplicate email detected but unable to retrieve existing user", e);
        }
    }

    public UserResponse getUserProfile(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("User ID cannot be null or blank");
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
        // Fixed potential null pointer dereference in getAllUsers
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
            .filter(user -> user.getAccountStatus() != null && user.getAccountStatus().toString().equalsIgnoreCase("ACTIVE"))
            .count();

        long adminUsers = repository.findAll().stream()
            .filter(user -> user.getRole() != null && "ADMIN".equalsIgnoreCase(user.getRole().toString()))
            .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("adminUsers", adminUsers);
        return stats;
    }

    /**
     * Scan users and set a default AccountStatus for any records that have null.
     * Returns the number of users updated. This can be invoked by an admin or
     * during a maintenance run to normalize stored data.
     */
    public int normalizeAccountStatuses() {
        List<User> usersWithNullStatus = repository.findAll().stream()
                .filter(u -> u.getAccountStatus() == null)
                .collect(Collectors.toList());
        if (usersWithNullStatus.isEmpty()) return 0;
        usersWithNullStatus.forEach(u -> u.setAccountStatus(com.fitness.userservice.model.AccountStatus.ACTIVE));
        repository.saveAll(usersWithNullStatus);
        return usersWithNullStatus.size();
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
        response.setAccountStatus(user.getAccountStatus() != null ? user.getAccountStatus().toString() : "UNKNOWN");
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