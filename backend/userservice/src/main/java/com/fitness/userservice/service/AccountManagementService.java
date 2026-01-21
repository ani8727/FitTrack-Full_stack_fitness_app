package com.fitness.userservice.service;

import com.fitness.userservice.dto.AccountActionRequest;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class AccountManagementService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private User getUserForAction(String userId) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID cannot be null");
        }

        // Auth0 users carry the external id in keycloakId column
        if (userId.startsWith("auth0|")) {
            User user = userRepository.findByKeycloakId(userId);
            if (user == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
            }
            return user;
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @SuppressWarnings("null")
    public void deactivateAccount(String userId, AccountActionRequest request) {
        User user = getUserForAction(userId);
        
        // For Auth0 users (those with auth0| prefix), skip password verification since Auth0 handles authentication
        // For local users, verify password
        if (!userId.startsWith("auth0|")) {
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
            }
            if (user.getPassword() != null && !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
            }
        }
        
        user.deactivate(request.getReason());
        userRepository.save(user);
        log.info("Account deactivated for user: {}", userId);
    }
    
    @SuppressWarnings("null")
    public void deleteAccount(String userId, AccountActionRequest request) {
        User user = getUserForAction(userId);
        
        // For Auth0 users (those with auth0| prefix), skip password verification since Auth0 handles authentication
        // For local users, verify password
        if (!userId.startsWith("auth0|")) {
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
            }
            if (user.getPassword() != null && !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
            }
        }
        
        user.markAsDeleted(request.getReason() != null ? request.getReason() : "User requested deletion");
        userRepository.save(user);
        log.info("Account marked for deletion: {}", userId);
    }
    
    @SuppressWarnings("null")
    public void reactivateAccount(String userId) {
        User user = getUserForAction(userId);
        user.reactivate();
        userRepository.save(user);
        log.info("Account reactivated: {}", userId);
    }
    
    @SuppressWarnings("null")
    public void updateLastLogin(String userId) {
        User user = getUserForAction(userId);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
    }
    
    @SuppressWarnings("null")
    public void completeOnboarding(String userId) {
        User user = getUserForAction(userId);
        user.setOnboardingCompleted(true);
        userRepository.save(user);
        log.info("Onboarding completed for user: {}", userId);
    }
    
    @SuppressWarnings("null")
    public boolean isOnboardingCompleted(String userId) {
        User user = getUserForAction(userId);
        return Boolean.TRUE.equals(user.getOnboardingCompleted());
    }
}
