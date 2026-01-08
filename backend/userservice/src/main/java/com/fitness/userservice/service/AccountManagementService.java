package com.fitness.userservice.service;

import com.fitness.userservice.dto.AccountActionRequest;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class AccountManagementService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @SuppressWarnings("null")
    public void deactivateAccount(String userId, AccountActionRequest request) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        user.deactivate(request.getReason());
        userRepository.save(user);
        log.info("Account deactivated for user: {}", userId);
    }
    
    @SuppressWarnings("null")
    public void deleteAccount(String userId, AccountActionRequest request) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        user.markAsDeleted(request.getReason() != null ? request.getReason() : "User requested deletion");
        userRepository.save(user);
        log.info("Account marked for deletion: {}", userId);
    }
    
    @SuppressWarnings("null")
    public void reactivateAccount(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        user.reactivate();
        userRepository.save(user);
        log.info("Account reactivated: {}", userId);
    }
    
    @SuppressWarnings("null")
    public void updateLastLogin(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
    }
    
    @SuppressWarnings("null")
    public void completeOnboarding(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        user.setOnboardingCompleted(true);
        userRepository.save(user);
        log.info("Onboarding completed for user: {}", userId);
    }
    
    @SuppressWarnings("null")
    public boolean isOnboardingCompleted(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        return Boolean.TRUE.equals(user.getOnboardingCompleted());
    }
}
