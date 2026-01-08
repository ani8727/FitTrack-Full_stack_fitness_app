package com.fitness.userservice.model;

public enum AccountStatus {
    ACTIVE,           // Account is active and can login
    INACTIVE,         // Account created but not activated
    DEACTIVATED,      // User temporarily deactivated their account
    DELETED,          // Account marked for deletion
    SUSPENDED,        // Admin suspended the account
    BANNED            // Account permanently banned
}
