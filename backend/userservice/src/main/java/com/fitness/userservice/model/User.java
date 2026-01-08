package com.fitness.userservice.model;

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

    @Column(unique = true)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;

    @Column(name = "keycloak_id", unique = true)
    private String keycloakId;

    @Column(nullable = false)
    private String password;
    
    // Account Status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus accountStatus = AccountStatus.ACTIVE;
    
    private Boolean emailVerified = false;
    
    private Boolean onboardingCompleted = false;
    
    private LocalDateTime lastLoginAt;
    
    private LocalDateTime deactivatedAt;
    
    private String deactivationReason;
    
    // Extended Profile Information
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    private Integer age;
    
    private String location;
    
    @Column(length = 1000)
    private String fitnessGoals;
    
    @Column(length = 1000)
    private String areasToImprove;
    
    @Column(length = 1000)
    private String weaknesses;
    
    @Column(length = 1000)
    private String healthIssues;
    
    private Double height; // in cm
    
    private Double weight; // in kg
    
    private String activityLevel; // SEDENTARY, LIGHT, MODERATE, ACTIVE, VERY_ACTIVE
    
    @Column(length = 500)
    private String dietaryPreferences;
    
    private Integer targetWeeklyWorkouts;

    @CreationTimestamp
    private LocalDateTime createAt;

    @UpdateTimestamp
    private LocalDateTime updateAt;
    
    // Helper methods
    public boolean isActive() {
        return AccountStatus.ACTIVE.equals(accountStatus);
    }
    
    public boolean canLogin() {
        return isActive() && Boolean.TRUE.equals(emailVerified);
    }
    
    public void markAsDeleted(String reason) {
        this.accountStatus = AccountStatus.DELETED;
        this.deactivatedAt = LocalDateTime.now();
        this.deactivationReason = reason;
    }
    
    public void deactivate(String reason) {
        this.accountStatus = AccountStatus.DEACTIVATED;
        this.deactivatedAt = LocalDateTime.now();
        this.deactivationReason = reason;
    }
    
    public void reactivate() {
        this.accountStatus = AccountStatus.ACTIVE;
        this.deactivatedAt = null;
        this.deactivationReason = null;
    }
}
