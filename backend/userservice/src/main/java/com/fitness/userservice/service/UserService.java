package com.fitness.userservice.service;

import java.util.Objects;
import java.util.Optional;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserProfileRequest;
import com.fitness.userservice.dto.UserProfileResponse;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    public boolean existsByAuth0Id(String auth0Id) {
        return repository.existsByAuth0Id(auth0Id);
    }

    public Optional<User> findByAuth0Id(String auth0Id) {
        return repository.findByAuth0Id(auth0Id);
    }

    public UserProfileResponse getProfile(String auth0Id, Jwt jwt) {
        return repository.findByAuth0Id(auth0Id)
                .map(this::toProfileResponse)
                .orElseGet(() -> toProfileResponseFromJwt(jwt));
    }

    @Transactional
    @SuppressWarnings("null")
    public UserProfileResponse updateProfile(String auth0Id, UserProfileRequest request, Jwt jwt) {
        User user = repository.findByAuth0Id(auth0Id)
                .orElseGet(() -> {
                    String email = jwt != null ? jwt.getClaimAsString("email") : null;
                    String name = jwt != null ? jwt.getClaimAsString("name") : null;
                    return Objects.requireNonNull(repository.save(User.builder()
                            .auth0Id(auth0Id)
                            .email(email != null ? email : "")
                            .name(name)
                            .role("ROLE_USER")
                            .build()));
                });

        if (request != null) {
            String firstName = request.getFirstName();
            String lastName = request.getLastName();

            String combinedName = combineName(firstName, lastName);
            if (combinedName != null && !combinedName.isBlank()) {
                user.setName(combinedName);
            }
        }

        User saved = Objects.requireNonNull(repository.save(user));
        return toProfileResponse(saved);
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

    @SuppressWarnings("null")
    public Optional<UserResponse> findById(Long id) {
        return repository.findById(Objects.requireNonNull(id, "id")).map(this::toResponse);
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

    private UserProfileResponse toProfileResponse(User user) {
        UserProfileResponse r = new UserProfileResponse();
        r.setEmail(user.getEmail());

        // Best-effort split from the stored full name
        String fullName = user.getName();
        if (fullName != null && !fullName.isBlank()) {
            String[] parts = fullName.trim().split("\\s+", 2);
            r.setFirstName(parts[0]);
            if (parts.length > 1) {
                r.setLastName(parts[1]);
            }
        }
        return r;
    }

    private UserProfileResponse toProfileResponseFromJwt(Jwt jwt) {
        UserProfileResponse r = new UserProfileResponse();
        if (jwt == null) return r;

        r.setEmail(jwt.getClaimAsString("email"));
        String given = jwt.getClaimAsString("given_name");
        String family = jwt.getClaimAsString("family_name");
        if (given != null && !given.isBlank()) r.setFirstName(given);
        if (family != null && !family.isBlank()) r.setLastName(family);
        if ((r.getFirstName() == null || r.getLastName() == null) && jwt.getClaimAsString("name") != null) {
            String name = jwt.getClaimAsString("name");
            if (name != null && !name.isBlank()) {
                String[] parts = name.trim().split("\\s+", 2);
                if (r.getFirstName() == null) r.setFirstName(parts[0]);
                if (parts.length > 1 && r.getLastName() == null) r.setLastName(parts[1]);
            }
        }

        return r;
    }

    private String combineName(String firstName, String lastName) {
        String f = firstName != null ? firstName.trim() : "";
        String l = lastName != null ? lastName.trim() : "";

        if (f.isBlank() && l.isBlank()) return null;
        if (l.isBlank()) return f;
        if (f.isBlank()) return l;
        return f + " " + l;
    }
}