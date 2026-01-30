package com.fitness.userservice.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

import org.springframework.security.oauth2.jwt.Jwt;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    public Optional<User> findByAuth0Id(String auth0Id) {
        return repository.findByAuth0Id(auth0Id);
    }

    @Transactional
    public UserResponse createIfNotExists(@NotNull RegisterRequest request, @NotNull Jwt jwt) {
        String auth0Id = jwt.getSubject();
        if (auth0Id == null || auth0Id.isBlank()) {
            throw new IllegalArgumentException("Missing auth0 subject in token");
        }

        return repository.findByAuth0Id(auth0Id)
                .map(this::toResponse)
                .orElseGet(() -> {
                    String email = request.getEmail();
                    if (email == null || email.isBlank()) {
                        email = jwt.getClaimAsString("email");
                    }
                    String name = request.getName();
                    if (name == null || name.isBlank()) {
                        name = jwt.getClaimAsString("name");
                    }

                    User user = User.builder()
                            .auth0Id(auth0Id)
                            .email(email)
                            .name(name)
                            .role("ROLE_USER")
                            .build();

                    User saved = repository.save(user);
                    return toResponse(saved);
                });
    }

    public UserResponse getCurrentUser(Jwt jwt) {
        String auth0Id = jwt.getSubject();
        return repository.findByAuth0Id(auth0Id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Optional<UserResponse> findById(Long id) {
        return repository.findById(id).map(this::toResponse);
    }

    private UserResponse toResponse(User user) {
        UserResponse r = new UserResponse();
        r.setId(user.getId());
        r.setAuth0Id(user.getAuth0Id());
        r.setEmail(user.getEmail());
        r.setName(user.getName());
        r.setRole(user.getRole());
        r.setCreatedAt(user.getCreatedAt());
        return r;
    }
}