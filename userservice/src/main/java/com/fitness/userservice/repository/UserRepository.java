package com.fitness.userservice.repository;

import com.fitness.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Check if a user exists by email
     */
    boolean existsByEmail(String email);

    /**
     * Check if a user exists by Keycloak ID
     */
    boolean existsByKeycloakId(String keycloakId);

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);
}
