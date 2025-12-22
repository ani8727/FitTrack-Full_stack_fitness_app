package com.fitness.userservice.service;

import java.util.Optional;

import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Register user or return existing user if email already exists
     */
    @Transactional
    public UserResponse register(RegisterRequest request) {

        Optional<User> existingUserOpt = repository.findByEmail(request.getEmail());

        if (existingUserOpt.isPresent()) {
            log.info("User already exists with email: {}", request.getEmail());
            return mapToResponse(existingUserOpt.get());
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setKeycloakId(request.getKeycloakId());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUser = repository.save(user);
        log.info("New user registered with id: {}", savedUser.getId());

        return mapToResponse(savedUser);
    }

    /**
     * Get user profile by database ID
     */
    public UserResponse getUserProfile(@NonNull String userId) {
        User user = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return mapToResponse(user);
    }

    /**
     * Validate user existence using Keycloak ID
     */
    public Boolean existByUserId(String keycloakId) {
        log.info("Validating user existence for keycloakId: {}", keycloakId);
        return repository.existsByKeycloakId(keycloakId);
    }

    /**
     * Maps User entity to UserResponse DTO
     */
    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setKeycloakId(user.getKeycloakId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setCreateAt(user.getCreateAt());
        response.setUpdateAt(user.getUpdateAt());
        return response;
    }
}
