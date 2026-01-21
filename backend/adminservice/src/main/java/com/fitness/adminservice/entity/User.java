package com.fitness.adminservice.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String firstName;
    private String lastName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;
    
    @Column(name = "keycloak_id", unique = true)
    private String keycloakId;
    
    @Column(nullable = false)
    private String password;

    @Column(nullable = true)
    private String accountStatus = "ACTIVE";

    @Column(nullable = true)
    private LocalDateTime deactivatedAt;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String deactivationReason;
    
    @CreationTimestamp
    private LocalDateTime createAt;
    
    @UpdateTimestamp
    private LocalDateTime updateAt;
}
