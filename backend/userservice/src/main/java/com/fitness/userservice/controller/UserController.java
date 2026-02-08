package com.fitness.userservice.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitness.userservice.dto.AccountActionRequest;
import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserProfileRequest;
import com.fitness.userservice.dto.UserProfileResponse;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private boolean isAdmin(Jwt jwt) {
        if (jwt == null) return false;

        Object roles = jwt.getClaims().get("https://fitness-app/roles");
        if (roles == null) {
            roles = jwt.getClaims().get("fitness_auth/roles");
        }
        if (roles == null) {
            roles = jwt.getClaims().get("roles");
        }
        if (roles instanceof Iterable<?> iterable) {
            for (Object role : iterable) {
                if (role == null) continue;
                String r = String.valueOf(role);
                if (r.equalsIgnoreCase("admin") || r.equalsIgnoreCase("ROLE_ADMIN") || r.equalsIgnoreCase("ADMIN")) {
                    return true;
                }
            }
        }

        return false;
    }

    private void requireSelfOrAdmin(Jwt jwt, String auth0Id) {
        if (jwt == null || jwt.getSubject() == null) {
            throw new org.springframework.security.access.AccessDeniedException("Missing subject");
        }
        if (jwt.getSubject().equals(auth0Id)) return;
        if (isAdmin(jwt)) return;
        throw new org.springframework.security.access.AccessDeniedException("Forbidden");
    }

    // Returns the logged-in user's profile (requires authenticated token)
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(userService.getCurrentUser(jwt));
    }

    // Create user record after frontend login. Uses auth0 subject from JWT.
    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody RegisterRequest request, @AuthenticationPrincipal Jwt jwt) {
        UserResponse r = userService.createIfNotExists(request, jwt);
        return ResponseEntity.ok(r);
    }

    // Backward-compatible alias used by the frontend client
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request, @AuthenticationPrincipal Jwt jwt) {
        UserResponse r = userService.createIfNotExists(request, jwt);
        return ResponseEntity.ok(r);
    }

    // Frontend uses Auth0 subject (e.g. auth0|abc) as the user id in paths.
    @GetMapping("/{auth0Id}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable String auth0Id, @AuthenticationPrincipal Jwt jwt) {
        requireSelfOrAdmin(jwt, auth0Id);
        return ResponseEntity.ok(userService.getProfile(auth0Id, jwt));
    }

    @PutMapping("/{auth0Id}/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @PathVariable String auth0Id,
            @RequestBody(required = false) UserProfileRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        requireSelfOrAdmin(jwt, auth0Id);
        return ResponseEntity.ok(userService.updateProfile(auth0Id, request, jwt));
    }

    @GetMapping("/{auth0Id}/validate")
    public ResponseEntity<Map<String, Object>> validate(@PathVariable String auth0Id, @AuthenticationPrincipal Jwt jwt) {
        requireSelfOrAdmin(jwt, auth0Id);
        boolean exists = userService.existsByAuth0Id(auth0Id);
        if (!exists) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("valid", true));
    }

    @PostMapping("/{auth0Id}/deactivate")
    public ResponseEntity<Map<String, Object>> deactivate(
            @PathVariable String auth0Id,
            @RequestBody(required = false) AccountActionRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        requireSelfOrAdmin(jwt, auth0Id);
        return ResponseEntity.ok(Map.of("status", "DEACTIVATED"));
    }

    @PostMapping("/{auth0Id}/delete")
    public ResponseEntity<Map<String, Object>> delete(
            @PathVariable String auth0Id,
            @RequestBody(required = false) AccountActionRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        requireSelfOrAdmin(jwt, auth0Id);
        return ResponseEntity.ok(Map.of("status", "DELETED"));
    }

    @PostMapping("/{auth0Id}/reactivate")
    public ResponseEntity<Map<String, Object>> reactivate(@PathVariable String auth0Id, @AuthenticationPrincipal Jwt jwt) {
        requireSelfOrAdmin(jwt, auth0Id);
        return ResponseEntity.ok(Map.of("status", "ACTIVE"));
    }

    @PostMapping("/{auth0Id}/onboarding/complete")
    public ResponseEntity<Map<String, Object>> completeOnboarding(@PathVariable String auth0Id, @AuthenticationPrincipal Jwt jwt) {
        requireSelfOrAdmin(jwt, auth0Id);
        return ResponseEntity.ok(Map.of("completed", true));
    }

    @GetMapping("/{auth0Id}/onboarding/status")
    public ResponseEntity<Map<String, Object>> onboardingStatus(@PathVariable String auth0Id, @AuthenticationPrincipal Jwt jwt) {
        requireSelfOrAdmin(jwt, auth0Id);
        return ResponseEntity.ok(Map.of("completed", true));
    }

    // Optional: admin-only lookup by DB id
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/id/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
