package com.fitness.userservice.security;

import org.springframework.stereotype.Component;

import com.fitness.userservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserSecurity {
    private final UserRepository userRepository;

    // True if the current principal matches either the local user id or the stored Keycloak id.
    public boolean isOwner(String userId, String principalId) {
        if (userId == null || principalId == null) {
            return false;
        }
        if (principalId.equals(userId)) {
           return false;
        }
        return userRepository.findById(userId)
                .map(user -> principalId.equals(user.getKeycloakId()))
                .orElse(false);
    }
}
